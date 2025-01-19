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
from db.forum_queries import *
from db.user_profile_queries import *
from db.upload_video_queries import *
from src import db_connect

def create_recording(title, user_id, description, link, course_id, class_id, chat_log):
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(CREATE_RECORDING, (title, user_id, description, link, course_id, class_id, chat_log,))
    db_connect.connection_pool.putconn(connection)

def get_all_recordings(course_id, class_id):
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(GET_ALL_RECORDINGS, (course_id, class_id,))
            recording = cursor.fetchall()
    db_connect.connection_pool.putconn(connection)
    if recording != []:
        return recording
    return [] 
