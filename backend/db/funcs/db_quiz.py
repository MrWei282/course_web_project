import sys
import psycopg2
import hashlib
import jwt
import re
import os
import json
import psycopg2
from psycopg2 import pool
from src import config
from src.error import InputError, AccessError
from src.helpers import *
from db.create_queries import *
from db.login_queries import *
from db.course_queries import *
from db.class_queries import *
from db.resource_queries import *
from db.assignment_queries import *
from db.quiz_queries import *
from src import db_connect

def get_quizzes_in_course(course_id):
    """
    Retrieves quizzes associated with a given course ID.

    Args:
        course_id (int): The id of the course to retrieve quizzes for.
        class_id (int): The id of the course to retrieve quizzes for.

    Returns:
        list: A list of quizzes associated with the specified course ID and class ID. Each quiz is represented as a tuple. Returns empty list if no quizzes are found.

    """
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(GET_QUIZZES_IN_COURSE, (course_id,))
            quiz = cursor.fetchall()
    db_connect.connection_pool.putconn(connection)
    if quiz != []:
        return quiz
    return []

def get_quiz_info(quiz_id):
    """
    Retrieves information about a quiz with the given quiz ID.

    Args:
        quiz_id (int): The ID of the quiz to retrieve information for.

    Returns:
        dict: A dictionary containing information about the quiz, including the quiz title, course ID, creator ID, creation time, and deadline. If no quiz is found, an empty dictionary is returned.

    """
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(GET_QUIZ_INFO, (quiz_id,))
            quiz = cursor.fetchall()
    db_connect.connection_pool.putconn(connection)
    if quiz != []:
        return {
            "title": quiz[0][0],
            "course_id": quiz[0][1],
            "class_id": quiz[0][2],
            "creator_id": quiz[0][3],
            "create_time": quiz[0][4],
            "deadline": quiz[0][5],
            "quiz_points": quiz[0][6],
        }
    return {}

def insert_quiz(title, course_id, class_id, creator_id, create_time, deadline, quiz_points):
    """
    Inserts a new quiz into the database.

    Args:
        title (str): The title of the quiz.
        course_id (int): The ID of the course to which the quiz belongs.
        creator_id (int): The ID of the creator/author of the quiz.
        create_time (datetime.datetime): The date and time when the quiz was created.
        deadline (datetime.datetime): The deadline for completing the quiz.

    Returns:
        int: The ID of the inserted quiz.

    """
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(CREATE_QUIZ, (title, course_id, class_id, creator_id, create_time, deadline, quiz_points,))
            quiz_id = cursor.fetchone()[0]
    db_connect.connection_pool.putconn(connection)
    return quiz_id

def add_short_answer_question(quiz_id, type, question, max_mark, file_base64):
    """
    Adds a short answer question to a quiz.

    Args:
        quiz_id (int): The ID of the quiz to which the question belongs.
        type (str): The type of the question.
        question (str): The text of the question.
        max_mark (int): The maximum mark for the question.
        file_base64 (str): base64 string of file

    Returns:
        int: The ID of the added question.

    """
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(CREATE_QUIZ_SHORT_ANSWER_QUESTIONS, (quiz_id, type, question, max_mark, file_base64,))
            question_id = cursor.fetchone()[0]
    db_connect.connection_pool.putconn(connection)
    return question_id

def add_multiple_choice_question(quiz_id, type, question, max_mark, file_base64, choice_A, choice_B, choice_C, choice_D, correct_choice):
    """
    Adds a multiple-choice question to a quiz.

    Args:
        quiz_id (int): The ID of the quiz to which the question belongs.
        type (str): The type of the question.
        question (str): The text of the question.
        max_mark (int): The maximum mark for the question.
        file_base64 (str): base64 string of file
        choice_A (str): The text for choice A.
        choice_B (str): The text for choice B.
        choice_C (str): The text for choice C.
        choice_D (str): The text for choice D.
        correct_choice (str): The correct choice (A, B, C, D)

    Returns:
        int: The ID of the added question.

    """
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(CREATE_QUIZ_MULTIPLE_CHOICE_QUESTIONS, (quiz_id, type, question, max_mark, file_base64, choice_A, choice_B, choice_C, choice_D, correct_choice,))
            question_id = cursor.fetchone()[0]
    db_connect.connection_pool.putconn(connection)
    return question_id

