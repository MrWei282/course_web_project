INSERT_ASSIGNMENT = "INSERT INTO assignments (course_id, due_date, grade, description, percentage, file_id, class_id, assignment_points) VALUES (%s, %s, %s, %s, %s, %s, %s, %s) RETURNING id;"

GET_ASSIGNMENT_INFO = "SELECT course_id, due_date, grade, description, percentage, file_id, class_id, assignment_points FROM assignments WHERE id = %s;"

GET_SUBMISSIONS_FROM_ASSIGNMENTS = """
    SELECT Submissions.id FROM Submissions
    JOIN Assignments ON assignments.id = submissions.ass_id
    WHERE assignments.id = %s;
"""

INSERT_SUBMISSION = """
    INSERT INTO submissions (ass_id, file_id, student_id, submit_time, max_grade, percentage, is_marked, is_released, is_viewed) VALUES (%s, %s, %s, %s, %s, %s, false, false, false) returning id;
"""

UPDATE_SUBMISSION = """
    UPDATE submissions
    SET feedback = %s, grade = %s, is_marked = true
    WHERE id = %s;
"""

GET_SUBMISSION_INFO = "SELECT ass_id, file_id, student_id, submit_time, feedback, grade, max_grade, percentage, is_released, is_viewed FROM submissions WHERE id = %s;"

DOES_SUBMISSION_BELONG_TO_USER = """
    SELECT Submissions.id FROM Submissions
    WHERE student_id = %s and id = %s;
"""

GET_ASSIGNMENTS_IN_COURSE = """
    SELECT assignments.id FROM assignments
    WHERE assignments.course_id = %s AND assignments.class_id = %s
"""

UPDATE_ASSIGNMENT_STATUS_TO_RELEASED = """
    UPDATE submissions
    SET is_released = True
    WHERE ass_id = %s;
"""

CHECK_IS_RELEASED = """
    SELECT * FROM Submissions
    WHERE id = %s and is_released = True;
"""

CHECK_IS_VIEWED = """
    SELECT * FROM Submissions
    WHERE id = %s and is_viewed = True;
"""