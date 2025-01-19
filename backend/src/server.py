from flask import Flask, request, render_template
from flask_cors import CORS
from src import config
import psycopg2
from psycopg2 import pool
import os
import json
from json import dumps
from src.auth import register, login, logout
from src.course import *
from src.assignment import *
from src.quiz import *
from src.forum import *
from src.classes import *
from src.live_class import *
from src.user_profile import *
from src.gamification import *
from src.upload_video import *
from db.create_queries import CREATE_USERS_TABLE, CREATE_TOKENS_TABLE
from db.login_queries import INSERT_USER, INSERT_TOKEN, GET_USER, MATCH_EMAIL_PW, MATCH_EMAIL, MATCH_TOKEN
from db.reset_queries import RESET_TOKENS_TABLE
from db.forum_queries import *
from src import db_connect
from src.helpers import *
from src import setup

# note: DB connection set up in db_connect.py

def quit_gracefully(*args):
    '''For coverage'''
    exit(0)


def defaultHandler(err):
    response = err.get_response()
    print('response', err, err.get_response())
    response.data = dumps({
        "code": err.code,
        "name": "System Error",
        "message": err.get_description(),
    })
    response.content_type = 'application/json'
    return response


APP = Flask(__name__)
CORS(APP)

APP.config['TRAP_HTTP_EXCEPTIONS'] = True
APP.register_error_handler(Exception, defaultHandler)

setup.server_setup()
dummy_token = 0

@APP.route("/home", methods=['GET'])
def server_home():
    """ get the home dashboard
    Args:
        token: string
    
    Returns:
        home_course: [
            {
                course_id: int,
                course_name: string,
                course_term: string,
                course_thumbnail: base64 string,
            }
        ]
    """
    
    token = str(request.args.get("token"))
    ret = get_home_dashboard(token)
    return {
        'home_courses': ret["home_info"],
    }

@APP.route("/register", methods=['POST'])
def server_auth_register():
    """ register a new user
    Args:
        email: string
        password: string
        firstname: string
        lastname: string
        role: string, one of [admin, lecturer, teacher, student]

    Returns:
        user_id: int
        token: string
    """
    
    data = request.get_json()
    ret = register(data['email'], data['password'], data['firstname'], data['lastname'], data['role']) 
    return {
        'user_id': ret['user_id'],
        'token': ret['token']
    }

@APP.route("/login", methods=['POST'])
def server_auth_login():
    """ existing user login
    Args:
        email: string
        password: string

    Returns:
        user_id: int
        token: string
    """
    
    data = request.get_json()
    ret = login(data['email'], data['password'])
    return {
        'user_id': ret['user_id'],
        'token': ret['token']
    }

@APP.route("/logout", methods=['POST'])
def server_auth_logout():
    """ logged in user logout
    Args:
        token: string

    Returns:
        None
    """
    
    data = request.get_json()
    ret = logout(data['token'])
    return {}

@APP.route("/create_course", methods=['POST'])
def server_create_course():
    """staff creating a new course
    token: string
    name: string
    term: string
    requirement: string
    description: string
    thumbnail: base64 string
    
    Returns:
        course_id: int
    """
    
    data = request.get_json()
    ret = create_course(data["token"], data["name"], data["term"], data["requirement"], data["description"], data["thumbnail"])
    return {
        'course_id': ret["course_id"],
    }

@APP.route("/search_course", methods=['GET'])
def server_search_course():
    """user search a course
    Args:
        token: string
        course_id: string

    Returns:
        {
            course_id: int
            course_name: string
            course_term: string
            course_thumbnail: base64 string
        }
    """
    
    token = str(request.args.get("token"))
    course_id = int(request.args.get("course_id"))
    ret = search_course(token, course_id)
    return {
        'course_id': ret["course_id"],
        'course_name': ret["course_name"],
        'course_term': ret["course_term"],
        'course_thumbnail': ret["course_thumbnail"]
    }

@APP.route("/enrol_request_course", methods=['POST'])
def server_enrol_request_course():
    """user submit an enrolment request for a course
    Args:
        token: string
        course_id: int

    Returns:
        None
    """
    
    data = request.get_json()
    ret = enrol_request_course(data["token"], data["course_id"])
    return {
    }

@APP.route("/course/home", methods=['GET'])
def server_course_home():
    """get the course home
    Args:
        token: string
        course_id: int

    Returns:
        {
            course_id: int
            course_name: string
            course_term: string
            course_thumbnail: base64 string
        }
    """
    
    token = str(request.args.get("token"))
    course_id = str(request.args.get("course_id"))
    ret = get_course_home(token, course_id)
    return {
        'course_id': ret["course_id"],
        'course_name': ret["course_name"],
        'course_term': ret["course_term"],
        'course_thumbnail': ret["course_thumbnail"]
    }

