#!/usr/bin/python

import requests
import base64
from datetime import datetime, timedelta, timezone
from src.error import InputError, AccessError
from src.auth import check_validity
from db.funcs.db_course import check_in_course_enrolled, is_staff_in_course
from db.funcs.db_class import get_class_info
from db.funcs.db_upload_video import create_recording, get_all_recordings
from db.funcs.db_auth import get_user_info

def backend_get_recordings(token, course_id, class_id):
    user_id = check_validity(token)
    if not (check_in_course_enrolled(user_id, course_id) or is_staff_in_course(user_id, course_id)):
        raise AccessError("Not enrolled in course")

    recordings = get_all_recordings(course_id, class_id)

    all_recording_info = []
    for recording in recordings:
        recording_detail = {
            "id": recording[0],
            "title": recording[1],
            "user_id": recording[2],
            "description": recording[3],
            "link": recording[4],
            "course_id": recording[5],
            "class_id": recording[6],
            "chat_log": recording[7]
        }
        all_recording_info.append(recording_detail)
    
    return {
        "recordings": all_recording_info
    }

def backend_publish_recording(token, course_id, class_id, title, description, link, chat_log):
    user_id = check_validity(token)
    role = get_user_info(user_id)["user_role"]
    if role == "student":
        if not check_in_course_enrolled(user_id, course_id):
            raise AccessError("not enrolled to the course")
    else:
        if not is_staff_in_course(user_id, course_id):
            raise AccessError("not an admin in this course")

    create_recording(title, user_id, description, link, course_id, class_id, chat_log)

    return 