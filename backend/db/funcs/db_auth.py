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
from db.create_queries import CREATE_USERS_TABLE, CREATE_TOKENS_TABLE
from db.login_queries import *
from src import db_connect

# checks if (email, password) has a match in DB, RETURNS 'user_id'
def match_email_pw(email, password):
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(CREATE_USERS_TABLE)
            cursor.execute(MATCH_EMAIL_PW, (email, hashing(password),))     
            ret = cursor.fetchall()
    db_connect.connection_pool.putconn(connection)
    if (ret == []):
        raise InputError("Email or Password is incorrect or doesn't exist")
    return ret[0][0]

# boolean function that checks if email is in user table
def match_email(email):
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(CREATE_USERS_TABLE)
            cursor.execute(MATCH_EMAIL, (email,))
            ret = cursor.fetchall()
    db_connect.connection_pool.putconn(connection)
    if (ret == []):
        return False
    return True

# insert token into tokens table
def insert_token(token, user_id):
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(CREATE_TOKENS_TABLE)
            cursor.execute(INSERT_TOKEN, (token, user_id,))
    db_connect.connection_pool.putconn(connection)
    
# insert user into user table, RETURNS 'user_id'
def insert_user(firstname, lastname, password, email, role):
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(CREATE_USERS_TABLE)
            cursor.execute(INSERT_USER, (firstname, lastname, hashing(password), email, role))
            user_id = cursor.fetchone()[0]
    db_connect.connection_pool.putconn(connection)
    return user_id

# boolean function that checks if token is in tokens table
def match_token(token):
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(MATCH_TOKEN, (token,))
            ret = cursor.fetchall()
    db_connect.connection_pool.putconn(connection)
    if (ret == []):
        return False
    return True

# delete token from tokens table
def delete_token(token):
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(DELETE_TOKEN, (token,))
    db_connect.connection_pool.putconn(connection)

# given id get user info
def get_user_info(id):
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(GET_USER, (id,))
            user = cursor.fetchall()
    db_connect.connection_pool.putconn(connection)
    if (user != []):
        return {
            "user_id": user[0][0],
            "user_firstname": user[0][1],
            "user_lastname": user[0][2],
            "user_email": user[0][4],
            "user_role": user[0][5],
        }
    return []

# check validity of token and return user id
def check_validity(token):
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(VALIDATE_TOKEN, (token,))
            ret = cursor.fetchall()
    db_connect.connection_pool.putconn(connection)
    if (ret == []):
        raise AccessError("Not a valid token")
    return ret[0][0]