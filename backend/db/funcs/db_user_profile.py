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
from src import db_connect

def update_user_name(firstname, lastname, user_id):
    """
    Update the first name and last name of a user in the database.

    This function takes the first name, last name, and user ID as input parameters and updates the corresponding user's
    information in the database with the new first name and last name.

    Parameters:
        firstname (str): The updated first name of the user.
        lastname (str): The updated last name of the user.
        user_id (int): The unique identifier of the user whose name needs to be updated.
    """
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(UPDATE_USER_NAME, (firstname, lastname, user_id,))
    db_connect.connection_pool.putconn(connection)
    
def update_user_email(email, user_id):
    """
    Update the email address of a user in the database.

    This function takes the updated email address and the user ID as input parameters and updates the corresponding
    user's email information in the database.

    Parameters:
        email (str): The updated email address of the user.
        user_id (int): The unique identifier of the user whose email needs to be updated.
    """
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(UPDATE_USER_EMAIL, (email, user_id,))
    db_connect.connection_pool.putconn(connection)
    
def update_user_password(password, user_id):
    """
    Update the password of a user in the database.

    This function takes the updated password and the user ID as input parameters and updates the corresponding
    user's password information in the database.

    Parameters:
        password (str): The updated password of the user.
        user_id (int): The unique identifier of the user whose password needs to be updated.
    """
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(UPDATE_USER_PASSWORD, (password, user_id,))
    db_connect.connection_pool.putconn(connection)
    
def set_user_profile_avatar(thumbnail, user_id):
    """
    Set the avatar thumbnail for a user's profile in the database.

    This function takes the avatar thumbnail image and the user ID as input parameters and sets the corresponding user's
    profile avatar in the database.

    Parameters:
        thumbnail (str): The avatar thumbnail image data represented as base64.
        user_id (int): The unique identifier of the user whose avatar thumbnail needs to be set.
    """
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(SET_USER_THUMBNAIL, (thumbnail, user_id,))
    db_connect.connection_pool.putconn(connection)

def get_user_avatar(user_id):
    """
    Retrieve the avatar thumbnail of a user from the database.

    This function takes the user ID as input parameter and fetches the corresponding user's avatar thumbnail from the database.

    Parameters:
        user_id (int): The unique identifier of the user whose avatar thumbnail needs to be retrieved.

    Returns:
        base64 or None: The avatar thumbnail image data represented as base64, or None if the user's avatar is not found.
    """
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(GET_USER_AVATAR, (user_id,))
            avatar = cursor.fetchone()[0]
    db_connect.connection_pool.putconn(connection)
    return avatar

def comment_on_user_profile(user_id, content, date, commenter_id):
    """
    Add a comment on a user's profile in the database.

    This function takes the user ID, comment content, date, and commenter ID as input parameters and adds a new comment
    on the user's profile in the database.

    Parameters:
        user_id (int): The unique identifier of the user whose profile the comment is made on.
        content (str): The content of the comment.
        date (timestamp): The date of the comment in a datetime format, use datetime module.
        commenter_id (int): The unique identifier of the user who made the comment.

    Returns:
        int: The comment ID of the newly created comment.
    """
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(CREATE_COMMENT_ON_USER_PROFILE, (user_id, content, date, commenter_id,))
            comment_id = cursor.fetchone()[0]
    db_connect.connection_pool.putconn(connection)
    return comment_id

def return_comment_id(user_id, date, commenter_id):
    """
    Retrieve the comment ID from the database.

    This function takes the user ID, date, and commenter ID as input parameters and retrieves the corresponding comment ID
    from the database.

    Parameters:
        user_id (int): The unique identifier of the user whose comment ID is to be retrieved.
        date (timestamp): The date of the comment in a datetime format.
        commenter_id (int): The unique identifier of the user who made the comment.

    Returns:
        int or None: The comment ID of the specified comment if found, or None if the comment does not exist.
    """
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(RETURN_COMMENT_ID, (user_id, date, commenter_id,))
            comment_id = cursor.fetchone()[0]
    db_connect.connection_pool.putconn(connection)
    return comment_id

