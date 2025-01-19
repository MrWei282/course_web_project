import sys
import psycopg2
import hashlib
import jwt
import re
import os
import json
import psycopg2
import datetime
from psycopg2 import pool
from src import config
from src.error import InputError, AccessError
from src.helpers import *
from db.create_queries import CREATE_USERS_TABLE, CREATE_TOKENS_TABLE
from db.login_queries import *
from db.funcs.db_auth import *
from db.funcs.db_quiz import *
from db.funcs.db_course import *
from db.funcs.db_gamification import *
from db.funcs.db_user_profile import *
from src import db_connect
from src.user_profile import attach_badge_to_user

def get_quiz_list(token, course_id):
    
    """
    returns list of quizes avaiable for students in the 
    course to attempt
    
    Args:
        course_id: id of course
        user_id: id of user looking at all quizes in a course

    Returns:
        quizzes (dictionary): list of dictionaries, dictionary parameters are:
                                - quiz_id (int): id of quiz
                                - title (text): title of quiz
                                - course_id (int): id of course
                                - creator_id (int): id of creator of quiz
                                - create_time (timestamp): time of quiz creation
                                - deadline (timestamp): due time of quiz
    """    
    user_id = check_validity(token)
    role = get_user_info(user_id)["user_role"]
    if role == "student":
        if not check_in_course_enrolled(user_id, course_id):
            raise AccessError("not enrolled to the course")
    else:
        if not is_staff_in_course(user_id, course_id):
            raise AccessError("not an admin in this course")
    
    quiz_ids = get_quizzes_in_course(course_id)
    quizzes = []
    for quiz_id in quiz_ids:
        quiz_info = get_quiz_info(quiz_id)
        quiz = {
            "quiz_id": quiz_id[0],
            "title": quiz_info["title"],
            "course_id": quiz_info["course_id"],
            "class_id": quiz_info["class_id"],
            "creator_id": quiz_info["creator_id"],
            "create_time": quiz_info["create_time"],
            "deadline": quiz_info["deadline"],
            "quiz_points": quiz_info["quiz_points"]
        }
        quizzes.append(quiz)
           
    return {
        "quizzes": quizzes
    }

def quiz_create(token, title, course_id, class_id, deadline, quiz_points, questions):
    """
    instructor creates a quiz for a course

    Args:
        title (text): name of quiz
        course_id (int): id of course
        creator_id (int): id of instructor who created the quiz
        deadline (timestamp): time of quiz creation
        questions (dictionary): dictionary of question dictionaries 
        quiz_points (int): points quiz is worth
                                e.g.
                                "question 1": {
                                    "type": "multiple_choice",
                                    "question": "What is 2 + 2",
                                    "file_base64": "egsjo",
                                    "choice_A": "1",
                                    "choice_B": "2",
                                    "choice_C": "3",
                                    "choice_D": "4",
                                    "correct_choice": "D"
                                },
                                "question 2": {
                                    "type": "short_answer",
                                    "question": "Explain why the Lorax is a cinematic masterpiece",
                                    "max_mark": 10,
                                    "file_base64": "egsjo"
                                },
                                "question 3": {
                                    "type": "multiple_choice",
                                    "question": "What is 3 + 3",
                                    "file_base64": "egsjo",
                                    "choice_A": "6",
                                    "choice_B": "4",
                                    "choice_C": "7",
                                    "choice_D": "4",
                                    "correct_choice": "A"
                                }
                                Note: question 1 and 3 are
                                multiple_choice and question 2
                                is short_answer
    Returns:
        quiz_id (int): id of quiz
    """    
    creator_id = check_validity(token)
    role = get_user_info(creator_id)["user_role"]
    if role == "student":
        raise AccessError("Cannot create quizes")
    else:
        if not is_staff_in_course(creator_id, course_id):
            raise AccessError("not an admin in this course")    
    
    create_time = datetime.datetime.now()
    
    # create quiz "insert_quiz()"
    quiz_id = insert_quiz(title, course_id, class_id, creator_id, create_time, deadline, quiz_points)
    
    # using quiz_id, insert "questions" into quiz
    # using "add_short_answer_question()" and
    # "add_multiple_choice_question()"
    
    for question in questions.items():
        if question[1]['type'] == 'multiple_choice':
            add_multiple_choice_question(quiz_id, 'multiple_choice', question[1]["question"], 1, question[1]["file_base64"], question[1]["choice_A"], question[1]["choice_B"], question[1]["choice_C"], question[1]["choice_D"], question[1]["correct_choice"])
            
        elif question[1]['type'] == 'short_answer':
            add_short_answer_question(quiz_id, 'short_answer', question[1]["question"], question[1]["max_mark"], question[1]["file_base64"])
            
    return {
        "quiz_id": quiz_id
    }

