import psycopg2
from db.funcs.db_auth import *
from db.funcs.db_course import *
from db.funcs.db_class import *
from db.funcs.db_resource import *
from db.funcs.db_file import *
from db.funcs.db_forum import *
from db.funcs.db_gamification import *
from src.notif import *
from src.helpers import *
from src.error import InputError, AccessError

def get_categories(token, course_id):
    user_id = check_validity(token)
    role = get_user_info(user_id)["user_role"]
    if role == "student":
        if not check_in_course_enrolled(user_id, course_id):
            raise AccessError("not enrolled to the course")
    else:
        if not is_staff_in_course(user_id, course_id):
            raise AccessError("not an admin in this course")
    
    get_all_categories(course_id)
    
    categories = []
    for category in get_all_categories(course_id):
        categories.append(category[0])
    
    return {
        "categories": categories
    }

def get_forum_from_category(token, course_id, category):
    user_id = check_validity(token)
    role = get_user_info(user_id)["user_role"]
    if role == "student":
        if not check_in_course_enrolled(user_id, course_id):
            raise AccessError("not enrolled to the course")
    else:
        if not is_staff_in_course(user_id, course_id):
            raise AccessError("not an admin in this course")
    
    fourm_ids = []
    for id in get_all_threads_from_category(category):
        fourm_ids.append(id[0])

    return {
        "forums": fourm_ids
    }

def forum_post(token, course_id, title, content, date, file, file_name, category):
    user_id = check_validity(token)
    role = get_user_info(user_id)["user_role"]
    print(course_id)
    if role == "student":
        if not check_in_course_enrolled(user_id, course_id):
            raise AccessError("not enrolled to the course")
    else:
        if not is_staff_in_course(user_id, course_id):
            raise AccessError("not an admin in this course")
    
    if file is not None and file_name is not None:
        file_id = insert_file(file, file_name, user_id)
    else:
        file_id = None
    
    thread_id = create_thread(title, content, date, user_id, file_id, course_id)

    category_id = get_id_from_category_name(category, course_id)
    link_category_to_thread(thread_id, category_id[0])
    
    user_name = get_user_info(user_id)["user_firstname"] + " " + get_user_info(user_id)["user_lastname"]
    course_name = get_course_info(course_id)["course_name"]
    try:
        email_list = get_student_emails_from_course(course_id)
        notif_forum_post(email_list, user_name, course_name)
        email_list = get_staff_emails_from_course(course_id)
        notif_forum_post(email_list, user_name, course_name)
    except Exception as e:
        raise InputError(f"Failed to send email notification: {str(e)}")

    return {
        "thread_id": thread_id,
    }

def get_thread(token, course_id, thread_id):
    user_id = check_validity(token)
    role = get_user_info(user_id)["user_role"]
    if role == "student":
        if not check_in_course_enrolled(user_id, course_id):
            raise AccessError("not enrolled to the course")
    else:
        if not is_staff_in_course(user_id, course_id):
            raise AccessError("not an admin in this course")
    
    thread = get_thread_info(thread_id)
    
    replies = []
    for reply_id in get_all_replies_from_thread(thread_id):
        replies.append(get_reply_info(reply_id))
    
    return {
        "thread": thread,
        "replies": replies,
    }

def reply(token, course_id, thread_id, content, date, file, file_name):
    user_id = check_validity(token)
    role = get_user_info(user_id)["user_role"]
    if role == "student":
        if not check_in_course_enrolled(user_id, course_id):
            raise AccessError("not enrolled to the course")
    else:
        if not is_staff_in_course(user_id, course_id):
            raise AccessError("not an admin in this course")
    
    if file is not None and file_name is not None:
        file_id = insert_file(file, file_name, user_id)
    else:
        file_id = None
    
    reply_id = create_reply(content, date, user_id, thread_id, file_id)
    
    return {
        "reply_id": reply_id
    }

def add_category(token, course_id, category):
    user_id = check_validity(token)
    role = get_user_info(user_id)["user_role"]
    if role == "student":
        if not check_in_course_enrolled(user_id, course_id):
            raise AccessError("not enrolled to the course")
    else:
        if not is_staff_in_course(user_id, course_id):
            raise AccessError("not an admin in this course")
    
    category_id = create_category(category, course_id)
    
    return {
        "category_id": category_id
    }