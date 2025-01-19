import psycopg2
from datetime import datetime
from flask import Flask
import psycopg2.pool
import sys
import binascii
sys.path.append('db')
from create_queries import *
from login_queries import INSERT_USER
from reset_queries import RESET_USERS_TABLE, RESET_USER_SEQ
from course_queries import *
from funcs.db_auth import *
from funcs.db_course import *
from funcs.db_quiz import *
from funcs.db_resource import *
from funcs.db_file import *
from funcs.db_search import *
from funcs.db_class import *
from funcs.db_assignment import *
from funcs.db_forum import *
from funcs.db_user_profile import *
from funcs.db_gamification import *

connection_pool = psycopg2.pool.SimpleConnectionPool(
                    minconn=1,
                    maxconn=10,
                    host='localhost',
                    port='5432',
                    database='postgres',
                    user='postgres',
                    password='root'
                )

conn = connection_pool.getconn()
cursor = conn.cursor()

cursor.execute(CREATE_USERS_TABLE)   
cursor.execute(CREATE_TOKENS_TABLE)
cursor.execute(RESET_TOKENS_TABLE)
cursor.execute(CREATE_USERS_COMMENTS_TABLE)
cursor.execute(CREATE_USER_REPLIES_TABLE)
cursor.execute(CREATE_COURSES_TABLE)
cursor.execute(CREATE_COURSES_STUDENT_TABLE)
cursor.execute(CREATE_COURSES_STAFF_TABLE)
cursor.execute(CREATE_FILES_TABLE)
cursor.execute(CREATE_CLASSES_TABLE)
cursor.execute(CREATE_RESOURCES_TABLE)
cursor.execute(CREATE_COURSE_RESOURCES_TABLE)
cursor.execute(CREATE_ASSIGNMENTS_TABLE)
cursor.execute(CREATE_CLASS_USERS_TABLE)
cursor.execute(CREATE_ASSIGNMENTS_STUDENTS_TABLE)
cursor.execute(CREATE_QUIZ_TABLE)
cursor.execute(CREATE_QUIZ_QUESTIONS_TABLE)
cursor.execute(CREATE_QUIZ_SUBMISSIONS)
cursor.execute(CREATE_QUIZ_SUBMITTED_ANSWERS)
cursor.execute(CREATE_QUIZ_MARKING)
cursor.execute(CREATE_FORUM_THREADS)
cursor.execute(CREATE_FORUM_CATEGORY)
cursor.execute(CREATE_THREAD_CATEGORIES)
cursor.execute(CREATE_FORUM_REPLIES)
cursor.execute(CREATE_MISSION_TABLE)
cursor.execute(CREATE_MISSION_TRACKER_TABLE)
cursor.execute(CREATE_COURSE_SHOP_TABLE)
cursor.execute(CREATE_STUDENT_COURSE_INVENTORY)

# cursor.execute(INSERT_TOKEN, ('sadgfasdg', 1))

conn.commit()

cursor.close()
connection_pool.putconn(conn)

conn = connection_pool.getconn()

insert_user('james', 'cai', 'pw1234', 'jam@email.com', 'student')
insert_user('john', 'doe', 'pw1234234', 'john@email.com', 'lecturer')
insert_user('jane', 'smith', 'jgdfkgmv', 'jane@email.com', 'teacher')
insert_user('james2', 'cai2', 'pw12342', 'jam2@email.com', 'student')

insert_course("COMP3900", "T2", "C0MP1511", "capstone course", "")
insert_staff_into_course(1, 2)
enrol_request_student(1, 1)
enrol_student(1, 1)
enrol_request_student(1, 4)
enrol_student(1, 4)

# print(get_students_points_balance(1,1))
# update_student_points_balance(10,1,1)
# update_student_points_balance(5,4,1)
# print(get_students_points_balance(1,1))
# add_item_to_shop(1, 'sadfasd', 'item_desc1', 1, None)
# add_item_to_shop(1, 'asdf', 'item_desc2', 2, 5)
# print(get_course_shop_inventory(1))
# print(get_item_info(2))
# add_item_to_student_inventory(1,1,2)
# wishlist_item(1,1,1)
# print(get_student_inventory(1,1))
# print(get_student_wishlist_items(1,1))
# print(rank_students_in_course(1))
# create_mission(1, 'mission_dec', 5)
# add_mission_to_student_tracker(1, 1, 0)
# print(get_mission_info(1))
# print(check_user_in_mission(2))
# update_mission_counter(5,1,1)
# print(get_mission_tracker_count(1,1))

