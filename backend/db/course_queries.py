INSERT_COURSE = "INSERT INTO Courses (name, term, requirement, description, thumbnail) VALUES (%s, %s, %s, %s, %s) RETURNING id;"

INSERT_STAFF = "INSERT INTO Course_Staff VALUES (%s, %s) RETURNING Course_id;"

INSERT_STU = "INSERT INTO Course_Students (Course_id, student_id, enrolment, points_balance) VALUES (%s, %s, false, 0) RETURNING Course_id;"

CHECK_ENROLLED_STU_IN_COURSE = """
    SELECT Courses.name, Users.firstname, Users.lastname, Users.role FROM Courses
    JOIN Course_Students ON Course_Students.Course_id = Courses.id
    JOIN Users ON Course_Students.student_id = Users.id
    WHERE Courses.id = %s AND Course_Students.enrolment = True AND Users.id = %s;
"""

CHECK_PENDING_ENROL_STU_IN_COURSE = """
    SELECT Courses.name, Users.id, Users.firstname, Users.lastname, Users.role FROM Courses
    JOIN Course_Students ON Course_Students.Course_id = Courses.id
    JOIN Users ON Course_Students.student_id = Users.id
    WHERE Users.id = %s AND Course_Students.enrolment = False AND Courses.id = %s;
"""

GET_STAFF_IN_COURSE = """
    SELECT Courses.name, Users.firstname, Users.lastname, Users.email, Users.role FROM Courses
    JOIN Course_Staff ON Course_Staff.Course_id = Courses.id
    JOIN Users ON Course_Staff.lecturer_id = Users.id
    WHERE Courses.id = %s;
"""

CHECK_STAFF_IN_COURSE = """
    SELECT Users.id FROM Courses
    JOIN Course_Staff ON Course_Staff.Course_id = Courses.id
    JOIN Users ON Course_Staff.lecturer_id = Users.id
    WHERE Courses.id = %s AND Users.id = %s;
"""

UPDATE_STU_ENROLMENT_TRUE = """
    UPDATE Course_Students
    SET enrolment = True
    WHERE course_id = %s AND student_id = %s;
"""

UPDATE_STU_COURSE_GRADE = """
    UPDATE Course_Students
    SET Course_Students.grade = %s
    WHERE course_id = %s AND student_id = %s;
"""

GET_STUDENT_COURSES_ENROLLED = """
    SELECT Courses.id, Courses.name FROM Courses
    JOIN Course_Students ON Course_Students.Course_id = Courses.id 
    JOIN Users ON Course_Students.student_id = Users.id
    WHERE Users.id = %s AND Course_Students.enrolment = True;
"""

GET_STUDENT_COURSES_PENDING = """
    SELECT Courses.id, Courses.name FROM Courses
    JOIN Course_Students ON Course_Students.Course_id = Courses.id 
    JOIN Users ON Course_Students.student_id = Users.id
    WHERE Users.id = %s AND Course_Students.enrolment = False;
"""

GET_STAFF_COURSES = """
    SELECT Courses.id, Courses.name FROM Courses
    JOIN Course_Staff ON Course_Staff.Course_id = Courses.id
    JOIN Users ON Course_Staff.lecturer_id = Users.id
    WHERE Users.id = %s;
"""

GET_COURSE_ID = "SELECT id FROM courses WHERE name LIKE %s;"

GET_COURSE = "SELECT name, term, requirement, description FROM courses WHERE id = %s"

GET_COURSE_THUMBNAIL = "SELECT thumbnail FROM courses WHERE id = %s"

GET_COURSE_STUDENTS = """
    SELECT Users.id FROM Courses
    JOIN Course_Students ON Course_Students.Course_id = Courses.id
    JOIN Users ON Course_Students.student_id = Users.id
    WHERE Courses.id = %s AND Course_Students.enrolment = True;
"""
GET_COURSE_PENDING = """
    SELECT Users.id FROM Courses
    JOIN Course_Students ON Course_Students.Course_id = Courses.id
    JOIN Users ON Course_Students.student_id = Users.id
    WHERE Courses.id = %s AND Course_Students.enrolment = False;
"""

GET_COURSE_STAFF = """
    SELECT Users.id FROM Courses
    JOIN Course_staff ON Course_staff.Course_id = Courses.id
    JOIN Users ON Course_staff.lecturer_id = Users.id
    WHERE Courses.id = %s
"""

GET_COURSE_ASSIGNMENTS = """
    SELECT Assignments.id FROM Assignments
    JOIN Courses on Courses.id = Assignments.course_id
    WHERE courses.id = %s
"""

GET_COURSE_RESOURCES = """
    SELECT Course_Resources.resource_id FROM Course_Resources
    JOIN Courses on Course_Resources.course_id = Courses.id
    WHERE courses.id = %s
"""

GET_COURSE_CLASSES = """
    SELECT Classes.id FROM Classes
    JOIN Courses on Courses.id = Classes.course_id
    WHERE courses.id = %s
"""

GET_EMAILS_FROM_COURSE = """
    SELECT email FROM Users
    JOIN Course_Students ON Course_Students.student_id = Users.id
    WHERE Course_Students.course_id = %s
"""

GET_EMAILS_FROM_COURSE_AND_CLASS = """
    SELECT email FROM Users
    JOIN Course_Students ON Course_Students.student_id = Users.id
    RIGHT JOIN Classes ON Classes.Course_id = Course_Students.course_id
    WHERE Course_Students.course_id = %s AND Classes.id = %s
"""

GET_STAFF_EMAILS_FROM_COURSE = """
    SELECT email FROM Users
    JOIN Course_staff ON Course_Staff.lecturer_id = Users.id
    WHERE Course_staff.course_id = %s
"""