def get_comment_info(comment_id):
    """
    Retrieve information about a comment from the database.

    This function takes the comment ID as an input parameter and retrieves information about the comment from the database.

    Parameters:
        comment_id (int): The unique identifier of the comment.

    Returns:
        dict: A dictionary containing information about the comment, including 'id', 'user_id', 'content', 'date', and
              'commenter_id'.
    """
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(GET_COMMENT_INFO_FROM_ID, (comment_id,))
            comment = cursor.fetchall()
    db_connect.connection_pool.putconn(connection)
    if comment != []:
        return {
            "id": comment[0][0],
            "user_id": comment[0][1],
            "content": comment[0][2],
            "date": comment[0][3],
            "commenter_id": comment[0][4],
        }
    return {}

def edit_comment_given_comment_id(content, comment_id):
    """
    Edit the content of a comment in the database given its comment ID.

    This function takes the updated content and the comment ID as input parameters and edits the content of the comment
    with the specified comment ID in the database.

    Parameters:
        content (str): The new content of the comment.
        comment_id (int): The unique identifier of the comment to be edited.
    """
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(EDIT_POST_GIVEN_COMMENT_ID, (content, comment_id,))
    db_connect.connection_pool.putconn(connection)
    
def delete_post_given_comment_id(comment_id):
    """
    Delete a post and all its associated replies from the database given its comment ID.

    This function takes the comment ID as an input parameter and deletes the post and all its associated replies from the
    database based on the provided comment ID.

    Parameters:
        comment_id (int): The unique identifier of the comment representing the post to be deleted.
    """
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(DELETE_ALL_REPLIES, (comment_id,))
            cursor.execute(DELETE_POST, (comment_id,))
    db_connect.connection_pool.putconn(connection)
    
def reply_to_comment(content, date, user_id, comment_id):
    """
    Reply to a comment and store it in the database.

    This function takes the content, date, user ID, and comment ID as input parameters and stores the reply to the specified
    comment in the database.

    Parameters:
        content (str): The content of the reply.
        date (timestamp): The date of the reply in a datetime format.
        user_id (int): The unique identifier of the user who made the reply.
        comment_id (int): The unique identifier of the comment to which the reply is made.

    Returns:
        int: The reply ID of the newly created reply.
    """
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(REPLY_TO_COMMENT, (content, date, user_id, comment_id,))
            reply_id = cursor.fetchone()[0]
    db_connect.connection_pool.putconn(connection)
    return reply_id

def return_reply_id(user_id, date, comment_id):
    """
    Retrieve the reply ID from the database.

    This function takes the user ID, date, and comment ID as input parameters and retrieves the corresponding reply ID from
    the database.

    Parameters:
        user_id (int): The unique identifier of the user who made the reply.
        date (timestamp): The date of the reply in a datetime format.
        comment_id (int): The unique identifier of the comment to which the reply is made.

    Returns:
        int or None: The reply ID of the specified reply if found, or None if the reply does not exist.
    """
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(RETURN_REPLY_ID, (user_id, date, comment_id,))
            reply_id = cursor.fetchone()[0]
    db_connect.connection_pool.putconn(connection)
    return reply_id

def get_reply_info(reply_id):
    """
    Retrieve information about a reply from the database.

    This function takes the reply ID as an input parameter and retrieves information about the reply from the database.

    Parameters:
        reply_id (int): The unique identifier of the reply.

    Returns:
        dict: A dictionary containing information about the reply, including 'id', 'content', 'date', 'user_id', and
              'comment_id,' which is the id of the parent comment.
    """
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(GET_REPLY_INFO_FROM_ID, (reply_id,))
            reply = cursor.fetchall()
    db_connect.connection_pool.putconn(connection)
    if reply != []:
        return {
            "id": reply[0][0],
            "content": reply[0][1],
            "date": reply[0][2],
            "user_id": reply[0][3],
            "comment_id": reply[0][4],
        }
    return {}

def edit_reply_given_reply_id(content, reply_id):
    """
    Edit the content of a reply in the database given its reply ID.

    This function takes the updated content and the reply ID as input parameters and edits the content of the reply with
    the specified reply ID in the database.

    Parameters:
        content (str): The updated content of the reply.
        reply_id (int): The unique identifier of the reply to be edited.
    """
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(EDIT_REPLY_GIVEN_REPLY_ID, (content, reply_id,))
    db_connect.connection_pool.putconn(connection)

