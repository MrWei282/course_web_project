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
from src import db_connect

def create_thread(title, content, date, user_id, file_id, course_id):
    """
    Create a new thread in the database.

    Args:
        title (str): The title of the thread.
        content (str): The content of the thread.
        date (datetime): The date of the thread in a datetime format.
        user_id (int): The ID of the user creating the thread.
        file_id (int): The ID of the associated file (optional).
        course_id (int): The ID of the associated course.

    Returns:
        int: The ID of the newly created thread.
    """
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(CREATE_THREAD, (title, content, date, user_id, file_id, course_id,))
            thread_id = cursor.fetchone()[0]
    db_connect.connection_pool.putconn(connection)
    return thread_id

def create_category(name, course_id):
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(CREATE_CATEGORY, (name, course_id,))
            category_id = cursor.fetchone()[0]
    db_connect.connection_pool.putconn(connection)
    return category_id

def link_category_to_thread(thread_id, category_id):
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(LINK_CATEGORY_TO_THREAD, (thread_id, category_id,))
    db_connect.connection_pool.putconn(connection)

def create_reply(content, date, user_id, thread_id, file_id):
    """
    Create a reply for a specific thread in the database.

    Args:
        content (str): The content of the reply.
        date (datetime): The date of the reply in a datetime format.
        user_id (int): The ID of the user creating the reply.
        thread_id (int): The ID of the thread to which the reply belongs.
        file_id (int): The ID of the associated file (optional).

    Returns:
        int: The ID of the newly created reply.

    """
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(CREATE_REPLY, (content, date, user_id, thread_id, file_id,))
            reply_id = cursor.fetchone()[0]
    db_connect.connection_pool.putconn(connection)
    return reply_id

def get_thread_info(thread_id):
    """
    Retrieve information about a specific thread from the database.

    Args:
        thread_id (int): The ID of the thread to retrieve information about.

    Returns:
        dict: A dictionary containing the information of the thread. The dictionary includes the following keys:
            - "id" (int): The ID of the thread.
            - "title" (str): The title of the thread.
            - "content" (str): The content of the thread.
            - "date" (datetime): The date of the thread in a specific format.
            - "user_id" (int): The ID of the user who created the thread.
            - "file_id" (int): The ID of the associated file (optional).
            - "course_id" (int): The ID of the course to which the thread belongs.

        If the thread with the given ID does not exist, an empty dictionary is returned.

    """
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(GET_THREAD_INFO, (thread_id,))
            thread = cursor.fetchall()
    db_connect.connection_pool.putconn(connection)
    if thread != []:
        return {
            "id": thread[0][0],
            "title": thread[0][1],
            "content": thread[0][2],
            "date": thread[0][3],
            "user_id": thread[0][4],
            "file_id": thread[0][5],
            "course_id": thread[0][6]
        }
    return {}

def get_all_replies_from_thread(thread_id):
    """
    Retrieve all replies from a specific thread in the database.

    Args:
        thread_id (int): The ID of the thread to retrieve replies from.

    Returns:
        list: A list of reply_id tuples

        If there are no replies in the specified thread, an empty list is returned.
        
    """
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(GET_ALL_REPLIES_FROM_THREAD, (thread_id,))
            reply = cursor.fetchall()
    db_connect.connection_pool.putconn(connection)
    if reply != []:
        return reply
    return []

def get_reply_info(reply_id):
    """
    Retrieve information about a specific reply from the database.

    Args:
        reply_id (int): The ID of the reply to retrieve information about.

    Returns:
        dict: A dictionary containing the information of the reply. The dictionary includes the following keys:
            - "id" (int): The ID of the reply.
            - "content" (str): The content of the reply.
            - "date" (datetime): The date of the reply in a specific format.
            - "user_id" (int): The ID of the user who created the reply.
            - "thread_id" (int): The ID of the thread to which the reply belongs.
            - "file_id" (int): The ID of the associated file (optional).

        If the reply with the given ID does not exist, an empty dictionary is returned.

    """
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(GET_REPLY_INFO, (reply_id,))
            reply = cursor.fetchall()
    db_connect.connection_pool.putconn(connection)
    if reply != []:
        return {
            "id": reply[0][0],
            "content": reply[0][1],
            "date": reply[0][2],
            "user_id": reply[0][3],
            "thread_id": reply[0][4],
            "file_id": reply[0][5]
        }
    return {}

def get_all_threads_from_category(category):
    """
    Retrieve all threads belonging to a specific category from the database.

    Args:
        category (str): The name of the category to retrieve threads from.

    Returns:
        list: A list of thread_id tuples

        If there are no threads in the specified category, an empty list is returned.

    """
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(GET_ALL_THREADS_FROM_CATEGORY, (category,))
            threads = cursor.fetchall()
    db_connect.connection_pool.putconn(connection)
    if threads != []:
        return threads
    return []

def get_all_threads_from_course(course_id):
    """
    Retrieve all threads belonging to a specific category from the database.

    Args:
        course_id (int): The id of the course to retrieve threads from.

    Returns:
        list: A list of thread_id tuples

    """
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(GET_ALL_THREADS_FROM_COURSE, (course_id,))
            threads = cursor.fetchall()
    db_connect.connection_pool.putconn(connection)
    if threads != []:
        return threads
    return []

def get_all_categories(course_id):
    """
    Retrieve all categories belonging to a specific course from the database.

    Args:
        course_id (int): The ID of the course to retrieve categories from.

    Returns:
        list: A list of category_name tuples

        If there are no categories in the specified course, an empty list is returned.

    """
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(GET_ALL_CATEGORIES_FROM_COURSE, (course_id,))
            category = cursor.fetchall()
    db_connect.connection_pool.putconn(connection)
    if category != []:
        return category
    return []

def get_id_from_category_name(name, course_id):
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(GET_ID_FROM_NAME, (name, course_id,))
            category_id = cursor.fetchall()
    db_connect.connection_pool.putconn(connection)
    if category_id != []:
        return category_id
    return []
