import psycopg2
from db.funcs.db_auth import *
from db.funcs.db_course import *
from db.funcs.db_class import *
from db.funcs.db_resource import *
from db.funcs.db_file import *
from db.funcs.db_assignment import *
from db.funcs.db_gamification import *
from db.funcs.db_user_profile import *
from src.helpers import *
from src.error import InputError, AccessError
from src.user_profile import attach_badge_to_user

# all user dashboard
def get_assignments(token, course_id):
    user_id = check_validity(token)
    role = get_user_info(user_id)["user_role"]
    if role == "student":
        if not check_in_course_enrolled(user_id, course_id):
            raise AccessError("not enrolled to the course")
    else:
        if not is_staff_in_course(user_id, course_id):
            raise AccessError("not an admin in this course")

    course_info = get_course_assignments(course_id)
    all_assignment_info = []
    for assignment_id in course_info:
        assignment_info = get_assignment_info(assignment_id)
        assignment_detail = {
            "assignment_id": assignment_id[0],
            "assignment_description": assignment_info["assignment_description"],
            "assignment_grade": assignment_info["assignment_grade"],
            "assignment_percentage": assignment_info["assignment_percentage"],
            "assignment_due_date":assignment_info["assignment_due_date"],
            "assignment_course":assignment_info["course_id"],
            "file": assignment_info["file_id"],
            "class_id": assignment_info["class_id"],
            "assignment_points": assignment_info["assignment_points"]
        }
        all_assignment_info.append(assignment_detail)
    
    return {
        "all_assignment_info": all_assignment_info
    }

def create_assignment(token, course_id, assignment_name, assignment_description, assignment_grade, assignment_percentage, file_string, due_date, class_id, assignment_points):
    user_id = check_validity(token)
    role = get_user_info(user_id)["user_role"]
    if role == "student":
        raise AccessError("Cannot upload assignment")
    else:
        if not is_staff_in_course(user_id, course_id):
            raise AccessError("not an admin in this course")
    file_id = insert_file(file_string, assignment_name, user_id)
    assignment_id = insert_assignment(course_id, due_date, assignment_grade, assignment_description, assignment_percentage, file_id, class_id, assignment_points)
    return {
        "assignment_id": assignment_id
    }

def create_submission(token, course_id, assignment_id, submission_name, file_string, submit_time, max_grade):
    user_id = check_validity(token)
    role = get_user_info(user_id)["user_role"]
    if role != "student":
        raise AccessError("Cannot upload submission")
    else:
        if not check_in_course_enrolled(user_id, course_id):
            raise AccessError("not a student in this course")
    file_id = insert_file(file_string, submission_name, user_id)

    percentage = get_assignment_info(assignment_id)["assignment_percentage"]

    submission_id = insert_submission(assignment_id, file_id, user_id, submit_time, max_grade, percentage)
    
    # give points to student
    assignment_points = get_assignment_points_worth(assignment_id)
    points_balance = get_students_points_balance(user_id, course_id)
    new_balance = points_balance + assignment_points
    update_student_points_balance(new_balance, user_id, course_id)
    
    # mission tracking
    mission_ids = get_course_missions_by_type(course_id, "assignment")
    for mission_id in mission_ids:
        if get_mission_tracker_count(mission_id, user_id)["is_achieved"] != True:
            curr = get_mission_tracker_count(mission_id, user_id)["counter"]
            goal = get_mission_info(mission_id)["condition"]
            
            curr = curr + 1
            update_mission_counter(curr, mission_id, user_id)
            
            if curr >= goal:
                update_mission_achieved(mission_id, user_id)
                attach_badge_to_user(user_id, "assignment_badge")
                
                points = get_mission_info(mission_id)["points"]
                old_balance = get_students_points_balance(user_id, course_id)
                new_balance = old_balance + points
                update_student_points_balance(new_balance, user_id, course_id)
                
                
    return {
        "submission_id": submission_id
    }
    
# get submissions from assignment in course
def get_submissions(token, course_id, assignment_id, get_student_submissions = False):
    user_id = check_validity(token)
    role = get_user_info(user_id)["user_role"]
    if role == "student":
        if not get_student_submissions:
            raise AccessError("not allowed to view submissions")
    else:
        if not is_staff_in_course(user_id, course_id):
            raise AccessError("not an admin in this course")
    
    assignment_info = get_submissions_from_ass(assignment_id)
    all_submission_info = []
    for submission_id in assignment_info:
        submission_info = get_submission_info(submission_id)
        submission_detail = {
            "submission_id": submission_id[0],
            "submission_time": submission_info["submit_time"],
            "submission_note": submission_info["feedback"],
            "assignment_max_grade": submission_info["max_grade"],
            "assignment_percentage": submission_info["percentage"],
            "assignment_grade": submission_info["grade"],
            "submission_uploader": submission_info["student_id"],
            "assignment": submission_info["ass_id"],
            "file": submission_info["file_id"],
            "is_released": submission_info["is_released"],
            "is_viewed": submission_info["is_viewed"]
        }
        all_submission_info.append(submission_detail)
    
    return {
        "all_submission_info": all_submission_info
    }

