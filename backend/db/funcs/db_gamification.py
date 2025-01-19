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
from db.user_profile_queries import *
from db.gamification_queries import *
from src import db_connect

def update_student_points_balance(points_balance, student_id, course_id):
    """
    Update the points balance of a student in a specific course in the database.

    This function takes the updated points balance, student ID, and course ID as input parameters and updates the points
    balance of the specified student in the specified course in the database.

    Parameters:
        points_balance (int): The updated points balance of the student in the course.
        student_id (int): The unique identifier of the student whose points balance is to be updated.
        course_id (int): The unique identifier of the course in which the student's points balance will be updated.
    """
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(UPDATE_STUDENT_POINTS_BALANCE, (points_balance, student_id, course_id,))
    db_connect.connection_pool.putconn(connection)
    
def get_students_points_balance(student_id, course_id):
    """
    Retrieve the points balance of a student in a specific course from the database.

    This function takes the student ID and course ID as input parameters and retrieves the points balance of the specified
    student in the specified course from the database.

    Parameters:
        student_id (int): The unique identifier of the student whose points balance is to be retrieved.
        course_id (int): The unique identifier of the course for which the student's points balance will be retrieved.

    Returns:
        int: The points balance of the student in the course.
    """
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(GET_STUDENT_POINTS_BALANCE, (student_id, course_id,))
            points = cursor.fetchone()[0]
    db_connect.connection_pool.putconn(connection)
    return points

def add_item_to_shop(course_id, item_file, item_name, item_desc, cost):
    """
    Add an item to the shop for a specific course in the database.

    This function takes the course ID, item file, item description, cost, and item count as input parameters and adds a new
    item to the shop for the specified course in the database.

    Parameters:
        course_id (int): The unique identifier of the course to which the item will be added.
        item_file (str): The file path or name of the item to be added to the shop.
        item_desc (str): The description of the item.
        cost (float): The cost of the item.

    Returns:
        int: The item ID of the newly created item.
    """
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(ADD_ITEM_TO_SHOP, (course_id, item_file, item_name, item_desc, cost,))
            item_id = cursor.fetchone()[0]
    db_connect.connection_pool.putconn(connection)
    return item_id

def add_item_to_student_inventory(student_id, course_id, item_id):
    """
    Add an item to a student's inventory for a specific course in the database.

    This function takes the student ID, course ID, and item ID as input parameters and adds the specified item to the student's
    inventory for the specified course in the database.

    Parameters:
        student_id (int): The unique identifier of the student whose inventory will be updated.
        course_id (int): The unique identifier of the course in which the student's inventory will be updated.
        item_id (int): The unique identifier of the item to be added to the student's inventory.
    """
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(ADD_ITEM_INTO_STUDENT_INVENTORY, (student_id, course_id, item_id,))
    db_connect.connection_pool.putconn(connection)
    
def wishlist_item_lol(student_id, course_id, item_id):
    """
    Add an item to a student's wishlist for a specific course in the database.

    This function takes the student ID, course ID, and item ID as input parameters and adds the specified item to the student's
    wishlist for the specified course in the database.

    Parameters:
        student_id (int): The unique identifier of the student whose wishlist will be updated.
        course_id (int): The unique identifier of the course in which the student's wishlist will be updated.
        item_id (int): The unique identifier of the item to be added to the student's wishlist.
    """
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(WISHLIST_ITEM, (student_id, course_id, item_id,))
    db_connect.connection_pool.putconn(connection)
    
def create_mission(mission_title, mission_content, mission_type, points, condition, course_id):
    """
    Create a new mission in the database.

    This function takes the mission ID, mission content, and condition as input parameters and creates a new mission in the
    database with the provided information.

    Parameters:
        id (int): The unique identifier for the new mission.
        mission_content (str): The content or description of the mission.
        condition (int): The condition or requirements or max_count for completing the mission.
    """
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(CREATE_MISSION, (mission_title, mission_content, mission_type, points, condition, course_id,))
            id = cursor.fetchone()[0]
    db_connect.connection_pool.putconn(connection)
    return id
    
    
def add_mission_to_student_tracker(mission_id, student_id):
    """
    Add a mission to a student's mission tracker in the database.

    This function takes the mission ID, student ID, and counter as input parameters and adds the specified mission to the
    student's mission tracker in the database.

    Parameters:
        mission_id (int): The unique identifier of the mission to be added to the student's mission tracker.
        student_id (int): The unique identifier of the student for whom the mission will be added to the mission tracker.
        counter (int): The initial value of the mission counter in the mission tracker.
    """
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(CREATE_MISSION_TRACKER, (mission_id, student_id,))
    db_connect.connection_pool.putconn(connection)
    