@APP.route("/course/participants", methods=['GET'])
def server_get_participants():
    """get all participants of a course
    Args:
        token: string
        course_id: int

    Returns:
        participant_info: [
            {
                user_id: int
                user_firstname: string
                user_lastname: string
                user_email: string
                user_role: string, one of [admin, lecturer, teacher, student]
            }
        ]
    """
    
    token = str(request.args.get("token"))
    course_id = str(request.args.get("course_id"))
    ret = get_participants(token, course_id)
    return {
        "participant_info": ret["participant_info"]
    }

@APP.route("/course/enrol_requests", methods=['GET'])
def server_get_course_enrol_request():
    """get all pending enrolment request of a course
    Args:
        token: string
        course_id: int

    Returns:
        pending_enrol_info: [
            {
                user_id: int
                user_firstname: string
                user_lastname: string
                user_email: string
                user_role: string, one of [admin, lecturer, teacher, student]
            }
        ]
    """
    
    token = str(request.args.get("token"))
    course_id = str(request.args.get("course_id"))
    ret = get_course_enrol_request(token, course_id)
    return {
        "pending_enrol_info": ret["pending_enrol_info"]
    }

@APP.route("/course/approve_enrolment", methods=['PUT'])
def server_approve_enrolment():
    """approve enrolment
    Args:
        token: string
        course_id: string
        enrollee_id: string
    
    Returns:
        None
    """
    
    data = request.get_json()
    approve_enrolment(data["token"], data["course_id"], data["enrollee_id"])
    return {
    }

@APP.route("/course/get_resources", methods=['GET'])
def server_get_resources():
    """get all resources of a course
    Args:
        token: string
        course_id: int

    Returns:
        _type_: _description_
    """
    token = str(request.args.get("token"))
    course_id = str(request.args.get("course_id"))
    ret = get_resources(token, course_id)
    return {
        "all_resource_info": ret["all_resource_info"]
    }

@APP.route("/course/upload_resources", methods=['POST'])
def server_upload_resources():
    """upload a resource to a course
    Args:
        token: string
        course_id: int
        resource_name: string
        resource_description: string
        resource_category: string
        file_string: base64 string

    Returns:
        resource_id: int
    """
    
    data = request.get_json()
    ret = upload_resources(data['token'], data['course_id'], data['resource_name'], data['resource_description'], data['resource_category'], data['file_string'], data['class_id'])
    return {
        "resource_id": ret["resource_id"]
    }

@APP.route("/course/download_resource", methods=['GET'])
def server_download_resources():
    """download a file
    Args:
        token: string
        course_id: int
        resource_id: int

    Returns:
        resource: {
            file: base64 string
            name: string
            uploader_id: int
        }
    """
    
    token = str(request.args.get("token"))
    course_id = str(request.args.get("course_id"))
    resource_id = str(request.args.get("resource_id"))
    ret = download_resource(token, course_id, resource_id)
    return {
        "resource": ret["resource"]
    }    

@APP.route("/course/get_assignments", methods=['GET'])
def server_get_assignments():
    """get all assignments of a course
    Args:
        token: string
        course_id: int
    
    Returns:
        all_assignment_info: [
            {
                assignment_id: int
                assignment_description: string
                assignment_grade: int
                assignment_percentage: int
                assignment_due_date: string
                assignement_course: course_id
                file: int, file_id
            }
        ]
    """
    
    token = str(request.args.get("token"))
    course_id = str(request.args.get("course_id"))
    ret = get_assignments(token, course_id)
    return {
        "all_assignment_info": ret["all_assignment_info"]
    }

@APP.route("/course/create_assignment", methods=['POST'])
def server_create_assignment():
    """create a new assignment
    Args:
        token: string
        course_id: int
        assignment_name: string
        assignment_description: string
        assignment_grade: int
        assignment_percentage: int
        file_string: base64 string
        due_data: string
    
    Returns:
        assignment_id: int
    """
    
    data = request.get_json()
    ret = create_assignment(data['token'], data['course_id'], data['assignment_name'], data['assignment_description'], 
                            data['assignment_grade'], data['assignment_percentage'], data['file_string'], data['due_date'], data['class_id'], data['assignment_points'])
    return {
        "assignment_id": ret["assignment_id"]
    }
    