def mark_submission(token, course_id, submission_id, grade, feedback):
    user_id = check_validity(token)
    role = get_user_info(user_id)["user_role"]
    if role == "student":
        raise AccessError("Cannot mark submissions,")
    else:
        if not is_staff_in_course(user_id, course_id):
            raise AccessError("not an admin in this course")
    update_marking(feedback, grade, submission_id)
    
    return

# lets students collect submission
# will return error if not released yet
def view_submission(token, submission_id):
    user_id = check_validity(token)
    
    # make a check to see if submission exists and belongs
    # to student
    if not does_submission_belong_to_user(user_id, submission_id):
        raise AccessError("file does not exist or does not belong to you")

    if check_submission_released(submission_id) == False:
        raise AccessError("Assignment marks not released")
        
    submission_info = get_submission_info(submission_id)

    submission_detail = {
        "submission_id": submission_id[0],
        "submission_time": submission_info["submit_time"],
        "submission_note": submission_info["feedback"],
        "assignment_max_grade": submission_info["max_grade"],
        "assignment_percentage": submission_info["percentage"],
        "assignment_grade": submission_info["grade"],
        "submission_uploader": submission_info["student_id"],
        "assignment": submission_info["ass_id"],
        "file": submission_info["file_id"],
    }
    set_viewed_ass(submission_id)
    return {
        "submission_info": submission_detail
    }

def get_student_submissions(token, course_id, assignment_id):
    user_id = check_validity(token)
    role = get_user_info(user_id)["user_role"]
    if role == "student":
        if not check_in_course_enrolled(user_id, course_id):
            raise AccessError("not enrolled to the course")
    else:
        if not is_staff_in_course(user_id, course_id):
            raise AccessError("not an admin in this course")
    
    all_submissions = get_submissions(token, course_id, assignment_id, True)
    student_submission_info = []
    for submission_info in all_submissions['all_submission_info']:
        if submission_info["submission_uploader"] == user_id:
            
            grade = submission_info["assignment_grade"]
            id = submission_info["submission_id"]
            note = submission_info["submission_note"]
            viewed = submission_info["is_viewed"]
            
            if check_submission_released(id) == False:
                grade = None
                note = None
            
            if grade != None:
                set_viewed_ass(id)
                viewed = True
            
            
            
            submission_detail = {
                "submission_id": id,
                "submission_time": submission_info["submission_time"],
                "submission_note": note,
                "assignment_max_grade": submission_info["assignment_max_grade"],
                "assignment_percentage": submission_info["assignment_percentage"],
                "assignment_grade": grade,
                "submission_uploader": submission_info["submission_uploader"],
                "assignment": submission_info["assignment"],
                "file": submission_info["file"],
                "is_viewed": viewed
            }
            student_submission_info.append(submission_detail)
    
    return {
        "student_submission_info": student_submission_info
    }

# user downloading assignment
def download_assignment(token, course_id, assignment_id):
    user_id = check_validity(token)
    role = get_user_info(user_id)["user_role"]
    if role == "student":
        if not check_in_course_enrolled(user_id, course_id):
            raise AccessError("not enrolled to the course")
    else:
        if not is_staff_in_course(user_id, course_id):
            raise AccessError("not an admin in this course")
    
    assignment = get_file(get_assignment_info(assignment_id)["file_id"])
    return {
        "assignment": assignment
    }

def download_submission(token, course_id, submission_id):
    user_id = check_validity(token)
    role = get_user_info(user_id)["user_role"]
    if role == "student":
        if not check_in_course_enrolled(user_id, course_id):
            raise AccessError("not enrolled to the course")
    else:
        if not is_staff_in_course(user_id, course_id):
            raise AccessError("not an admin in this course")
    
    submission = get_file(get_submission_info(submission_id)["file_id"])
    return {
        "submission": submission
    }
    
def release_assignment_marks(token, assignment_id):
    user_id = check_validity(token)
    update_assignment_status_released(assignment_id)
    return {}