def get_student_wishlist_items(student_id, course_id):
    """
    Retrieve all wishlist items of a student for a specific course from the database.

    This function takes the student ID and course ID as input parameters and retrieves all the wishlist items of the specified
    student for the specified course from the database.

    Parameters:
        student_id (int): The unique identifier of the student whose wishlist items are to be retrieved.
        course_id (int): The unique identifier of the course for which the student's wishlist items will be retrieved.

    Returns:
        list: A list of item IDs representing the wishlist items of the student for the specified course.
    """
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(GET_ALL_WISHLISTED_ITEMS, (student_id, course_id,))
            item_id = cursor.fetchall()
    db_connect.connection_pool.putconn(connection)
    if item_id != []:
        return item_id
    return []

def get_student_wishlist_items_not_bought(student_id, course_id):
    """
    Retrieve all wishlist items of a student for a specific course from the database.

    This function takes the student ID and course ID as input parameters and retrieves all the wishlist items of the specified
    student for the specified course from the database.

    Parameters:
        student_id (int): The unique identifier of the student whose wishlist items are to be retrieved.
        course_id (int): The unique identifier of the course for which the student's wishlist items will be retrieved.

    Returns:
        list: A list of item IDs representing the wishlist items of the student for the specified course.
    """
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(GET_ALL_WISHLISTED_ITEMS_NOT_BOUGHT, (student_id, course_id,))
            item_id = cursor.fetchall()
    db_connect.connection_pool.putconn(connection)
    if item_id != []:
        return item_id
    return []

def get_student_inventory(student_id, course_id):
    """
    Retrieve all owned items of a student for a specific course from the database.

    This function takes the student ID and course ID as input parameters and retrieves all the owned items of the specified
    student for the specified course from the database.

    Parameters:
        student_id (int): The unique identifier of the student whose owned items are to be retrieved.
        course_id (int): The unique identifier of the course for which the student's owned items will be retrieved.

    Returns:
        list: A list of item IDs representing the owned items of the student for the specified course.
    """
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(GET_ALL_OWNED_ITEMS, (student_id, course_id,))
            item_id = cursor.fetchall()
    db_connect.connection_pool.putconn(connection)
    if item_id != []:
        return item_id
    return []

def get_course_shop_inventory(course_id):
    """
    Retrieve all items in the shop inventory for a specific course from the database.

    This function takes the course ID as an input parameter and retrieves all the items in the shop inventory for the specified
    course from the database.

    Parameters:
        course_id (int): The unique identifier of the course for which the shop inventory items will be retrieved.

    Returns:
        list: A list of item IDs representing the items in the shop inventory for the specified course.
    """
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(GET_ALL_ITEMS_IN_COURSE_SHOP, (course_id,))
            item_id = cursor.fetchall()
    db_connect.connection_pool.putconn(connection)
    if item_id != []:
        return item_id
    return []

def get_item_info(item_id):
    """
    Retrieve information about an item from the database.

    This function takes the item ID as an input parameter and retrieves information about the specified item from the database.

    Parameters:
        item_id (int): The unique identifier of the item for which the information will be retrieved.

    Returns:
        dict: A dictionary containing information about the item, including 'id', 'course_id', 'item_file', 'item_desc',
        'cost', and 'limit'.
    """
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(GET_ITEM_INFO, (item_id,))
            item = cursor.fetchall()
    db_connect.connection_pool.putconn(connection)
    if item != []:
        return {
            "id": item[0][0],
            "course_id": item[0][1],
            "item_file": item[0][2],
            "item_name": item[0][3],
            "item_desc": item[0][4],
            "cost": item[0][5]
        }
    return {}

def get_mission_info(mission_id):
    """
    Retrieve information about a mission from the database.

    This function takes the mission ID as an input parameter and retrieves information about the specified mission from the
    database.

    Parameters:
        mission_id (int): The unique identifier of the mission for which the information will be retrieved.

    Returns:
        dict: A dictionary containing information about the mission, including 'id', 'mission_content', and 'condition'.
    """
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(GET_MISSION_INFO, (mission_id,))
            mission = cursor.fetchall()
    db_connect.connection_pool.putconn(connection)
    if mission != []:
        return {
            "id": mission[0][0],
            "mission_title": mission[0][1],
            "mission_content": mission[0][2],
            "mission_type": mission[0][3],
            "points": mission[0][4],
            "condition": mission[0][5],
        }
    return {}

def check_user_in_mission(student_id):
    """
    Check if a student is currently participating in any mission.

    This function takes the student ID as an input parameter and checks if the specified student is currently participating in
    any mission in the database.

    Parameters:
        student_id (int): The unique identifier of the student to check for mission participation.

    Returns:
        bool: True if the student is participating in any mission, False otherwise.
    """
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(CHECK_USER_IN_MISSION, (student_id,))
            ret = cursor.fetchall()
    db_connect.connection_pool.putconn(connection)
    if (ret == []):
        return False
    return True