def delete_reply_given_reply_id(reply_id):
    """
    Delete a reply from the database given its reply ID.

    This function takes the reply ID as an input parameter and deletes the reply from the database based on the provided
    reply ID.

    Parameters:
        reply_id (int): The unique identifier of the reply to be deleted.
    """
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(DELETE_REPLY, (reply_id,))
    db_connect.connection_pool.putconn(connection)
    
def get_all_comments_on_profile(user_id):
    """
    Retrieve all comments on a user's profile from the database.

    This function takes the user ID as an input parameter and retrieves all the comments made on the user's profile from the
    database.

    Parameters:
        user_id (int): The unique identifier of the user whose profile comments are to be retrieved.

    Returns:
        list: A list of tuples containing information about each comment on the user's profile. Each tuple should have the
              following structure: (comment_id).
    """
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(GET_ALL_COMMENTS_ON_USER_PROFILE, (user_id,))
            comments = cursor.fetchall()
    db_connect.connection_pool.putconn(connection)
    if comments != []:
        return comments
    return []

def get_all_replies_for_comment(comment_id):
    """
    Retrieve all replies to a comment from the database.

    This function takes the comment ID as an input parameter and retrieves all the replies made to the specified comment from
    the database.

    Parameters:
        comment_id (int): The unique identifier of the comment whose replies are to be retrieved.

    Returns:
        list: A list of tuples containing information about each reply to the comment. Each tuple should have the following
              structure: (reply_id).
    """
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(GET_ALL_REPLIES_TO_COMMENT, (comment_id,))
            replies = cursor.fetchall()
    db_connect.connection_pool.putconn(connection)
    if replies != []:
        return replies
    return []

def create_user_post(user_id, content, date, title):
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(CREATE_POST, (user_id, content, date, title,))
            post_id = cursor.fetchone()[0]
    db_connect.connection_pool.putconn(connection)
    return post_id

def get_all_posts_from_profile(user_id):
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(GET_ALL_POSTS_FROM_USER_PROFILE, (user_id,))
            post_id = cursor.fetchall()
    db_connect.connection_pool.putconn(connection)
    if post_id != []:
        return post_id
    return []

def get_post_info_from_id(post_id):
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(GET_POST_INFO_FROM_ID, (post_id,))
            reply = cursor.fetchall()
    db_connect.connection_pool.putconn(connection)
    if reply != []:
        return {
            "id": reply[0][0],
            "user_id": reply[0][1],
            "content": reply[0][2],
            "date": reply[0][3],
            "title": reply[0][4],
        }
    return {}

def edit_post_given_post_id(content, post_id):
    """
    Edit the content of a post in the database given its post ID.

    This function takes the updated content and the post ID as input parameters and edits the content of the post with
    the specified post ID in the database.

    Parameters:
        content (str): The updated content of the post.
        post_id (int): The unique identifier of the post to be edited.
    """
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(EDIT_POST_GIVEN_POST_ID, (content, post_id,))
    db_connect.connection_pool.putconn(connection)

def create_all_badges():
    "creates all badge types"
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute('SELECT COUNT(*) FROM badges')
            count = cursor.fetchone()[0]
            if count == 0:
                cursor.execute(INSERT_BADGE, ('assignment_badge',))
                cursor.execute(INSERT_BADGE, ('quiz_badge',))
                cursor.execute(INSERT_BADGE, ('mark_badge',))
                cursor.execute(INSERT_BADGE, ('wheel_badge',))
                cursor.execute(INSERT_BADGE, ('item_badge',))
    db_connect.connection_pool.putconn(connection)

def get_badge_id(badge):
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(GET_BADGE_ID, (badge,))
            badge_id = cursor.fetchall()[0]
    db_connect.connection_pool.putconn(connection)
    return badge_id

def add_badge_to_user(user_id, badge_id):
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(INSERT_BADGE_INTO_USER, (user_id, badge_id,))
    db_connect.connection_pool.putconn(connection)

def get_user_badges(user_id):
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(GET_USER_BADGES, (user_id,))
            badge_id = cursor.fetchall()
    db_connect.connection_pool.putconn(connection)
    if badge_id != []:
        return badge_id
    return []

def get_badge_info(badge_id):
    connection = db_connect.connection_pool.getconn()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(GET_BADGE_INFO, (badge_id,))
            badge = cursor.fetchall()[0]
    db_connect.connection_pool.putconn(connection)
    return badge