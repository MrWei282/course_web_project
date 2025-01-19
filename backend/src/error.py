from werkzeug.exceptions import HTTPException

class AccessError(HTTPException):
    code = 403
    message = 'Nada'

class InputError(HTTPException):
    code = 400
    message = 'Nada'
