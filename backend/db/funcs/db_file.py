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
from src import db_connect

# add file (file = file_data)
def insert_file(file, name, uploader_id):
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(CREATE_FILES_TABLE)
            cursor.execute(INSERT_FILE, (file, name, uploader_id,))
            file_id = cursor.fetchone()[0]
    db_connect.connection_pool.putconn(connection)
    return file_id

# returns file info and data (file, name, uploader_id)
def get_file(file_id):
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(GET_FILE, (file_id,))
            file = cursor.fetchall()
    db_connect.connection_pool.putconn(connection)
    if file != []:
        return {
            "file": file[0][0],
            "name": file[0][1],
            "uploader_id": file[0][2]
        }   
    return {}