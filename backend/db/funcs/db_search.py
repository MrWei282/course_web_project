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
from db.search_queries import *
from src import db_connect

def search_resource(search_term, course_id):
    """
    Search for a resource by name in the database that start with the search_term.

    Args:
        search_term (str): The search term to match against the resource name.

    Returns:
        file (int or None): The file ID of the matching resource, or None if not found.
    """
    connection = db_connect.connection_pool.getconn()
    search_term = "^" + search_term
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(SEARCH_RESOURCES, (search_term, course_id,))
            file = cursor.fetchone()
    db_connect.connection_pool.putconn(connection)
    if file != None:
        return {
            "resource_id": file[0],
            "resource_category": file[1],
            "resource_description": file[2],
            "file_id": file[3],
            "class_id": file[4],
        }
    return None