@APP.route("/course/create_submission", methods=['POST'])
def server_create_submission():
    """create a new submission
    Args:
        token: string
        course_id: int
        assignment_id: int
        submission_name: string
        file_string: base64 string
        submit_time: string
        max_grade: int

    Returns:
        submission_id: int
    """
    
    data = request.get_json()
    ret = create_submission(data['token'], data['course_id'], data['assignment_id'], data['submission_name'], 
                            data['file_string'], data['submit_time'], data['max_grade'])
    return {
        "submission_id": ret["submission_id"]
    }

@APP.route("/course/get_submissions", methods=['GET'])
def server_get_submissions():
    """get all submissions of an assignment
    Args:
        token: string
        course_id: int
        assignment_id: int

    Returns:
        all_submissions_info: [
            {
                submission_id: int
                submission_time: string
                submission_note: string
                assignment_max_grade: int
                assignment_percentage: int
                assignment_grade: int
                submission_uploader: int
                assignment: int, assignment_id
                file: int, file_id
            }
        ]
    """
    token = str(request.args.get("token"))
    course_id = str(request.args.get("course_id"))
    assignment_id = str(request.args.get("assignment_id"))
    ret = get_submissions(token, course_id, assignment_id)
    return {
        "all_submissions_info": ret["all_submission_info"]
    }

@APP.route("/course/mark_submission", methods=['PUT'])
def server_mark_submission():
    """mark a submission
    Args:
        token: string
        course_id: int
        submission_id: int
        grade: int
        feedback: string
    
    Returns:
        submission_id: int
        grade: int
    """
    
    data = request.get_json()
    mark_submission(data["token"], data["course_id"], data["submission_id"], data["grade"], data["feedback"])
    return {
        "submission_id": data["submission_id"],
        "grade": data["grade"]
    }

@APP.route("/course/view_submission", methods=['GET'])
def server_view_submission():
    """view a single submission
    Args:
        token: string
        submission_id: int
    
    Returns:
        submission_info: {
            submission_id: int
            submission_time: string
            submission_note: string
            assignment_max_grade: int
            assignment_percentage: int
            assignment_grade: int
            submission_uploader: int
            assignment: int, assignment_id
            file: int, file_id
        }
    """
    
    token = str(request.args.get("token"))
    submission_id = str(request.args.get("submission_id"))
    ret = view_submission(token, submission_id)
    return {
        "submission_info": ret["submission_info"]
    }

@APP.route("/course/get_student_submissions", methods=['GET'])
def server_get_student_submissions():
    """get all submissions of a student
    Args:
        token: string
        course_id: int
        assignment_id: int

    Returns:
        student_submission_info: [
            {
                submission_id: int
                submission_time: string
                submission_note: string
                assignment_max_grade: int
                assignment_percentage: int
                submission_uploader: int
                assignment: int, assignment_id
                file: int, file_id
            }
        ]
    """
    
    token = str(request.args.get("token"))
    course_id = str(request.args.get("course_id"))
    assignment_id = str(request.args.get("assignment_id"))
    ret = get_student_submissions(token, course_id, assignment_id)
    return {
        "student_submission_info": ret["student_submission_info"]
    }

@APP.route("/course/download_assignment", methods=['GET'])
def server_download_assignment():
    """download an assignment
    Args:
        token: string
        course_id: int
        assignment_id: int

    Returns:
        assignment: {
            file: base64 string
            name: string
            uploader_id: int
        }
    """
    
    token = str(request.args.get("token"))
    course_id = str(request.args.get("course_id"))
    assignment_id = str(request.args.get("assignment_id"))
    ret = download_assignment(token, course_id, assignment_id)
    return {
        "assignment": ret["assignment"]
    }   

@APP.route("/course/download_submission", methods=['GET'])
def server_download_submission():
    """download a submission
    Args:
        token: string
        course_id: int
        submission_id: int

    Returns:
        submission: {
            file: base64 string
            name: string
            uploader_id: int
        }
    """
    
    token = str(request.args.get("token"))
    course_id = str(request.args.get("course_id"))
    submission_id = str(request.args.get("submission_id"))
    ret = download_submission(token, course_id, submission_id)
    return {
        "submission": ret["submission"]
    }   

@APP.route("/user_info", methods=['GET'])
def server_user_info():
    user_id = str(request.args.get("user_id"))
    ret = get_user_info(user_id)
    avatar = get_avatar(user_id)
    badges = get_badges(user_id)
    return {
        "user_id": ret["user_id"],
        "user_firstname": ret["user_firstname"],
        "user_lastname": ret["user_lastname"],
        "user_email": ret["user_email"],
        "user_avatar": avatar["avatar"],
        "user_badges": badges,
        "user_role": ret["user_role"],
    }

