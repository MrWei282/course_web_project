import psycopg2
from db.funcs.db_auth import *
from db.funcs.db_course import *
from db.funcs.db_class import *
from db.funcs.db_resource import *
from db.funcs.db_file import *
from db.funcs.db_search import *
from db.funcs.db_gamification import *
from src.notif import *
from src.helpers import *
from src.error import InputError, AccessError

def get_home_dashboard(token):
    user_id = check_validity(token)
    print(user_id)
    course_list = []
    if get_user_info(user_id)["user_role"] == "student":
        course_list = get_student_courses(user_id)["enrolled"]
    else:
        course_list = get_staff_courses(user_id)
    
    home_info = []
    for enrolled in course_list:
        course_id = enrolled[0]
        course_info = get_course_info(course_id)
        course_detail = {
            "course_id": enrolled[0],
            "course_name": course_info["course_name"],
            "course_term": course_info["course_term"],
            "course_thumbnail": get_course_thumbnail(course_id),
        }
        home_info.append(course_detail)
    
    return {
        "home_info": home_info,
    }

# create course, and add creator to the course
def create_course(token, name, term, requirement, description, thumbnail):
    user_id = check_validity(token)
    
    # check if user is not a student
    role = get_user_info(user_id)["user_role"]
    if role == "student":
        raise AccessError("Student cannot create courses")

    course_id = insert_course(name, term, requirement, description, thumbnail)
    insert_staff_into_course(course_id, user_id)
    return {
        "course_id": course_id
    }

# info for search course
def search_course(token, course_id):
    check_validity(token)
    course_info = get_course_info(course_id)
    return {
        "course_id": course_id,
        "course_name": course_info["course_name"],
        "course_term": course_info["course_term"],
        "course_thumbnail": get_course_thumbnail(course_id)
    }

# enrol request to courses
def enrol_request_course(token, course_id):
    user_id = check_validity(token)
    role = get_user_info(user_id)["user_role"]

    if check_in_course_enrolled(user_id, course_id):
        raise AccessError("Already enrolled")

    if role == "student":
        if check_pending_in_course(user_id, course_id):
            raise AccessError("Already pending")
        enrol_request_student(course_id, user_id)
    else:
        insert_staff_into_course(course_id, user_id)
    
    return {
    }

# course home page
def get_course_home(token, course_id):
    user_id = check_validity(token)

    role = get_user_info(user_id)["user_role"]
    if role == "student":
        if not check_in_course_enrolled(user_id, course_id):
            raise AccessError("not enrolled to the course")
    else:
        if not is_staff_in_course(user_id, course_id):
            raise AccessError("not an admin in this course")

    course_info = get_course_info(course_id)
    return {
        "course_id": course_id,
        "course_name": course_info["course_name"],
        "course_term": course_info["course_term"],
        "course_thumbnail": get_course_thumbnail(course_id)
    }

# getting all enrolment request
def get_course_enrol_request(token, course_id):
    user_id = check_validity(token)
    
    role = get_user_info(user_id)["user_role"]
    if role == "student":
        raise AccessError("not allowed to check enrollments")
    else:
        if not is_staff_in_course(user_id, course_id):
            raise AccessError("not an admin in this course")

    pending_enrol_info = []
    for user_id in get_course_students(course_id)["pending"]:
        user_info = get_user_info(user_id)
        user_detail = {
            "user_id": user_id[0],
            "user_firstname": user_info["user_firstname"],
            "user_lastname": user_info["user_lastname"],
            "user_email": user_info["user_email"],
            "user_role": user_info["user_role"],
        }
        pending_enrol_info.append(user_detail)
        
    return {
        "pending_enrol_info": pending_enrol_info
    }

# approve enrolment to the course
def approve_enrolment(token, course_id, enrollee_id):
    user_id = check_validity(token)
    if not check_pending_in_course(enrollee_id, course_id):
        raise AccessError("not pending in course")
    
    if not is_staff_in_course(user_id, course_id):
            raise AccessError("not an admin in this course")

    enrol_student(course_id, enrollee_id)

    # create mission tracking for students
    mission_ids = get_course_missions(course_id)
    print(mission_ids)
    for mission_id in mission_ids:
        add_mission_to_student_tracker(mission_id, enrollee_id)
    return {
    }