def update_mission_counter(count, mission_id, student_id):
    """
    Update the mission counter for a specific student's mission.

    This function takes the count, mission ID, and student ID as input parameters and updates the mission counter for the
    specific student's mission in the database.

    Parameters:
        count (int): The updated value of the mission counter.
        mission_id (int): The unique identifier of the mission for which the counter will be updated.
        student_id (int): The unique identifier of the student whose mission counter will be updated.

    Returns:
        None
    """
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(UPDATE_MISSION_COUNTER, (count, mission_id, student_id,))
    db_connect.connection_pool.putconn(connection)
    
def get_mission_tracker_count(mission_id, student_id):
    """
    Retrieve the mission tracker count for a specific student's mission.

    This function takes the mission ID and student ID as input parameters and retrieves the mission tracker count for the
    specific student's mission from the database.

    Parameters:
        mission_id (int): The unique identifier of the mission for which the mission tracker count will be retrieved.
        student_id (int): The unique identifier of the student whose mission tracker count will be retrieved.

    Returns:
        int: The mission tracker count for the specific student's mission.
    """
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(GET_MISSION_TRACKER_INFO, (mission_id, student_id,))
            ret = cursor.fetchall()
    db_connect.connection_pool.putconn(connection)
    if ret != []:
        return {
            "mission_id": ret[0][0],
            "counter": ret[0][2],
            "is_achieved": ret[0][3]
        }
    return {}

def rank_students_in_course(course_id):
    """
    Rank students based on points in a specific course in descending order.

    This function takes the course ID as an input parameter and ranks students based on points achieved in the specified course
    from the database in descending order.

    Parameters:
        course_id (int): The unique identifier of the course for which students will be ranked.

    Returns:
        list: A list of student IDs representing the ranked students in the specified course.
    """
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(RANK_STUDENTS_BY_POINTS, (course_id,))
            student_id = cursor.fetchall()
    db_connect.connection_pool.putconn(connection)
    if student_id != []:
        return student_id
    return []

def db_update_quiz_points(quiz_points, quiz_id):
    
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(UPDATE_QUIZ_POINTS, (quiz_points, quiz_id,))
    db_connect.connection_pool.putconn(connection)
    
def db_update_assignment_points(assignment_points, assignment_id):
    
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(UPDATE_ASSIGNMENT_POINTS, (assignment_points, assignment_id,))
    db_connect.connection_pool.putconn(connection)
    
def get_quiz_points_worth(quiz_id):
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(GET_QUIZ_POINTS, (quiz_id,))
            quiz_points = cursor.fetchone()[0]
    db_connect.connection_pool.putconn(connection)
    return quiz_points

def get_assignment_points_worth(assignment_id):
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(GET_ASSIGNMENT_POINTS, (assignment_id,))
            assignment_points = cursor.fetchone()[0]
    db_connect.connection_pool.putconn(connection)
    return assignment_points

def update_mission_achieved(mission_id, student_id):
    """
    Update the mission achieved to true
    """
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(UPDATE_MISSION_ACHIEVED, (mission_id, student_id,))
    db_connect.connection_pool.putconn(connection)
    
def update_spin_cost(course_id, cost):
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(UPDATE_SPIN_COST, (cost, course_id,))
    db_connect.connection_pool.putconn(connection)
    
    
def update_guess_cost(course_id, cost):
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(UPDATE_GUESS_COST, (cost, course_id,))
    db_connect.connection_pool.putconn(connection)
    
def get_spin_cost(course_id):
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(GET_SPIN_COST, (course_id,))
            cost = cursor.fetchone()[0]
    db_connect.connection_pool.putconn(connection)
    return cost
    
def get_guess_cost(course_id):
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(GET_GUESS_COST, (course_id,))
            cost = cursor.fetchone()[0]
    db_connect.connection_pool.putconn(connection)
    return cost

def get_course_missions(course_id):
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(GET_COURSE_MISSIONS, (course_id,))
            ret = cursor.fetchall()
    db_connect.connection_pool.putconn(connection)
    if ret != []:
        return ret
    return []

def get_course_missions_by_type(course_id, mission_type):
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(GET_MISSION_BY_TYPE, (course_id, mission_type,))
            ret = cursor.fetchall()
    db_connect.connection_pool.putconn(connection)
    if ret != []:
        return ret
    return []

def set_viewed_quiz(quiz_submission_id):
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(SET_VIEWED_QUIZ, (quiz_submission_id,))
    db_connect.connection_pool.putconn(connection)
    return

def set_viewed_ass(submission_id):
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(SET_VIEWED_ASS, (submission_id,))
    db_connect.connection_pool.putconn(connection)
    return

def update_bought_wishlist_item(student_id, course_id, item_id):
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(UPDATE_BOUGHT_WISHLIST_ITEM, (student_id, course_id, item_id,))
    db_connect.connection_pool.putconn(connection)
    return

def check_item_wishlisted(student_id, course_id, item_id):
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(CHECK_ITEM_WISHLISTED, (student_id, course_id, item_id,))
            ret = cursor.fetchall()
    db_connect.connection_pool.putconn(connection)
    if (ret == []):
        return False
    return True