@APP.route("/assignment_info", methods=['GET'])
def server_assignment_info():
    assignment_id = str(request.args.get("assignment_id"))
    ret = get_assignment_info(assignment_id)
    return {
        "course_id": ret["course_id"],
        "assignment_due_date": ret["assignment_due_date"],
        "assignment_grade": ret["assignment_grade"],
        "assignment_description": ret["assignment_description"],
        "assignment_percentage": ret["assignment_percentage"],
        "file_id": ret["file_id"],
        "class_id": ret["class_id"],
        "assignment_points": ret["assignment_points"]
    }

@APP.route("/submission_info", methods=['GET'])
def server_submission_info():
    submission_id = str(request.args.get("submission_id"))
    ret = get_submission_info(submission_id)
    return {
        "ass_id": ret["ass_id"],
        "file_id": ret["file_id"],
        "student_id": ret["student_id"],
        "submit_time": ret["submit_time"],
        "feedback": ret["feedback"],
        "grade": ret["grade"],
        "max_grade": ret["max_grade"],
        "percentage": ret["percentage"],
    }

#@APP.route("/course/mark_submission", methods=['PUT'])
    
@APP.route("/quiz_list", methods=['GET'])
def server_quiz_list():
    token = str(request.args.get("token"))
    course_id = str(request.args.get("course_id"))
    ret = get_quiz_list(token, course_id)
    return {
        "quizzes": ret["quizzes"]
    }
    
@APP.route("/quiz_create", methods=['POST'])
def server_quiz_create():
    data = request.get_json()
    ret = quiz_create(data["token"], data["title"], data["course_id"], data["class_id"], data["deadline"], data["quiz_points"], data["questions"])
    return {
        "quiz_id": ret["quiz_id"]
    }
    
@APP.route("/quiz_submit", methods=['POST'])
def server_quiz_submit():
    data = request.get_json()
    ret = quiz_submit(data["token"], data["quiz_id"], data["course_id"], data["response"])
    return {
        "quiz_submission_id": ret["quiz_submission_id"]
    }
    
@APP.route("/quiz_mark", methods=['POST'])
def server_quiz_mark():
    data = request.get_json()
    ret = quiz_mark(data["token"], data["quiz_id"], data["student_id"], data["marking"], data["course_id"], data["feedback"])
    return {
        "total_mark": ret["total_mark"],
        "max_total_mark": ret["max_total_mark"]
    }
    
@APP.route("/quiz_release", methods=['PUT'])
def server_quiz_release():
    data = request.get_json()
    ret = quiz_release(data["token"], data["quiz_id"], data["course_id"])
    return {
        "quiz_id": ret["quiz_id"]
    }

@APP.route("/quiz_view_released_marks", methods=['GET'])
def server_quiz_view_released_marks():
    token = str(request.args.get("token"))
    course_id = str(request.args.get("course_id"))
    ret = quiz_view_released_marks(token, course_id)
    return {
        "released": ret["released"]
    }
    
@APP.route("/quiz_get_questions", methods=['GET'])
def server_quiz_get_questions():
    token = str(request.args.get("token"))
    quiz_id = str(request.args.get("quiz_id"))
    course_id = str(request.args.get("course_id"))
    ret = quiz_get_questions(token, quiz_id, course_id)
    return {
        "questions": ret["questions"]
    }
    
@APP.route("/quiz_view_submission", methods=['GET'])
def server_quiz_view_submission():
    token = str(request.args.get("token"))
    quiz_id = str(request.args.get("quiz_id"))
    ret = quiz_view_submission(token, quiz_id)
    return {
        "submission": ret["submission"]
    }
    
@APP.route("/quiz_view_submissions_to_mark", methods=['GET'])
def server_quiz_view_submissions_to_mark():
    token = str(request.args.get("token"))
    quiz_id = str(request.args.get("quiz_id"))
    ret = quiz_view_submissions_to_mark(token, quiz_id)
    return {
        "submissions": ret["submissions"]
    }

@APP.route("/course/categories", methods=['GET'])
def server_get_categories():
    token = str(request.args.get("token"))
    course_id = str(request.args.get("course_id"))
    ret = get_categories(token, course_id)
    return {
        "categories": ret["categories"]
    }

    
@APP.route("/course/category/forums", methods=['GET'])
def server_get_forum_from_category():
    token = str(request.args.get("token"))
    course_id = str(request.args.get("course_id"))
    category = str(request.args.get("category"))
    ret = get_forum_from_category(token, course_id, category)
    return {
        "forums": ret["forums"]
    }

@APP.route("/course/forum_post", methods=["POST"])
def server_forum_post():
    data = request.get_json()
    ret = forum_post(data['token'], data['course_id'], data['title'], data['content'], data['date'], data['file'], data["file_name"], data['category'])
    return {
        "thread_id": ret["thread_id"]
    }

