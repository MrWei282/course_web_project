CREATE_RECORDING = "INSERT INTO recordings (title, user_id, description, link, course_id, class_id, chat_log) VALUES (%s, %s, %s, %s, %s, %s, %s) RETURNING id"

GET_ALL_RECORDINGS = "SELECT * FROM recordings WHERE course_id = %s AND class_id = %s" 

GET_ALL_RECORDINGS_COURSE = "SELECT * FROM recordings WHERE course_id = %s"
