import psycopg2
from db.funcs.db_auth import *
from db.funcs.db_course import *
from db.funcs.db_class import *
from db.funcs.db_resource import *
from db.funcs.db_file import *
from db.funcs.db_forum import *
from src.helpers import *
from src.error import InputError, AccessError

def backend_get_classes(token, course_id):
    user_id = check_validity(token)
    role = get_user_info(user_id)["user_role"]
    if role == "student":
        if not check_in_course_enrolled(user_id, course_id):
            raise AccessError("not enrolled to the course")
    else:
        if not is_staff_in_course(user_id, course_id):
            raise AccessError("not an admin in this course")
    
    # class_ids = get_course_classes(course_id)
    class_ids = []
    for id in get_course_classes(course_id):
        class_ids.append(id[0])
    
    return {
        "class_ids": class_ids
    }

def backend_create_class(token, name, course_id, time, description, thumbnail):
    user_id = check_validity(token)
    role = get_user_info(user_id)["user_role"]
    if role == "student":
        raise AccessError("no permission")
    else:
        if not is_staff_in_course(user_id, course_id):
            raise AccessError("not an admin in this course")
    
    class_id = insert_class(name, course_id, time, description, thumbnail)

    return {
        "class_id": class_id
    }

def backend_insert_class(token, course_id, class_id):
    user_id = check_validity(token)
    role = get_user_info(user_id)["user_role"]
    if role == "student":
        if not check_in_course_enrolled(user_id, course_id):
            raise AccessError("not enrolled to the course")
    else:
        if not is_staff_in_course(user_id, course_id):
            raise AccessError("not an admin in this course")
    
    insert_user_into_class(class_id, user_id)
    
    return {
    }

def backend_get_class_info(token, course_id, class_id):
    user_id = check_validity(token)
    role = get_user_info(user_id)["user_role"]
    if role == "student":
        if not check_in_course_enrolled(user_id, course_id):
            raise AccessError("not enrolled to the course")
    else:
        if not is_staff_in_course(user_id, course_id):
            raise AccessError("not an admin in this course")
    
    class_info = get_class_info(class_id)
    class_thumbnail = get_class_thumbnail(class_id)
    
    return {
        "class_info": class_info,
        "class_thumbnail": class_thumbnail
    }

def backend_get_user_classes(token, course_id):
    user_id = check_validity(token)
    role = get_user_info(user_id)["user_role"]
    if role == "student":
        if not check_in_course_enrolled(user_id, course_id):
            raise AccessError("not enrolled to the course")
    else:
        if not is_staff_in_course(user_id, course_id):
            raise AccessError("not an admin in this course")
    
    class_ids = []
    for class_id in get_user_class(user_id, course_id):
        class_ids.append(class_id[0])
    
    return {
        "class_ids": class_ids
    }

def backend_get_users_from_class(token, course_id, class_id):
    user_id = check_validity(token)
    role = get_user_info(user_id)["user_role"]
    if role == "student":
        if not check_in_course_enrolled(user_id, course_id):
            raise AccessError("not enrolled to the course")
    else:
        if not is_staff_in_course(user_id, course_id):
            raise AccessError("not an admin in this course")
    
    user_ids = []
    for user_id in get_users_from_class(class_id):
        user_ids.append(user_id[0])
    
    return {
        "user_ids": user_ids
    }
    
def backend_check_in_class(token, class_id):
    user_id = check_validity(token)
    
    in_class = check_in_class(class_id, user_id)
    
    return {
        "in_class": in_class
    }