@APP.route("/course/forum_get_post", methods=["GET"])
def server_get_post():
    token = str(request.args.get("token"))
    course_id = str(request.args.get("course_id"))
    thread_id = str(request.args.get("thread_id"))
    ret = get_thread(token, course_id, thread_id)
    return {
        "thread": ret["thread"],
        "replies": ret["replies"]
    }

@APP.route("/course/forum_reply", methods=["POST"])
def server_reply():
    data = request.get_json()
    ret = reply(data['token'], data['course_id'], data['thread_id'], data['content'], data['date'], data['file'], data["file_name"])
    return {
        "reply_id": ret["reply_id"]
    }

@APP.route("/course/add_category", methods=["POST"])
def server_add_category():
    data = request.get_json()
    ret = add_category(data['token'], data['course_id'], data["category"])
    return {
        "category_id": ret["category_id"]
    }

@APP.route("/course/get_classes", methods=["GET"])
def server_get_classes():
    token = str(request.args.get("token"))
    course_id = str(request.args.get("course_id"))
    
    ret = backend_get_classes(token, course_id)
    return {
        "class_ids": ret["class_ids"]
    }

@APP.route("/course/create_class", methods=["POST"])
def server_create_class():
    data = request.get_json()
    ret = backend_create_class(data['token'], data['name'], data['course_id'], data['time'], data['description'], data['thumbnail'])

    return {
        "class_id": ret["class_id"]
    }

@APP.route("/course/insert_class", methods=["POST"])
def server_insert_class():
    data = request.get_json()
    ret = backend_insert_class(data['token'], data['course_id'], data['class_id'])
    
    return {
    }

@APP.route("/course/get_class_info", methods=["GET"])
def server_get_class_info():
    token = str(request.args.get("token"))
    course_id = str(request.args.get("course_id"))
    class_id = str(request.args.get("class_id"))
    
    ret = backend_get_class_info(token, course_id, class_id)
    
    return {
        "name": ret["class_info"]["name"],
        "time": ret["class_info"]["time"],
        "course_id": ret["class_info"]["course_id"],
        "description": ret["class_info"]["description"],
        "thumbnail": ret["class_thumbnail"],
    }

@APP.route("/course/get_user_classes", methods=["GET"])
def server_get_user_classes():
    token = str(request.args.get("token"))
    course_id = str(request.args.get("course_id"))
    
    ret = backend_get_user_classes(token, course_id)
    
    return {
        "class_ids": ret["class_ids"]
    }

@APP.route("/course/get_users_from_class", methods=["GET"])
def server_get_users_from_class():
    token = str(request.args.get("token"))
    course_id = str(request.args.get("course_id"))
    class_id = str(request.args.get("class_id"))
    
    ret = backend_get_users_from_class(token, course_id, class_id)
    
    return {
        "user_ids": ret["user_ids"]
    }

@APP.route("/course/check_in_class", methods=["GET"])
def server_check_in_class():
    token = str(request.args.get("token"))
    class_id = str(request.args.get("class_id"))
    
    ret = backend_check_in_class(token, class_id)
    
    return {
        "in_class": ret["in_class"]
    }

@APP.route("/file", methods=["GET"])
def server_get_file():
    token = str(request.args.get("token"))
    course_id = str(request.args.get("course_id"))
    file_id = str(request.args.get("file_id"))
    
    ret = backend_get_file(token, course_id, file_id)
    
    return {
        "file": ret["file_info"]["file"],
        "file_name": ret["file_info"]["name"],
        "uploader_id": ret["file_info"]["uploader_id"]
    }

@APP.route("/search_resources", methods=["GET"])
def server_search_resources():
    token = str(request.args.get("token"))
    search_term = str(request.args.get("search_term"))
    course_id = str(request.args.get("course_id"))
    ret = backend_search_resources(token, search_term, course_id)
    return {
        "resource_info": ret
    }

@APP.route("/update_user_name", methods=["PUT"])
def server_update_user_name():
    data = request.get_json()
    backend_update_user_name(data['token'], data['first_name'], data['last_name'])
    return {
    }

@APP.route("/update_user_email", methods=["PUT"])
def server_update_user_email():
    data = request.get_json()
    backend_update_user_email(data['token'], data['email'])
    return {
    }

@APP.route("/update_user_password", methods=["PUT"])
def server_update_user_password():
    data = request.get_json()
    backend_update_user_password(data['token'], data['password'])
    return {
    }

