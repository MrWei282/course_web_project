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
from db.assignment_queries import *
from src import db_connect

# requires use of timestamp variable type, example usage in python below
def insert_assignment(course_id, due_date, grade, description, percentage, file_id, class_id, assignment_points):
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(CREATE_ASSIGNMENTS_TABLE)
            cursor.execute(INSERT_ASSIGNMENT, (course_id, due_date, grade, description, percentage, file_id, class_id, assignment_points,))
            ass_id = cursor.fetchone()[0]
    db_connect.connection_pool.putconn(connection)
    return ass_id

# returns (course_id, due_date, grade, description, percentage, file_id) for a given assignment
def get_assignment_info(ass_id):
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(GET_ASSIGNMENT_INFO, (ass_id,))
            ass_info = cursor.fetchall()
    db_connect.connection_pool.putconn(connection)
    if ass_info != []:
        return {
            "course_id": ass_info[0][0],
            "assignment_due_date": ass_info[0][1],
            "assignment_grade": ass_info[0][2],
            "assignment_description": ass_info[0][3],
            "assignment_percentage": ass_info[0][4],
            "file_id": ass_info[0][5],
            "class_id": ass_info[0][6],
            "assignment_points": ass_info[0][7]
        }
    return []

# adds a submission entry with the values (ass_id, file_id, student_id, submit_time, max_grade)
def insert_submission(ass_id, file_id, student_id, submit_time, max_grade, percentage):
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(CREATE_ASSIGNMENTS_STUDENTS_TABLE)
            cursor.execute(INSERT_SUBMISSION, (ass_id, file_id, student_id, submit_time, max_grade, percentage,))
            sub_id = cursor.fetchone()[0]
    db_connect.connection_pool.putconn(connection)
    return sub_id

# returns all submissions for a assignment in the form of (student_id, file_id, sub_id)
def get_submissions_from_ass(ass_id):
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(GET_SUBMISSIONS_FROM_ASSIGNMENTS, (ass_id,))
            submissions = cursor.fetchall()
    db_connect.connection_pool.putconn(connection)
    if submissions != []:
        return submissions
    return []

# returns (ass_id, file_id, student_id, submit_time, feedback, grade, max_grade, percentage) for a given submission
def get_submission_info(sub_id):
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(GET_SUBMISSION_INFO, (sub_id,))
            submissions = cursor.fetchall()
    db_connect.connection_pool.putconn(connection)
    if submissions != []:
        return {
            "ass_id": submissions[0][0],
            "file_id": submissions[0][1],
            "student_id": submissions[0][2],
            "submit_time": submissions[0][3],
            "feedback": submissions[0][4],
            "grade": submissions[0][5],
            "max_grade": submissions[0][6], 
            "percentage": submissions[0][7],
            "is_released": submissions[0][8],
            "is_viewed": submissions[0][9]
        }
    return []

# updates submission with the values (feedback, grade, percentage) for a given submission
def update_marking(feedback, grade, sub_id):
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(UPDATE_SUBMISSION, (feedback, grade, sub_id,))
    db_connect.connection_pool.putconn(connection)
    
# timestamp = datetime(2023, 6, 28, 10, 30, 0) <-- (year, month, day, hour, minute, second)

# boolean using (user_id, submission_id) to see if submission belongs to user
def does_submission_belong_to_user(user_id, submission_id):
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(DOES_SUBMISSION_BELONG_TO_USER, (user_id, submission_id,))
            submission = cursor.fetchall()
    db_connect.connection_pool.putconn(connection)
    if submission == []:
        return False
    return True

def get_assignments_in_course(course_id, class_id):
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(GET_ASSIGNMENTS_IN_COURSE, (course_id, class_id,))
            ass_info = cursor.fetchall()
    db_connect.connection_pool.putconn(connection)
    if ass_info != []:
        return ass_info
    return []

def update_assignment_status_released(assignment_id):
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(UPDATE_ASSIGNMENT_STATUS_TO_RELEASED, (assignment_id,))
    db_connect.connection_pool.putconn(connection)
    return

def check_submission_released(submission_id):
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(CHECK_IS_RELEASED, (submission_id,))
            info = cursor.fetchall()
    db_connect.connection_pool.putconn(connection)
    if info == []:
        return False
    return True

def check_submission_viewed(submission_id):
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(CHECK_IS_VIEWED, (submission_id,))
            info = cursor.fetchall()
    db_connect.connection_pool.putconn(connection)
    if info == []:
        return False
    return True