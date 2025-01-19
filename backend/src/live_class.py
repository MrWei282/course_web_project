import requests
import base64
from datetime import datetime, timedelta, timezone
from src.error import InputError, AccessError
from src.auth import check_validity
from db.funcs.db_course import check_in_course_enrolled, is_staff_in_course
from db.funcs.db_class import get_class_info

account_id = 'y4UdQLZsScKlavsB9OJf5g'
client_id = 'VEyw3EuXTTaWzub0NUP9A'
client_secret = '0mARF0TDuLHHqUiNPq4Z2AEHOymy96ji'
base_url = 'https://api.zoom.us/v2'

####################
# Helper Functions #
####################

def get_access_token():
    # encode client_id and client_secret
    credentials = client_id + ':' + client_secret
    encoded_credentials = base64.b64encode(credentials.encode()).decode('utf-8')

    data = {
        'grant_type': 'account_credentials',
        'account_id': account_id,
    }

    headers = {
        'Host': 'zoom.us',
        'Authorization': 'Basic ' + encoded_credentials,
    }

    try:
        response = requests.post(
            'https://zoom.us/oauth/token',
            data = data,
            headers = headers
        )
        data = response.json()
        return data.get('access_token')

    except requests.exceptions.RequestException as e:
        print("Error while generating token: " + str(e))
        return None
    

def create_meeting(topic):
    start_time = (datetime.utcnow() + timedelta(hours=10)).strftime('%Y-%m-%dT%H:%M:%SZ')
    headers = {
        'Authorization': 'Bearer ' + get_access_token(),
        'Content-Type': 'application/json'
    }
    json = {
        'topic': topic,
        'type': 1,  # instant meeting
        'start_time': start_time,
        'timezone': 'Australia/Sydney',
    }

    try:
        response = requests.post(
            base_url + '/users/me/meetings',
            json = json,
            headers = headers
        )

        data = response.json()
        return data.get('id')

    except requests.exceptions.RequestException as e:
        print("Error while starting meeting: " + str(e))
        return None
    
def get_meeting(meeting_id):
    headers = {
        'Authorization': 'Bearer ' + get_access_token()
    }

    try:
        response = requests.get(
            base_url + '/meetings/' + str(meeting_id),
            headers = headers
        )
        return response.json()

    except requests.exceptions.RequestException as e:
        print("Error while generating token: " + str(e))
        return None

def is_meeting_active(meeting_id):
    data = get_meeting(meeting_id)
    status = data.get('status')
    return status == 'waiting' or status == 'started'

###################
# Route Functions #
###################

# testing
meeting_id = None
auth = None

def create_live_class(token, course_id, class_id):
    # check user has correct permissions
    user_id = check_validity(token)
    if not is_staff_in_course(user_id, course_id):
        raise AccessError("Only lecturer or teachers in the class can create live class")
    
    # check if meeting already in progress
    # get meeting id from db
    global meeting_id

    if meeting_id != None and is_meeting_active(meeting_id):
        raise InputError("Live class already in session")
    
    meeting_id = create_meeting(get_class_info(class_id)['name'])
    # set meeting id in db

    return {
        "meeting_id": meeting_id
    }

def check_meeting_in_progress(token, course_id, class_id):
    # check user enrolled in course
    user_id = check_validity(token)
    if not (check_in_course_enrolled(user_id, course_id) or is_staff_in_course(user_id, course_id)):
        raise AccessError("Not enrolled in course")
    
    # get meeting id from db
    global meeting_id

    if meeting_id == None:
        return {
            "meeting_active": False
        }
    else:
        active = is_meeting_active(meeting_id)
        return {
            "meeting_active": active
        }

def get_meeting_start_link(token, course_id, class_id):
    # check user enrolled in course with correct permissions
    user_id = check_validity(token)
    if not is_staff_in_course(user_id, course_id):
        raise AccessError("Only lecturer or teachers in the class can start live class")
    
    # get meeting id from db
    global meeting_id   

    if meeting_id == None and not is_meeting_active(meeting_id):
        raise InputError("Live class not started")
    else:
        data = get_meeting(meeting_id)
        start_url = data.get('start_url')
        return {
            "start_url": start_url
        }

def get_meeting_join_link(token, course_id, class_id):
    # check user enrolled in course
    user_id = check_validity(token)
    if not (check_in_course_enrolled(user_id, course_id) or is_staff_in_course(user_id, course_id)):
        raise AccessError("Not enrolled in course")
    
    # get meeting id from db
    global meeting_id   

    if meeting_id == None and not is_meeting_active(meeting_id):
        raise InputError("Live class not started")
    else:
        data = get_meeting(meeting_id)
        join_url = data.get('join_url')
        return {
            "join_url": join_url
        }