@APP.route("/profile_comment", methods=["POST"])
def server_comment_on_user_profile():
    data = request.get_json()
    backend_comment_on_user_profile(data['user_id'], data['content'], data['date'], data['commenter_token'])
    return {
    }

@APP.route("/profile_reply", methods=["POST"])
def server_reply_comment():
    data = request.get_json()
    backend_reply_comment(data['token'], data['content'], data['date'], data['comment_id'])
    return {
    }

@APP.route("/profile_all_comments", methods=["GET"])
def server_all_comments():
    """get all comments and replies of a user's profile

    Returns:
        "comments": [
            {
                "id",
                "user_id": profile owner id,
                "content",
                "date",
                "commenter_id": commenter id,
                "replies": [
                    {
                        "id",
                        "content",
                        "date",
                        "user_id": replyer id,
                        "comment_id"
                    }
                ]
            }
        ]
    """
    token = str(request.args.get("token"))
    viewed_id = str(request.args.get("viewed_id"))
    ret = backend_get_all_comments(token, viewed_id)
    return {
        "comments": ret
    }

@APP.route("/edit_user_comment", methods=["PUT"])
def server_edit_user_comment():
    data = request.get_json()
    backend_edit_comment(data['token'], data['content'], data['comment_id'])
    return {
    }

@APP.route("/delete_user_comment", methods=["DELETE"])
def server_delete_user_comment():
    data = request.get_json()
    backend_delete_comment(data['token'], data['comment_id'])
    return {
    }

@APP.route("/edit_user_reply", methods=["PUT"])
def server_edit_user_reply():
    data = request.get_json()
    backend_edit_reply(data['token'], data['content'], data['reply_id'])
    return {
    }

@APP.route("/delete_user_reply", methods=["DELETE"])
def server_delete_user_reply():
    data = request.get_json()
    backend_delete_reply(data['token'], data['reply_id'])
    return {
    }

@APP.route("/profile_comment_info", methods=["GET"])
def server_profile_comment_info():
    """
    Returns:
        "comment_info": {
                "id",
                "user_id",
                "content",
                "date",
                "commenter_id",
            }
    """
    
    token = str(request.args.get("token"))
    comment_id = str(request.args.get("comment_id"))
    ret = backend_profile_comment_info(token, comment_id)
    return {
        "comment_info": ret
    }

@APP.route("/profile_reply_info", methods=["GET"])
def server_profile_reply_info():
    """
    Returns:
        "reply_info": {
                "id",
                "content",
                "date",
                "user_id",
                "commenter_id",
            }
    """
    
    token = str(request.args.get("token"))
    reply_id = str(request.args.get("reply_id"))
    ret = backend_profile_reply_info(token, reply_id)
    return {
        "reply_info": ret
    }

@APP.route("/profile_owner_post", methods=["POST"])
def server_profile_owner_post():
    data = request.get_json()
    backend_user_create_post(data['token'], data['content'], data['date'], data['title'])
    return {
    }

@APP.route("/profile_owner_all_posts", methods=["GET"])
def server_profile_owner_all_posts():
    """get all posts of a user's profile

    Returns:
        "posts": [
            {
                "id",
                "user_id": profile owner id,
                "content",
                "date",
                "title",
            }
        ]
    """
    token = str(request.args.get("token"))
    viewed_id = str(request.args.get("viewed_id"))
    ret = backend_user_all_posts(token, viewed_id)
    return {
        "posts": ret
    }

@APP.route("/edit_user_post", methods=["PUT"])
def server_edit_user_post():
    data = request.get_json()
    edit_user_post(data['token'], data['post_id'], data['content'])
    return {
    }

@APP.route("/profile_generate_avatar", methods=["POST"])
def server_profile_generate_avatar():
    data = request.get_json()
    encoded_img = generate_avatar(data['options'])
    return {
        'avatar': encoded_img
    }

@APP.route("/profile_set_avatar", methods=["POST"])
def server_profile_set_avatar():
    data = request.get_json()
    set_avatar(data['token'], data['avatar_base64'])
    return {
    }

@APP.route("/quiz/edit_points", methods=["PUT"])
def server_edit_quiz_points():
    """updates points value for given quiz
    Args:
        token/user_id
        quiz_id (text)
        quiz_points (text)

    Returns:
        quiz_points (text)
    """
    data = request.get_json()
    ret = edit_quiz_points_value(data["token"], data["quiz_id"], data["quiz_points"])
    return {
        "quiz_points": ret["quiz_points"]
    }
    
@APP.route("/assignment/edit_points", methods=["PUT"])
def server_edit_assignment_points():
    """
    updates points value for given assignment
    Args:
        token/user_id
        assignment_id (text)
        assignment_points (text)

    Returns:
        assignment_points (text)
    """
    data = request.get_json()
    ret = edit_assignment_points_value(data["token"], data["assignment_id"], data["assignment_points"])
    return {
        "assignment_points": ret["assignment_points"]
    }
    
