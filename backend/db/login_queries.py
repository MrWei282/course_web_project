INSERT_USER = "INSERT INTO USERS (firstname, lastname, password, email, role) VALUES (%s, %s, %s, %s, %s) returning id;"

GET_USER = "SELECT id, firstname, lastname, password, email, role FROM Users WHERE id = %s;"

INSERT_TOKEN = "INSERT INTO TOKENS (token, user_id) VALUES (%s, %s);"

MATCH_EMAIL_PW = "SELECT id, firstname, lastname, email, password FROM Users WHERE email LIKE %s AND password LIKE %s;"

MATCH_EMAIL = "SELECT id, firstname, lastname, email FROM Users WHERE email = %s;"

MATCH_TOKEN = "SELECT token FROM Tokens WHERE token = %s;"

RESET_TOKENS_TABLE = "DELETE FROM tokens;"

DELETE_TOKEN = "DELETE from Tokens WHERE token = %s;"

VALIDATE_TOKEN = "SELECT user_id FROM Tokens WHERE token = %s;"