# get all resources in the course
def get_resources(token, course_id):
    user_id = check_validity(token)
    role = get_user_info(user_id)["user_role"]
    if role == "student":
        if not check_in_course_enrolled(user_id, course_id):
            raise AccessError("not enrolled to the course")
    else:
        if not is_staff_in_course(user_id, course_id):
            raise AccessError("not an admin in this course")
    course_info = get_course_resources(course_id)
    all_resource_info = []
    for resource_id in course_info:
        resource_info = get_resource(resource_id)
        resource_detail = {
            "resource_category": resource_info["resource_category"],
            "resource_description": resource_info["resource_description"],
            "file_id": resource_info["file_id"],
            "class_id": resource_info["class_id"],
            "resource_id": resource_id[0]
        }
        all_resource_info.append(resource_detail)
    
    return {
        "all_resource_info": all_resource_info
    }

# user uploading resource to the course
def upload_resources(token, course_id, resource_name, resource_description, resource_category, file_string, class_id):
    user_id = check_validity(token)
    role = get_user_info(user_id)["user_role"]
    if role == "student":
        raise AccessError("Cannot upload resources")
    else:
        if not is_staff_in_course(user_id, course_id):
            raise AccessError("not an admin in this course")
    file_id = insert_file(file_string, resource_name, user_id)
    resource_id = insert_resource(resource_category, resource_description, file_id, class_id)
    add_resource_to_course(course_id, resource_id)

    if class_id is None:
        email_list = get_student_emails_from_course(course_id)

    else:
        email_list = get_student_emails_from_course_and_class(course_id, class_id)
    
    
    course_name = get_course_info(course_id)["course_name"]
    try:
        notif_material(email_list, course_name)
    except Exception as e:
        raise InputError(f"Failed to send email notification: {str(e)}")
    
    
    return {
        "resource_id": resource_id
    }
    
# user downloading resource
def download_resource(token, course_id, resource_id):
    user_id = check_validity(token)
    role = get_user_info(user_id)["user_role"]
    if role == "student":
        if not check_in_course_enrolled(user_id, course_id):
            raise AccessError("not enrolled to the course")
    else:
        if not is_staff_in_course(user_id, course_id):
            raise AccessError("not an admin in this course")
    
    resource = get_file(get_resource(resource_id)["file_id"])
    return {
        "resource": resource
    }

def get_participants(token, course_id):
    user_id = check_validity(token)
    
    role = get_user_info(user_id)["user_role"]
    if role == "student":
        if not check_in_course_enrolled(user_id, course_id):
            raise AccessError("not enrolled to the course")
    else:
        if not is_staff_in_course(user_id, course_id):
            raise AccessError("not an admin in this course")

    participant_info = []
    for user_id in get_course_students(course_id)["students"]:
        user_info = get_user_info(user_id)
        user_detail = {
            "user_id": user_id[0],
            "user_firstname": user_info["user_firstname"],
            "user_lastname": user_info["user_lastname"],
            "user_email": user_info["user_email"],
            "user_role": user_info["user_role"],
        }
        participant_info.append(user_detail)
    for user_id in get_course_all_staff(course_id):
        user_info = get_user_info(user_id)
        user_detail = {
            "user_id": user_id[0],
            "user_firstname": user_info["user_firstname"],
            "user_lastname": user_info["user_lastname"],
            "user_email": user_info["user_email"],
            "user_role": user_info["user_role"],
        }
        participant_info.append(user_detail)
    return {
        "participant_info": participant_info
    }
    
def backend_get_file(token, course_id, file_id):
    user_id = check_validity(token)
    role = get_user_info(user_id)["user_role"]
    if role == "student":
        if not check_in_course_enrolled(user_id, course_id):
            raise AccessError("not enrolled to the course")
    else:
        if not is_staff_in_course(user_id, course_id):
            raise AccessError("not an admin in this course")
    
    file_info = get_file(file_id)
    
    return {
        "file_info": file_info,
    }

def backend_search_resources(token, search_term, course_id):
    user_id = check_validity(token)
    role = get_user_info(user_id)["user_role"]
    if role == "student":
        if not check_in_course_enrolled(user_id, course_id):
            raise AccessError("not enrolled to the course")
    else:
        if not is_staff_in_course(user_id, course_id):
            raise AccessError("not an admin in this course")
    file = search_resource(search_term, course_id)
    
    if file != None:
        return file
    else:
        return {}