@APP.route("/game/get_shop", methods=["GET"])
def server_get_shop():
    """
    return item shop for given course
    Args:
        token/user_id
        course_id (text)

    Returns:
        items (list)
        - each item consists of:
                - item_id (text)
                - course_id (text)
                - item_file (base64 string)
                - item_name (text)
                - item_desc (text)
                - cost (int)
    """
    token = str(request.args.get("token"))
    course_id = str(request.args.get("course_id"))
    ret = get_shop(token, course_id)
    return {
        "items": ret["items"]
    }
    
@APP.route("/game/insert_item_into_shop", methods=["POST"])
def server_insert_item_into_shop():
    """
    teacher inserts item in shop
    Args:
        token/user_id
        course_id (text)
        item_file (base64 string)
        item_name (text)
        item_desc (text)
        cost (int)

    Returns:
        items (list of "item_id")
    """
    data = request.get_json()
    ret = insert_item_into_shop(data["token"], data["course_id"], data["item_file"], data["item_name"], data["item_desc"], data["cost"])
    return {
        "item_id": ret["item_id"]
    }
    
@APP.route("/game/redeem_item_from_shop", methods=["POST", "PUT"])
def server_redeem_item_from_shop():
    # POST for redeeming item and storing it into student_inventory
    # PUT for updating student points balance

    # note: when running this route, must call twice, once
    # for POST method, once for PUT method (one for putting item
    # in student inventory, one for updating points balance)

    # POST must run FIRST, then PUT method

    """
    Args:
        token/user_id
        course_id (text)
        item_id (text)

    Returns:
        if POST:
            - item_id (text)
        if PUT:
            - old_balance (int)
            - new_balance (int)
    """
    data = request.get_json()
    if request.method == 'POST':
        ret = redeem_item_from_shop__get_item(data["token"], data["course_id"], data["item_id"])
        return {
            "item_id": ret["item_id"]
        }
    else:
        ret = redeem_item_from_shop__use_points(data["token"], data["course_id"], data["item_id"])
        return {
            "old_balance": ret["old_balance"],
            "new_balance": ret["new_balance"]
        }
    
@APP.route("/game/student_redeemed_items", methods=["GET"])
def server_get_student_items_redeemed():
    """
    returns list of items redeemed by student
    Args:
        token/user_id
        course_id (text)

    Returns:
        items_ids (list of "item_id")
    """
    token = str(request.args.get("token"))
    course_id = str(request.args.get("course_id"))
    ret = get_student_items_redeemed(token, course_id)
    return ret
    
@APP.route("/game/get_item", methods=["GET"])
def server_get_item_from_shop():
    token = str(request.args.get("token"))
    item_id = str(request.args.get("item_id"))
    ret = get_item(token, item_id)
    return {
        "item_id": ret["item_id"],
        "course_id": ret["course_id"],
        "item_file": ret["item_file"],
        "item_desc": ret["item_desc"],
        "cost": ret["cost"]
    }
    
@APP.route("/game/rank_students", methods=["GET"])
def server_rank_students_by_points():
    token = str(request.args.get("token"))
    course_id = str(request.args.get("course_id"))
    ret = rank_student_by_points(token, course_id)
    return {
        "rankings": ret["rankings"]
    }
    
@APP.route("/game/share_points", methods=["PUT"])
def server_share_points():
    data = request.get_json()
    ret = share_points(data["token"], data["reciever_id"], data["course_id"], data["points"])
    return {
        "donator_id": ret["donator_id"],
        "donator_old_balance": ret["donator_old_balance"],
        "donator_new_balance": ret["donator_new_balance"],
        "reciever_id": ret["reciever_id"],
        "reciever_old_balance": ret["reciever_old_balance"],
        "reciever_new_balance": ret["reciever_new_balance"]
    }
    
@APP.route("/game/student_wishlisted_items", methods=["GET"])
def server_get_student_wishlisted_items():
    token = str(request.args.get("token"))
    course_id = str(request.args.get("course_id"))
    ret = get_student_wishlisted_items(token, course_id)
    return {
        "items": ret["items"]
    }
    
@APP.route("/game/wishlist_item", methods=["POST"])
def server_wishlist_item():
    data = request.get_json()
    ret = wishlist_item(data["token"], data["course_id"], data["item_id"])
    return {}