# update_user_name('j', 'c', 1)
# update_user_email('sg@email.com', 1)
# update_user_password('newpw', 1)
# set_user_profile_avatar('1123', 1)
# print(get_user_avatar(1))
# print(get_user_info(1))
# comment_on_user_profile(1, 'comment', datetime(2023, 6, 28, 10, 30, 0), 2)
# print(return_comment_id(1, datetime(2023, 6, 28, 10, 30, 0), 2))
# print(get_comment_info(1))
# edit_comment_given_comment_id('comment2', 1)
# print(get_comment_info(1))
# reply_to_comment('reply', datetime(2023, 6, 28, 11, 30, 0), 3, 1)
# reply_to_comment('reply2', datetime(2023, 6, 28, 11, 30, 0), 2, 1)
# print(return_reply_id(3, datetime(2023, 6, 28, 11, 30, 0), 1))
# print(get_reply_info(1))
# edit_reply_given_reply_id('reply2', 1)
# print(get_reply_info(1))
# print(get_all_comments_on_profile(1))
# print(get_all_replies_for_comment(1))
# delete_reply_given_reply_id(1)
# print(get_reply_info(1))
# delete_post_given_comment_id(1)
# print(get_comment_info(1))



# print(get_student_emails_from_course(1))

# insert_class("class1", 1, datetime(2023, 6, 28, 10, 30, 0), "description", "thumbnail")
# insert_user_into_class(1, 1)
# print(get_users_from_class(1))
# print(get_class_info(1))
# print(get_class_thumbnail(1))
# print(check_in_class(1, 1))
# print(get_user_class(1, 1))

# insert_file("FILE1", "test", 2)
# insert_file("FILE2", "est2", 2)
# insert_resource("test cat", "test file desc", 1)
# add_resource_to_course(1, 1)
# insert_resource("test cat", "test file desc", 2)
# add_resource_to_course(1, 2)

# print(search_resource("E", 1))

# create_category("cat", 1)
# create_category("cat2", 1)
# create_thread('title', 'content', datetime(2023, 6, 28, 10, 30, 0), 1, None, 1)
# create_thread('title2', 'content2', datetime(2023, 6, 28, 10, 30, 0), 2, None, 1)
# print(get_thread_info(1))
# link_category_to_thread(1, 1)
# link_category_to_thread(2, 2)
# create_reply('reply-content', datetime(2023, 7, 30, 12, 30, 0), 1, 1, None)
# create_reply('reply-content2', datetime(2023, 7, 30, 12, 30, 0), 1, 1, None)
# print(get_all_replies_from_thread(1))
# print(get_reply_info(2))
# print(get_all_threads_from_category('cat2'))
# print(get_all_threads_from_course(1))
# print(get_all_categories(1))
# categories = []
# for category in get_all_categories(1):
#     categories.append(category[0])
# print(categories)

# insert_assignment(1, datetime(2023, 6, 28, 10, 30, 0), 100, "description", 100, None, 1)
# print(get_assignment_info(1))

# insert_quiz("quiz1", 1, 1, 2, datetime(2023, 6, 28, 10, 30, 0), datetime(2023, 6, 28, 23, 30, 0), 5)
# insert_quiz("quiz2", 1, 1, 2, datetime(2023, 7, 30, 12, 30, 0), datetime(2023, 7, 31, 22, 30, 0), 5)
# print(get_quiz_info(1))
# print(get_quizzes_in_course(1))
# add_short_answer_question(1, "short_answer", "Whats you name?", 1, None)
# add_multiple_choice_question(1, "multiple_choice", "Which course do you do", 1, None, "COMP3900", "COMP1151", "COMP3300", "COMP1521", "A")
# add_short_answer_question(1, "short_answer", "Whats you job?", 1, None)
# create_user_quiz_attempt(1, 1)
# submit_quiz_answer(1, 1, 1, "james")
# submit_quiz_answer(2, 1, 1, "A")
# submit_quiz_answer(3, 1, 1, "wool")
# update_attempt_submission_time(datetime.now(), 1)
# update_quiz_submission_view(1,1)
# print(get_quiz_submission_view_status(1,1))

# print(get_questions_for_quiz(1))
# print(get_user_quiz_submission_info(1, 1))

# mark_quiz(1, 1, 1, "correct")
# mark_quiz(1, 2, 1, "correct")
# update_submission_mark(2, 2, 1, 1, "feedback")
# print(get_user_quiz_submission_info(1, 1))
# print(get_user_submitted_quiz(1, 1))
# print("j")
# print(get_user_marked_quizzes(1))
# print(check_submission_date(1,1))
# print("j")
# print(get_question_info(1))
connection_pool.putconn(conn)