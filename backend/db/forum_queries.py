CREATE_THREAD = "INSERT INTO Threads (title, content, date, user_id, file_id, course_id) VALUES (%s, %s, %s, %s, %s, %s) RETURNING id"

CREATE_REPLY = "INSERT INTO Replies (content, date, user_id, thread_id, file_id) VALUES (%s, %s, %s, %s, %s) RETURNING id"

CREATE_CATEGORY = "INSERT INTO Categories (name, course_id) VALUES (%s, %s) RETURNING id"

GET_THREAD_INFO = "SELECT * FROM Threads WHERE id = %s"

GET_ALL_REPLIES_FROM_THREAD = "SELECT id FROM Replies WHERE thread_id = %s"

GET_REPLY_INFO = "SELECT * FROM Replies WHERE id = %s"

GET_ALL_THREADS_FROM_CATEGORY = """
    SELECT Thread_Categories.thread_id FROM Thread_Categories 
    JOIN Categories ON Thread_Categories.category_id = Categories.id
    WHERE Categories.name = %s
"""

GET_ALL_THREADS_FROM_COURSE = "SELECT id FROM Threads WHERE course_id = %s"

GET_ALL_CATEGORIES_FROM_COURSE = "SELECT DISTINCT name FROM Categories WHERE course_id = %s"

LINK_CATEGORY_TO_THREAD = "INSERT INTO Thread_Categories (thread_id, category_id) VALUES (%s, %s)"

GET_ID_FROM_NAME = "SELECT id FROM Categories WHERE name LIKE %s AND course_id = %s"