def submit_quiz_answer(question_id, submission_id, user_id, submitted_answer):
    """
    Submits an answer for an individial quiz question.

    Args:
        question_id (int): The ID of the quiz question.
        submission_id (int): The ID of the quiz submission.
        user_id (int): The ID of the student submitting
        submitted_answer (str): The submitted answer.

    Returns:
        int: The ID of the submitted answer.

    """
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(SUBMIT_QUIZ_ANSWER, (question_id, submission_id, user_id, submitted_answer,))
            answer_id = cursor.fetchone()[0]
    db_connect.connection_pool.putconn(connection)
    return answer_id

def mark_quiz(submission_id, mark, max_mark, feedback):
    """
    Marks an answer to a quiz question given submission and saves the mark and feedback.

    Args:
        submission_id (int): The ID of the quiz submission.
        mark (float): The mark to assign to the submitted answer.
        feedback (str): The feedback to provide for the submitted answer.

    Returns:
        int: The ID of the mark.

    """
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(MARK_QUIZ, (submission_id, mark, max_mark, feedback,))
            mark_id = cursor.fetchone()[0]
    db_connect.connection_pool.putconn(connection)
    return mark_id

def update_submission_mark(total_mark, max_total_mark, user_id, quiz_id, feedback):
    """
    Updates the total mark for a quiz submission and sets submission is_marked to true

    Args:
        total_mark (int): The total mark achieved in the submission.
        max_total_mark(int): tota marks achievable
        user_id (int): The ID of the user.
        quiz_id (int): The ID of the quiz.
        feedback (text): feedback
    """
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(UPDATE_QUIZ_MARK_STATUS, (total_mark, max_total_mark, feedback, user_id, quiz_id,))
    db_connect.connection_pool.putconn(connection)
    
def get_user_quiz_submission_info(quiz_id, user_id):
    """
    Retrieves the information of a user's quiz submission for a specific quiz.

    Args:
        quiz_id (int): The ID of the quiz.
        user_id (int): The ID of the user.

    Returns:
        dict: A dictionary containing the information of the user's quiz submission, or an empty list if no submission is found. The dictionary has the following keys:
            - "id" (int): The ID of the submission.
            - "submit_time" (datetime.datetime): The submission time.
            - "is_marked" (bool): Indicates whether the submission has been marked.
            - "total_mark" (float): The total mark achieved in the submission.

    """
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(GET_QUIZ_SUBMISSIONS_INFO, (quiz_id, user_id,))
            submission = cursor.fetchall()
    db_connect.connection_pool.putconn(connection)
    if submission != []:
        return {
            "id": submission[0][0],
            "submit_time": submission[0][1],
            "is_marked": submission[0][2],
            "total_mark": submission[0][3]
        }
    return []

def get_questions_for_quiz(quiz_id):
    """
    Retrieves the questions for a specific quiz.

    Args:
        quiz_id (int): The ID of the quiz.

    Returns:
        list: A list of tuples representing the questions for the quiz. Each tuple contains the following elements:
            - Question ID (int)
            - Question type (str)
            - Question text (str)
            - Maximum mark (int)
            - File ID (None or int)
            - Choice A (None or str)
            - Choice B (None or str)
            - Choice C (None or str)
            - Choice D (None or str)
            - Correct Choice (None or str)

    """
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(GET_QUIZ_QUESTIONS, (quiz_id,))
            questions = cursor.fetchall()
    db_connect.connection_pool.putconn(connection)
    return questions

def get_user_submitted_quiz(quiz_id, user_id):
    """
    Retrieves the submitted answers by a user for a quiz that have not been marked.

    Args:
        quiz_id (int): The ID of the quiz.
        user_id (int): The ID of the user.

    Returns:
        list: A list of tuples representing the unmarked submitted answers by the user for the quiz.
              Each tuple contains the following information:
              - question_id (int): The ID of the question.
              - submission_id (int): The ID of the submission.
              - submitted_answer (str): The submitted answer.

              If there are no unmarked submitted answers, an empty list is returned.
    """
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(GET_USER_QUIZ_SUBMITTED_ANSWERS, (quiz_id, user_id,))
            answers = cursor.fetchall()
    db_connect.connection_pool.putconn(connection)  

    return answers

