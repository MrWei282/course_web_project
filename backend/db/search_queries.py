SEARCH_RESOURCES = """
    SELECT resources.id, resources.category, resources.description, resources.file_id, resources.class_id FROM resources
    JOIN files ON resources.file_id = files.id
    JOIN Course_Resources ON resources.id = Course_Resources.resource_id
    WHERE files.name ~* %s AND Course_Resources.Course_id = %s;
"""
