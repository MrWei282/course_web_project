import sys
import psycopg2
import hashlib
import jwt
import re
import os
import json
from psycopg2 import pool
from src import config
from src.error import InputError, AccessError
from src.helpers import *
from db.create_queries import *
from db.reset_queries import RESET_TOKENS_TABLE
from db.login_queries import *
from db.funcs.db_auth import *
from db.funcs.db_gamification import *
from db.funcs.db_user_profile import *
from db.reset_queries import *
from src import db_connect

# runs before server accepts HTTP requests, right now just deletes
# all old tokens
def server_setup():
    # delete all old tokens
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(CREATE_USERS_TABLE)
            cursor.execute(CREATE_TOKENS_TABLE)
            cursor.execute(RESET_TOKENS_TABLE)
            cursor.execute(CREATE_USERS_COMMENTS_TABLE)
            cursor.execute(CREATE_USER_REPLIES_TABLE)
            cursor.execute(CREATE_USERS_PROFILE_TABLE)
            cursor.execute(CREATE_BADGES_TABLE)
            cursor.execute(CREATE_USER_BADGES_TABLE)
            cursor.execute(CREATE_COURSES_TABLE)
            cursor.execute(CREATE_COURSES_STUDENT_TABLE)
            cursor.execute(CREATE_COURSES_STAFF_TABLE)
            cursor.execute(CREATE_FILES_TABLE)
            cursor.execute(CREATE_CLASSES_TABLE)
            cursor.execute(CREATE_RESOURCES_TABLE)
            cursor.execute(CREATE_COURSE_RESOURCES_TABLE)
            cursor.execute(CREATE_ASSIGNMENTS_TABLE)
            cursor.execute(CREATE_CLASS_USERS_TABLE)
            cursor.execute(CREATE_ASSIGNMENTS_STUDENTS_TABLE)
            cursor.execute(CREATE_QUIZ_TABLE)
            cursor.execute(CREATE_QUIZ_QUESTIONS_TABLE)
            cursor.execute(CREATE_QUIZ_SUBMISSIONS)
            cursor.execute(CREATE_QUIZ_SUBMITTED_ANSWERS)
            cursor.execute(CREATE_QUIZ_MARKING)
            cursor.execute(CREATE_FORUM_THREADS)
            cursor.execute(CREATE_FORUM_CATEGORY)
            cursor.execute(CREATE_THREAD_CATEGORIES)
            cursor.execute(CREATE_FORUM_REPLIES)
            cursor.execute(CREATE_MISSION_TABLE)
            cursor.execute(CREATE_MISSION_TRACKER_TABLE)
            cursor.execute(CREATE_COURSE_SHOP_TABLE)
            cursor.execute(CREATE_STUDENT_COURSE_INVENTORY)
            cursor.execute(CREATE_LIVE_CLASS_TABLE)
            cursor.execute(CREATE_STUDENT_WISHLIST)
            cursor.execute(CREATE_COST_TABLE) 
            cursor.execute(CREATE_RECORDINGS_TABLE) 

    db_connect.connection_pool.putconn(connection)
    create_all_badges()
    