import hashlib
import jwt

SECRET = 'verysecretsecretlol4529'

def hashing(string):
    return hashlib.sha256(string.encode()).hexdigest()
    
def generate_jwt(user_id, session_id):    
    return jwt.encode({'user_id': user_id, 'session_id': session_id}, SECRET, algorithm = 'HS256')
    
def decode_jwt(code):
    return jwt.decode(code, SECRET, algorithms = ['HS256'])

session_counter = 0

def incr_session_counter():
    global session_counter
    session_counter = session_counter + 1
    return session_counter

'''
def get_role(user_id):
    return get_user_info(user_id)["user_role"]
'''