STORE_MEETING_ID = "INSERT INTO Live_class (meeting_id, start_time, course_id, class_id) VALUES (%s, %s, %s, %s)"

GET_MEETING_ID = "SELECT meeting_id FROM Live_class WHERE course_id = %s AND class_id = %s"