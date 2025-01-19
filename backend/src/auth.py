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
from db.create_queries import CREATE_USERS_TABLE, CREATE_TOKENS_TABLE
from db.login_queries import *
from db.funcs.db_auth import *
from src import db_connect

def login(email, password):
    # check if login details are correct/exist   
    user_id = match_email_pw(email, password)

    # generate and store token
    session_id = incr_session_counter()
    token = str(generate_jwt(user_id, session_id))
    insert_token(token, user_id)

    # login details correct, return id and token
    return {
        'user_id': user_id,
        'token': token
    }

def register(email, password, firstname, lastname, role):
    # check if email is valid
    valid_email = r'^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$'
    if not re.fullmatch(valid_email, email):
        raise InputError("Email entered is not a valid email")

    # check if email already exists
    if (match_email(email)):
        raise InputError("Email already exists")

    # check if password and name align with requirements
    if len(password) < 6:
        raise InputError("Password must be atleast 6 characters")
    elif len(firstname) < 1 or len(lastname) < 1:
        raise InputError("First and Last name must be atleast 1 character")
        
    # generate new user_id and store new user info in DB
    user_id = insert_user(firstname, lastname, password, email, role)

    # generate and store token
    session_id = incr_session_counter()
    token = str(generate_jwt(user_id, session_id))
    insert_token(token, user_id)

    # registration complete, return id and token
    return {
        'user_id': user_id,
        'token': token
    }

def logout(token):
    if (not match_token(token)):
        raise AccessError("Invalid Token")
        
    delete_token(token)