def quiz_submit(token, quiz_id, course_id, response):
    """
    student submits their attempt to the quiz

    Args:
        quiz_id (int): id of quiz
        user_id (int): id of user
        course_id (int): id of course
        response (dictionary): students answers e.g.
                                {
                                    "question 1": "D",
                                    "question 2": "yes I have",
                                    "question 3": "A"
                                }

    Returns:
        submission_id (int) : id of the quiz submission
    """    
    user_id = check_validity(token)
    role = get_user_info(user_id)["user_role"]
    if role != "student":
        raise AccessError("Cannot submit quiz")
    else:
        if not check_in_course_enrolled(user_id, course_id):
            raise AccessError("not a student in this course")
        
    if is_quiz_already_submitted(user_id, quiz_id):
        raise AccessError("only one attempt available")

    submit_time = datetime.datetime.now()
    submission_id = create_user_quiz_attempt(user_id, quiz_id)
    update_attempt_submission_time(submit_time, submission_id)  
    questions = get_questions_for_quiz(quiz_id)
    response_list = list(response.values())
    
    for i in range(len(questions)):
        question_id = questions[i][0]
        submitted_answer = response_list[i]
        submit_quiz_answer(question_id, submission_id, user_id, submitted_answer)
       
    # give points to student
    quiz_points = get_quiz_points_worth(quiz_id)
    points_balance = get_students_points_balance(user_id, course_id)
    new_balance = points_balance + quiz_points
    update_student_points_balance(new_balance, user_id, course_id)
    
    # mission tracking
    mission_ids = get_course_missions_by_type(course_id, "quiz")
    for mission_id in mission_ids:
        if get_mission_tracker_count(mission_id, user_id)["is_achieved"] != True:
            curr = get_mission_tracker_count(mission_id, user_id)["counter"]
            goal = get_mission_info(mission_id)["condition"]
            
            curr = curr + 1
            update_mission_counter(curr, mission_id, user_id)
            
            if curr >= goal:
                update_mission_achieved(mission_id, user_id)
                attach_badge_to_user(user_id, "quiz_badge")
                
                points = get_mission_info(mission_id)["points"]
                old_balance = get_students_points_balance(user_id, course_id)
                new_balance = old_balance + points
                update_student_points_balance(new_balance, user_id, course_id)
                
    
    
    return {
        "quiz_submission_id": submission_id
    }

def quiz_mark(token, quiz_id, student_id, marking, course_id, feedback):
    """
    marks a students quiz submission

    Args:
        quiz_id (int): id of quiz
        quiz_submission_id (int): id of quiz_submission
        user_id (int): id of instructor marking the quiz
        student_id (int): id of student who attempted the quiz
        marking (dictionary): dictionary with values representing the mark given for the corresponding short answer question
                            e.g.
                            {
                                "question 2": 3,
                                "question 4": 7
                            }
                            Note: we skip question 1 and 3
                            because those are multiple choice
                            and are automatically marked
        course_id (id): id of course
        feedback (text): feedback given by teacher for quiz overall

    Returns:
        total_mark: marks earned by student
        max_total_mark: 100% of marks
    """    
    user_id = check_validity(token)
    role = get_user_info(user_id)["user_role"]
    if role == "student":
        raise AccessError("Cannot mark quiz")
    else:
        if not is_staff_in_course(user_id, course_id):
            raise AccessError("not an admin in this course")
    
    questions = get_questions_for_quiz(quiz_id)
    response = get_user_submitted_quiz(quiz_id, student_id)
    markings = list(marking.values())
    
    long_response_no = 0
    total_mark = 0
    max_total_mark = 0
    
    
    for i in range(len(questions)):
        if questions[i][1] == "multiple_choice":
            max_total_mark = max_total_mark + 1
            if questions[i][9] == response[i][2]:
                total_mark = total_mark + 1
        if questions[i][1] == "short_answer":
            total_mark = total_mark + markings[long_response_no]
            long_response_no = long_response_no + 1
            max_total_mark = max_total_mark + questions[i][3]
      
    #mark_quiz(quiz_submission_id, total_mark, max_total_mark, feedback)  
    update_submission_mark(total_mark, max_total_mark, student_id, quiz_id, feedback)
      
    return {
        "total_mark": total_mark,
        "max_total_mark": max_total_mark
    }