def get_question_info(question_id):
    """
    Retrieves information about a question.

    Args:
        question_id (int): The ID of the question.

    Returns:
        dict or list: If the question exists, returns a dictionary containing the question information with keys:
                      - "quiz_id": The ID of the quiz the question belongs to.
                      - "type": The type of the question.
                      - "question": The question text.
                      - "max_mark": The maximum mark for the question.
                      - "file_base64": base64 string of file
                      - "choice_A": The choice A for multiple-choice questions.
                      - "choice_B": The choice B for multiple-choice questions.
                      - "choice_C": The choice C for multiple-choice questions.
                      - "choice_D": The choice D for multiple-choice questions.

                    If the question does not exist, returns an empty list.
    """
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(GET_QUESTION_INFO, (question_id,))
            questions = cursor.fetchall()
    db_connect.connection_pool.putconn(connection)
    if questions != []:
        return {
            "quiz_id": questions[0][0],
            "type": questions[0][1],
            "question": questions[0][2],
            "max_mark": questions[0][3],
            "file_base64": questions[0][4],
            "choice_A": questions[0][5],
            "choice_B": questions[0][6],
            "choice_C": questions[0][7],
            "choice_D": questions[0][8]       
        }
    return []

def check_submission_date(user_id, quiz_id):
    """
    Checks the submission date for a user's completed quiz attempt.

    Args:
        user_id (int): The ID of the user.
        quiz_id (int): The ID of the quiz.

    Returns:
        tuple:  If the user has a submission for the quiz, returns a tuple containing the submission date.
                If the user does not have a submission, returns an empty list.

    """
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(CHECK_SUBMISSION_DATE, (user_id, quiz_id,))
            date = cursor.fetchall()
    db_connect.connection_pool.putconn(connection)
    if date != []:
        return date[0]
    return []   

def get_user_marked_quizzes(user_id):
    """
    Retrieves the marked quizzes for a specific user.

    Args:
        user_id (int): The ID of the user.

    Returns:
        list: A list of tuples representing the marked quizzes. Each tuple contains the following information:
            - quiz_id (int): The ID of the quiz.
            - user_id (int): The ID of the student.
            - submit_time (datetime.datetime): The submission time.
            - is_marked (boolean): The grading status
            - total_mark (int): The total mark achieved in the quiz.

    """
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(GET_MARKED_QUIZ, (user_id,))
            quizzes = cursor.fetchall()
    db_connect.connection_pool.putconn(connection)
    return quizzes

def create_user_quiz_attempt(user_id, quiz_id):
    """
    Starts a quiz attempt for a user.

    Args:
        user_id (int): The ID of the user.
        quiz_id (int): The ID of the quiz.

    Returns:
        int: The ID of the created quiz attempt, or an empty list if creation failed.

    """
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(SUBMIT_QUIZ, (user_id, quiz_id,))
            quiz_id = cursor.fetchone()
    db_connect.connection_pool.putconn(connection)
    if quiz_id != []:
        return quiz_id[0]
    return quiz_id

def update_attempt_submission_time(submit_time, submission_id):
    """
    Adds the submission time for a quiz attempt.

    Args:
        submit_time (datetime.datetime): The submission time.
        submission_id (int): The ID of the quiz submission.
        
    """
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(UPDATE_SUBMIT_TIME, (submit_time, submission_id,))
    db_connect.connection_pool.putconn(connection)
    
def release_quiz(quiz_id):
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(RELEASE_QUIZ, (quiz_id,))
    db_connect.connection_pool.putconn(connection)

def view_released_quizes(user_id, course_id):
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(GET_RELEASED_QUIZZES, (user_id, course_id,))
            ret = cursor.fetchall()
    db_connect.connection_pool.putconn(connection)
    if ret != []:
        return ret
    return []

def is_quiz_already_submitted(user_id, quiz_id):
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(CHECK_ALREADY_SUBMITTED, (user_id, quiz_id,))
            ret = cursor.fetchall()
    db_connect.connection_pool.putconn(connection)
    if ret == []:
        return False
    return True


def get_quiz_submissions_all(quiz_id):
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(GET_QUIZ_SUBMISSIONS_ALL, (quiz_id,))
            submission = cursor.fetchall()
    db_connect.connection_pool.putconn(connection)
    if submission != []:
        return submission
    return []

def update_quiz_submission_view(user_id, quiz_id):
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(UPDATE_QUIZ_SUBMISSION_VIEW, (user_id, quiz_id,))
    db_connect.connection_pool.putconn(connection)
    
def get_quiz_submission_view_status(user_id, quiz_id):
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(GET_QUIZ_SUBMISSION_VIEW_STATUS, (quiz_id, user_id,))
            status = cursor.fetchall()
    db_connect.connection_pool.putconn(connection)  
    return status
    
def check_quiz_submission_viewed(user_id, quiz_id):
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(IS_QUIZ_SUBMISSION_VIEWED, (user_id, quiz_id,))
            info = cursor.fetchall()
    db_connect.connection_pool.putconn(connection)  
    if info == []:
        return False
    return True
    