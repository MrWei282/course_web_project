INSERT_FILE = "INSERT INTO Files (file, name, uploader_id) VALUES (%s, %s, %s) returning id;"

INSERT_RESOURCE = "INSERT INTO Resources (category, description, file_id, class_id) VALUES (%s, %s, %s, %s) returning id;"

INSERT_RESOURCE_COURSE = "INSERT INTO Course_Resources (Course_id, resource_id) VALUES (%s, %s);"

GET_RESOURCE = "SELECT category, description, file_id, class_id FROM resources WHERE id = %s"

GET_FILE = "SELECT file, name, uploader_id FROM files WHERE id = %s;"

GET_RESOURCES_IN_COURSE = """
    SELECT resources.id FROM resources
    JOIN Course_Resources ON Course_Resources.resource_id = resources.id
    WHERE Course_Resources.course_id = %s AND resources.class_id = %s
"""