@APP.route("/game/missions_page", methods=["GET"])
def server_get_all_missions_from_course():
    token = str(request.args.get("token"))
    course_id = str(request.args.get("course_id"))
    ret = get_all_missions_from_course(token, course_id)
    return {
        "missions": ret["missions"]
    }
    
@APP.route("/game/create_mission", methods=["POST"])
def server_create_mission_for_course():
    data = request.get_json()
    ret = create_mission_for_course(data["token"], data["mission_title"], data["mission_type"], data["points"], data["condition"], data["course_id"])
    return {}

@APP.route("/game/get_wheel", methods=["GET"])
def server_get_wheel():
    token = str(request.args.get("token"))
    course_id = str(request.args.get("course_id"))
    ret = get_wheel(token, course_id)
    return {
        "items": ret["items"],
        "cost": ret["cost"],
    }
    
@APP.route("/game/spin_wheel", methods=["POST"])
def server_spin_wheel():
    data = request.get_json()
    ret = spin_wheel(data["token"], data["course_id"])
    return {
        "item_id": ret["item_id"],
        "course_id": ret["course_id"],
        "item_file": ret["item_file"],
        "item_name": ret["item_name"],
        "item_desc": ret["item_desc"]
    }
    
@APP.route("/game/guess_quiz_mark", methods=["PUT"])
def server_guess_quiz_mark():
    data = request.get_json()
    ret = guess_quiz_mark(data["token"], data["course_id"], data["quiz_id"], data["guess"])
    return {
       "correct_guess": ret["correct_guess"]
    }
    
@APP.route("/game/guess_assignment_mark", methods=["PUT"])
def server_guess_assignment_mark():
    data = request.get_json()
    ret = guess_assignment_mark(data["token"], data["course_id"], data["submission_id"], data["guess"])
    return {
       "correct_guess": ret["correct_guess"]
    }
    
@APP.route("/game/change_spin_cost", methods=["PUT"])
def server_change_spin_cost():
    data = request.get_json()
    ret = change_spin_cost(data["token"], data["course_id"], data["cost"])
    return {}

@APP.route("/game/change_guess_cost", methods=["PUT"])
def server_change_guess_cost():
    data = request.get_json()
    ret = change_guess_cost(data["token"], data["course_id"], data["cost"])
    return {}

@APP.route("/course/release_assignment_marks", methods=["PUT"])
def server_course_release_assignment_marks():
    data = request.get_json()
    release_assignment_marks(data["token"], data["assignment_id"])
    return {}

@APP.route("/game/student_points", methods=["GET"])
def server_get_student_points():
    token = str(request.args.get("token"))
    course_id = str(request.args.get("course_id"))
    ret = get_student_points(token, course_id)
    return {
        "points_balance": ret
    }

@APP.route("/course/start_live_class", methods=["POST"])
def server_start_live_class():
    data = request.get_json()
    ret = create_live_class(data["token"], data["course_id"], data["class_id"])
    return {
        "meeting_id": ret["meeting_id"]
    }

@APP.route("/course/live_class_in_progress", methods=['GET'])
def server_live_class_in_progress():
    ret = check_meeting_in_progress(request.args.get("token"), request.args.get("course_id"), request.args.get("class_id"))
    return {
        "meeting_active": ret["meeting_active"]
    }

@APP.route("/course/get_live_class_start_link", methods=['GET'])
def server_live_class_start_link():
    ret = get_meeting_start_link(request.args.get("token"), request.args.get("course_id"), request.args.get("class_id"))
    return {
        "start_link": ret["start_url"]
    }

@APP.route("/course/get_live_class_join_link", methods=['GET'])
def server_live_class_join_link():
    ret = get_meeting_join_link(request.args.get("token"), request.args.get("course_id"), request.args.get("class_id"))
    return {
        "join_link": ret["join_url"]
    }
    
@APP.route("/game/get_guess_cost", methods=["GET"])
def server_get_guess_cost():
    token = str(request.args.get("token"))
    course_id = str(request.args.get("course_id"))
    ret = get_game_guess_cost(token, course_id)
    return {
        "guess_cost": ret
    }

@APP.route("/recordings", methods=["GET"])
def server_get_recordings():
    token = str(request.args.get("token"))
    course_id = str(request.args.get("course_id"))
    class_id = str(request.args.get("class_id"))
    ret = backend_get_recordings(token, course_id, class_id)
    return {
        "recordings": ret["recordings"]
    }

@APP.route("/publish_recording", methods=["POST"])
def server_publish_recording():
    data = request.get_json()
    backend_publish_recording(data["token"], data["course_id"], data["class_id"], data["title"], data["description"], data["link"], data['chat_log'])
    return {
    }

if __name__ == "__main__":
    APP.run(debug=True, port=config.port)