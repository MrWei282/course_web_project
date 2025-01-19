UPDATE_QUIZ_POINTS = "UPDATE Quiz SET quiz_points = %s WHERE id = %s;"

UPDATE_ASSIGNMENT_POINTS = "UPDATE Assignments SET assignment_points = %s WHERE id = %s;"

GET_QUIZ_POINTS = "SELECT quiz_points FROM Quiz WHERE id = %s;"

GET_ASSIGNMENT_POINTS = "SELECT assignment_points FROM Assignments WHERE id = %s;"

UPDATE_STUDENT_POINTS_BALANCE = "UPDATE Course_Students SET points_balance = %s WHERE student_id = %s AND course_id = %s;"

GET_STUDENT_POINTS_BALANCE = "SELECT points_balance FROM Course_Students WHERE student_id = %s AND course_id = %s;"

ADD_ITEM_TO_SHOP = "INSERT INTO course_shop (course_id, item_file, item_name, item_desc, cost) VALUES (%s, %s, %s, %s, %s) RETURNING id;"

ADD_ITEM_INTO_STUDENT_INVENTORY = "INSERT INTO student_course_inventory (student_id, course_id, item_id) VALUES (%s, %s, %s);"

WISHLIST_ITEM = "INSERT INTO student_wishlist (student_id, course_id, item_id, is_bought) VALUES (%s, %s, %s, false);"

CREATE_MISSION = "INSERT INTO missions (mission_title, mission_content, mission_type, points, condition, course_id) VALUES (%s, %s, %s, %s, %s, %s) RETURNING id;"

CREATE_MISSION_TRACKER = "INSERT INTO mission_tracker (mission_id, student_id, counter, is_achieved) VALUES (%s, %s, 0, false);"

GET_ALL_WISHLISTED_ITEMS = "SELECT item_id FROM student_wishlist WHERE student_id = %s AND course_id = %s;"

GET_ALL_WISHLISTED_ITEMS_NOT_BOUGHT = "SELECT item_id FROM student_wishlist WHERE student_id = %s AND course_id = %s and is_bought = false;"

GET_ALL_OWNED_ITEMS = "SELECT item_id FROM student_course_inventory WHERE student_id = %s AND course_id = %s;"

GET_ALL_ITEMS_IN_COURSE_SHOP = "SELECT id FROM course_shop WHERE course_id = %s;"

GET_ITEM_INFO = "SELECT * FROM course_shop WHERE id = %s;"

GET_MISSION_INFO = "SELECT * FROM missions WHERE id = %s;"

CHECK_USER_IN_MISSION = "SELECT student_id FROM mission_tracker WHERE student_id = %s;"

UPDATE_MISSION_COUNTER = "UPDATE mission_tracker SET counter = %s WHERE mission_id = %s AND student_id = %s;"

GET_MISSION_TRACKER_INFO = "SELECT * FROM mission_tracker WHERE mission_id = %s AND student_id = %s;"

RANK_STUDENTS_BY_POINTS = "SELECT student_id, points_balance FROM Course_Students WHERE Course_id = %s ORDER BY points_balance DESC;"

UPDATE_MISSION_ACHIEVED = "UPDATE mission_tracker set is_achieved = true WHERE mission_id = %s AND student_id = %s;"

INSERT_COSTS = "INSERT INTO cost (course_id, spin_cost, guess_cost) VALUES (%s, 100, 100);"

UPDATE_SPIN_COST = "UPDATE cost SET spin_cost = %s WHERE course_id = %s;"

UPDATE_GUESS_COST = "UPDATE cost SET guess_cost = %s WHERE course_id = %s;"

GET_SPIN_COST = "SELECT spin_cost FROM cost WHERE course_id = %s;"

GET_GUESS_COST = "SELECT guess_cost FROM cost WHERE course_id = %s;"

GET_COURSE_MISSIONS = "SELECT id FROM missions WHERE course_id = %s;"

GET_MISSION_BY_TYPE = "SELECT id FROM missions WHERE course_id = %s AND mission_type = %s;"

SET_VIEWED_QUIZ = "UPDATE quiz_submissions SET is_viewed = True WHERE id = %s"

SET_VIEWED_ASS = "UPDATE submissions SET is_viewed = True WHERE id = %s"

UPDATE_BOUGHT_WISHLIST_ITEM = "UPDATE student_wishlist SET is_bought = true WHERE student_id = %s and course_id = %s and item_id = %s"

CHECK_ITEM_WISHLISTED = "SELECT * from student_wishlist WHERE student_id = %s and course_id = %s and item_id = %s"