def quiz_release(token, quiz_id, course_id):
    """
    releases marks to all students who completed quiz (quiz_id)
    in a course (course_id)
    
    Args:
        quiz_id (int): id of quiz to be released
        user_id (int): id of instructor releasing marks
        course_id (int): id of course

    Returns:
        quiz_id (int): id of quiz to be released
    """    
    user_id = check_validity(token)
    role = get_user_info(user_id)["user_role"]
    if role == "student":
        raise AccessError("Cannot release quizes")
    else:
        if not is_staff_in_course(user_id, course_id):
            raise AccessError("not an admin in this course") 
        
    release_quiz(quiz_id)
        

    return {
        "quiz_id": quiz_id
    }

def quiz_view_submission(token, quiz_id):
    """
    given user_id of a student, view the answers
    submitted for a specific quiz (quiz_id)

    Args:
        user_id (int): id of student 
        quiz_id (int): id of quiz

    Returns:
        submission (list): list of dictionaries with following parameters:
                    - question_id (int): id of question
                    - question (text): string of the question
                    - submitted_response (text): response entered by student
    """    
    user_id = check_validity(token)
    ret = get_user_submitted_quiz(quiz_id, user_id)
    ans = []
    for item in ret:
    
        i = {
            "question_id": item[0],
            "question": get_question_info(item[0])["question"],
            "submitted_response": item[2]   
        }
        ans.append(i)
        
    return {
        "submission": ans
    }
        

def quiz_view_released_marks(token, course_id):
    user_id = check_validity(token)
    ret = view_released_quizes(user_id, course_id)
    ans = []
    for item in ret:
        i = {
            "quiz_submission_id": item[0],
            "quiz_id": item[2],
            "mark": item[6],
            "max_mark": item[7],
            "feedback": item[8]
        }
        set_viewed_quiz(item[0])
        ans.append(i)
    
    
    return {
        "released": ans
    }

def quiz_get_questions(token, quiz_id, course_id):
    """
    given a quiz from a course, return list of question 
    and related info
    
    Args:
        user_id (int): id of student getting questions 
        quiz_id (int): id of quiz
        course_id (int): if of course

    Returns:
        questions (list): returns list of dictionaries with following parameters
                     - "quiz_id": The ID of the quiz the question belongs to.
                      - "type": The type of the question.
                      - "question": The question text.
                      - "max_mark": The maximum mark for the question.
                      - "file_base64": base64 string of file
                      - "choice_A": The choice A for multiple-choice questions.
                      - "choice_B": The choice B for multiple-choice questions.
                      - "choice_C": The choice C for multiple-choice questions.
                      - "choice_D": The choice D for multiple-choice questions.
    """    
    user_id = check_validity(token)
    role = get_user_info(user_id)["user_role"]
    if role == "student":
        if not check_in_course_enrolled(user_id, course_id):
            raise AccessError("not enrolled to the course")
    else:
        if not is_staff_in_course(user_id, course_id):
            raise AccessError("not an admin in this course")

    questions = get_questions_for_quiz(quiz_id)
    list_questions = []
    for question in questions:
        i = {
            "question_id": question[0],
            "type": question[1],
            "question": question[2],
            "max_mark": question[3],
            "file_base64": question[4],
            "choice_A": question[5],
            "choice_B": question[6],
            "choice_C": question[7],
            "choice_D": question[8]
        }
        list_questions.append(i)
    return {
        "questions": list_questions
    }
                       
def quiz_view_submissions_to_mark(token, quiz_id):   
    user_id = check_validity(token)
    ret = get_quiz_submissions_all(quiz_id)
    ans = []
    print(ret)
    for item in ret:
        quiz = get_user_submitted_quiz(quiz_id, item[1])
        resp = []
        for part in quiz:
        
            j = {
                "question_id": part[0],
                "question": get_question_info(part[0])["question"],
                "submitted_response": part[2]   
            }
            resp.append(j)
        
        i = {
            "submission_id": item[0],
            "user_id": item[1],
            "submit_time": item[2],
            "is_marked": item[3],
            "is_released": item[4],
            "total_mark": item[5],
            "max_total_mark": item[6],
            "response": resp
        }
        ans.append(i)
    
    
    return {
        "submissions": ans
    }