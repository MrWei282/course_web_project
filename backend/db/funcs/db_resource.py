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

# refer to get_resource.txt for usage

# link the file to resource (teaching materials)
def insert_resource(category, description, file_id, class_id):
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(CREATE_RESOURCES_TABLE)
            cursor.execute(INSERT_RESOURCE, (category, description, file_id, class_id,))
            resource_id = cursor.fetchone()[0]
    db_connect.connection_pool.putconn(connection)
    return resource_id

# link resource to a given course
def add_resource_to_course(course_id, resource_id):
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(CREATE_COURSE_RESOURCES_TABLE)
            cursor.execute(INSERT_RESOURCE_COURSE, (course_id, resource_id))
    db_connect.connection_pool.putconn(connection)

# returns resource info (category, description, file_id)
def get_resource(resource_id):
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(GET_RESOURCE, (resource_id,))
            file = cursor.fetchall()
    db_connect.connection_pool.putconn(connection)
    if file != []:
        return {
            "resource_category": file[0][0],
            "resource_description": file[0][1],
            "file_id": file[0][2],
            "class_id": file[0][3]
        }
    return []

def get_resource_from_class_in_course(course_id, class_id):
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(GET_RESOURCES_IN_COURSE, (course_id, class_id,))
            resource = cursor.fetchall()
    db_connect.connection_pool.putconn(connection)
    if resource != []:
        return resource
    return []