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
from db.gamification_queries import *
from src import db_connect

# checks if student is enrolled in a given course, does not include pending enrolment students
def check_in_course_enrolled(user_id, course_id):
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(CHECK_ENROLLED_STU_IN_COURSE, (course_id, user_id,))
            ret = cursor.fetchall()
    db_connect.connection_pool.putconn(connection)
    if (ret == []):
        return False
    return True

# checks if student is pending enrolment in a given course
def check_pending_in_course(user_id, course_id):
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(CHECK_PENDING_ENROL_STU_IN_COURSE, (user_id, course_id,))
            ret = cursor.fetchall()
    db_connect.connection_pool.putconn(connection)
    if (ret == []):
        return False
    return True

def insert_course(name, term, requirement, description, thumbnail):
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(CREATE_COURSES_TABLE)
            cursor.execute(INSERT_COURSE, (name, term, requirement, description, thumbnail,))
            course_id = cursor.fetchone()[0]
            cursor.execute(INSERT_COSTS, (course_id,))
    db_connect.connection_pool.putconn(connection)
    return course_id

# returns (name, term, requirement, description) for a course given course_id
def get_course_info(course_id):
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(GET_COURSE, (course_id,))
            course = cursor.fetchall()
    db_connect.connection_pool.putconn(connection)
    if course == []:
        raise InputError("No such course")
    return {
        "course_name": course[0][0],
        "course_term": course[0][1],
        "course_requirement": course[0][2],
        "course_description": course[0][3],
    }
    

# returns the thumbnail data for a given course
def get_course_thumbnail(course_id):
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(GET_COURSE_THUMBNAIL, (course_id,))
            thumbnail = cursor.fetchall()
    db_connect.connection_pool.putconn(connection)
    if thumbnail != []:
        return thumbnail[0][0]

# returns all students both pending and not pending for a given course in the form of (Users.id)
def get_course_students(course_id):
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(CREATE_COURSES_STUDENT_TABLE)
            cursor.execute(GET_COURSE_STUDENTS, (course_id,))
            course_students = cursor.fetchall()
            cursor.execute(GET_COURSE_PENDING, (course_id,))
            course_pending = cursor.fetchall()
    db_connect.connection_pool.putconn(connection)
    return {'students': course_students, 'pending': course_pending}

def get_course_all_staff(course_id):
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(GET_COURSE_STAFF, (course_id,))
            course_staff = cursor.fetchall()
    db_connect.connection_pool.putconn(connection)
    return course_staff

# student is pending enrollment by default as it requires staff approval
def enrol_request_student(course_id, user_id):
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(INSERT_STU, (course_id, user_id,))
    db_connect.connection_pool.putconn(connection)

# enrol student, makes them no longer pending
def enrol_student(course_id, user_id):
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(UPDATE_STU_ENROLMENT_TRUE, (course_id, user_id,))
    db_connect.connection_pool.putconn(connection)

# add non-student user into course
def insert_staff_into_course(course_id, user_id):
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(CREATE_COURSES_STAFF_TABLE)
            cursor.execute(INSERT_STAFF, (course_id, user_id,))
    db_connect.connection_pool.putconn(connection)

# returns (Courses.name, Users.firstname, Users.lastname, Users.email, Users.role) in a given course
def get_course_staff(course_id):
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(GET_STAFF_IN_COURSE, (course_id,))
            course = cursor.fetchall()
    db_connect.connection_pool.putconn(connection)
    if course != []:
        return course[0]
    return []

def is_staff_in_course(user_id, course_id):
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(CHECK_STAFF_IN_COURSE, (course_id, user_id,))
            ret = cursor.fetchall()
    db_connect.connection_pool.putconn(connection)
    if (ret == []):
        return False
    return True

# student dashboard of courses returns (Courses.id, Courses.name)
def get_student_courses(user_id):
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(GET_STUDENT_COURSES_ENROLLED, (user_id,))
            course = cursor.fetchall()
            cursor.execute(GET_STUDENT_COURSES_PENDING, (user_id,))
            course_pending = cursor.fetchall()
    db_connect.connection_pool.putconn(connection)
    return {'enrolled': course, 'pending': course_pending}

# staff dashboard of enrolled courses returns (Courses.id, Courses.name)
def get_staff_courses(user_id):
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(GET_STAFF_COURSES, (user_id,))
            course = cursor.fetchall()
    db_connect.connection_pool.putconn(connection)
    if course != []:
        return course
    return []

# returns all resources linked to course as resource_id 
def get_course_resources(course_id):
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(GET_COURSE_RESOURCES, (course_id,))
            resource = cursor.fetchall()
    db_connect.connection_pool.putconn(connection)
    if resource != []:
        return resource
    return []

# returns all assignments in a course as ass_id
def get_course_assignments(course_id):
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(GET_COURSE_ASSIGNMENTS, (course_id,))
            ass_id = cursor.fetchall()
            print(ass_id)
    db_connect.connection_pool.putconn(connection)
    if ass_id != []:
        return ass_id
    return []

def get_course_classes(course_id):
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(GET_COURSE_CLASSES, (course_id,))
            classes = cursor.fetchall()
    db_connect.connection_pool.putconn(connection)
    if classes != []:
        return classes
    return []

def get_student_emails_from_course(course_id):
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(GET_EMAILS_FROM_COURSE, (course_id,))
            emails = cursor.fetchall()
    db_connect.connection_pool.putconn(connection)
    all_emails = []
    if emails != []:
        for email in emails:
            all_emails.append(email[0])
        return all_emails
    return []

def get_student_emails_from_course_and_class(course_id, class_id):
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(GET_EMAILS_FROM_COURSE_AND_CLASS, (course_id, class_id,))
            emails = cursor.fetchall()
    db_connect.connection_pool.putconn(connection)
    all_emails = []
    if emails != []:
        for email in emails:
            all_emails.append(email[0])
        return all_emails
    return []

def get_staff_emails_from_course(course_id):
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(GET_STAFF_EMAILS_FROM_COURSE, (course_id,))
            emails = cursor.fetchall()
    db_connect.connection_pool.putconn(connection)
    all_emails = []
    if emails != []:
        for email in emails:
            all_emails.append(email[0])
        return all_emails
    return []