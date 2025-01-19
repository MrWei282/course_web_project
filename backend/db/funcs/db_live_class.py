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
from db.live_class_queries import *
from src import db_connect

def store_meeting_id(meeting_id, start_time, course_id, class_id):
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(STORE_MEETING_ID, (meeting_id, start_time, course_id, class_id),)
    db_connect.connection_pool.putconn(connection)
    
def get_meeting_id(course_id, class_id):
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(STORE_MEETING_ID, (course_id, class_id),)
            meeting_id = cursor.fetchone()[0]
    db_connect.connection_pool.putconn(connection)
    return meeting_id