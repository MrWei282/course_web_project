INSERT_CLASS = "INSERT INTO Classes (name, course_id, time, description, thumbnail) VALUES (%s, %s, %s, %s, %s) RETURNING id;"

ENROL_USER_INTO_CLASS = "INSERT INTO Class_users (class_id, user_id) VALUES (%s, %s);"

GET_USERS_FROM_CLASS = """
    SELECT Users.id FROM Classes
    JOIN Class_users ON Class_users.class_id = Classes.id
    JOIN Users ON Users.id = Class_users.user_id
    WHERE Classes.id = %s;
"""

GET_CLASS_INFO = "SELECT name, time, course_id, description FROM classes where id = %s"

GET_CLASS_THUMBNAIL = "SELECT thumbnail FROM classes where id = %s"

MATCH_USER_CLASS = """
    SELECT Classes.name, Users.id, Users.firstname, Users.lastname, Users.role FROM Classes
    JOIN Class_users ON Class_users.class_id = Classes.id
    JOIN Users ON Users.id = Class_users.user_id
    WHERE Classes.id = %s AND Users.id = %s;
"""

GET_USER_CLASS = """
    SELECT Classes.id FROM Classes
    JOIN Class_users ON Class_users.class_id = Classes.id
    JOIN Users ON Users.id = Class_users.user_id
    JOIN Courses ON Classes.course_id = Courses.id
    WHERE Users.id = %s AND Courses.id = %s;
"""