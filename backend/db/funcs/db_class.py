import sys
import psycopg2
import hashlib
import jwt
import re
import os
import json
import psycopg2
from psycopg2 import pool
#from dotenv import load_dotenv
from src import config
from src.error import InputError, AccessError
from src.helpers import *
from db.create_queries import *
from db.login_queries import *
from db.course_queries import *
from db.class_queries import *
from src import db_connect

# inserts a single class into a course
def insert_class(name, course_id, time, description, thumbnail):
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(CREATE_CLASSES_TABLE)
            cursor.execute(INSERT_CLASS, (name, course_id, time, description, thumbnail))
            class_id = cursor.fetchone()[0]
    db_connect.connection_pool.putconn(connection)
    return class_id

# add user to a class
def insert_user_into_class(class_id, user_id):
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(CREATE_CLASS_USERS_TABLE)
            cursor.execute(ENROL_USER_INTO_CLASS, (class_id, user_id,))
    db_connect.connection_pool.putconn(connection)

# returns all users from a class given class_id in the form (Users.id) tuple
def get_users_from_class(class_id):
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(GET_USERS_FROM_CLASS, (class_id,))
            users = cursor.fetchall()
    db_connect.connection_pool.putconn(connection)
    if users != []:
        return users
    return []

# returns (name, time, course_id, description) from a class given class_id
def get_class_info(class_id):
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(GET_CLASS_INFO, (class_id,))
            users = cursor.fetchall()
    db_connect.connection_pool.putconn(connection)
    if users != []:
        return {
            "name": users[0][0],
            "time": users[0][1],
            "course_id": users[0][2],
            "description": users[0][3]
        }
    return []

# returns (thumbnail) from a class given class_id
def get_class_thumbnail(class_id):
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(GET_CLASS_THUMBNAIL, (class_id,))
            thumbnail = cursor.fetchall()
    db_connect.connection_pool.putconn(connection)
    if thumbnail != []:
        return thumbnail
    return []

# returns true if user in class and false otherwise
def check_in_class(class_id, user_id):
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(MATCH_USER_CLASS, (class_id, user_id,))     
            ret = cursor.fetchall()
    db_connect.connection_pool.putconn(connection)
    if ret == []:
        return False
    return True

# returns all classes (Classes.id) tuple from a course that a user is enrolled in
def get_user_class(user_id, course_id):
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(GET_USER_CLASS, (user_id, course_id))
            classes = cursor.fetchall()
    db_connect.connection_pool.putconn(connection)
    print(classes)
    if classes != []:
        return classes
    return []
    