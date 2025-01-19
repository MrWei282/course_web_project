GET_QUIZZES_IN_COURSE = """
    SELECT quiz.id FROM quiz
    WHERE quiz.course_id = %s;
"""

GET_QUIZZES_IN_CLASS_FROM_COURSE = """
    SELECT quiz.id FROM quiz
    WHERE quiz.course_id = %s AND quiz.class_id;
"""

GET_QUIZ_INFO = "SELECT title, course_id, class_id, creator_id, create_time, deadline, quiz_points FROM quiz WHERE id = %s;"

CREATE_QUIZ = "INSERT INTO quiz (title, course_id, class_id, creator_id, create_time, deadline, quiz_points) VALUES (%s, %s, %s, %s, %s, %s, %s) RETURNING id;"

CREATE_QUIZ_SHORT_ANSWER_QUESTIONS = "INSERT INTO questions (quiz_id, type, question, max_mark, file_base64) VALUES (%s, %s, %s, %s, %s) RETURNING id;"

CREATE_QUIZ_MULTIPLE_CHOICE_QUESTIONS = """
    INSERT INTO questions (quiz_id, type, question, max_mark, file_base64, choice_A, choice_B, choice_C, choice_D, correct_choice) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s) RETURNING id;
"""

SUBMIT_QUIZ_ANSWER = "INSERT INTO quiz_submitted_answers (question_id, submission_id, user_id, submitted_answer, is_marked) VALUES (%s, %s, %s, %s, false) RETURNING id;"

SUBMIT_QUIZ = "INSERT INTO quiz_submissions (user_id, quiz_id, is_marked, is_released, is_viewed) VALUES (%s, %s, false, false, false) RETURNING id;"

MARK_QUIZ = "INSERT INTO quiz_marking (submission_id, mark, max_mark, feedback) VALUES (%s, %s, %s, %s) RETURNING id;"

UPDATE_QUIZ_MARK_STATUS = """
    UPDATE quiz_submissions
    SET is_marked = True, total_mark = %s, max_total_mark = %s, feedback = %s
    WHERE user_id = %s AND quiz_id = %s;
"""

GET_QUIZ_SUBMISSIONS_INFO = """
    SELECT quiz_submissions.id, quiz_submissions.submit_time, quiz_submissions.is_marked, quiz_submissions.total_mark FROM quiz_submissions
    WHERE quiz_submissions.quiz_id = %s AND Quiz_Submissions.user_id = %s;
"""

GET_QUIZ_QUESTIONS = """
    SELECT id, type, question, max_mark, file_base64, choice_A, choice_B, choice_C, choice_D, correct_choice FROM questions
    WHERE quiz_id = %s;
"""

GET_USER_QUIZ_SUBMITTED_ANSWERS = """
    SELECT question_id, Quiz_Submitted_Answers.submission_id, submitted_answer FROM quiz_submitted_answers
    JOIN Quiz_Submissions ON Quiz_Submissions.id = Quiz_Submitted_Answers.submission_id
    WHERE Quiz_Submissions.quiz_id = %s AND Quiz_Submitted_Answers.user_id = %s;
"""

GET_QUESTION_INFO = "SELECT quiz_id, type, question, max_mark, file_base64, choice_A, choice_B, choice_C, choice_D FROM questions WHERE questions.id = %s"

CHECK_SUBMISSION_DATE = "SELECT submit_time FROM quiz_submissions WHERE quiz_submissions.user_id = %s AND quiz_submissions.quiz_id = %s;"

GET_MARKED_QUIZ = """
    SELECT quiz_submissions.id, quiz_submissions.user_id, quiz_submissions.submit_time, quiz_submissions.is_marked, quiz_submissions.total_mark FROM quiz_submissions
    WHERE Quiz_Submissions.user_id = %s AND Quiz_Submissions.is_marked = true;
"""

UPDATE_SUBMIT_TIME = """
    UPDATE quiz_submissions
    SET submit_time = %s
    WHERE id = %s;
"""

UPDATE_SUBMISSION_MARK_STATUS = """
    UPDATE quiz_submitted_answers
    SET is_marked = true
    WHERE id = %s;
"""

RELEASE_QUIZ = """
    UPDATE Quiz_Submissions
    SET is_released = true
    WHERE quiz_id = %s; 
"""

GET_RELEASED_QUIZZES = """
    SELECT * FROM quiz_submissions
    JOIN Quiz on quiz_submissions.quiz_id = quiz.id
    WHERE is_released = true and user_id = %s and course_id = %s;
"""

CHECK_ALREADY_SUBMITTED = """
    SELECT * FROM quiz_submissions
    WHERE user_id = %s and quiz_id = %s
"""

GET_QUIZ_SUBMISSIONS_ALL = """
    SELECT quiz_submissions.id, quiz_submissions.user_id, quiz_submissions.submit_time, quiz_submissions.is_marked, quiz_submissions.is_released ,quiz_submissions.total_mark, quiz_submissions.max_total_mark FROM quiz_submissions
    WHERE quiz_submissions.quiz_id = %s;
"""

UPDATE_QUIZ_SUBMISSION_VIEW = "UPDATE quiz_submissions SET is_viewed = True WHERE user_id = %s AND quiz_id = %s"

GET_QUIZ_SUBMISSION_VIEW_STATUS = "SELECT is_viewed FROM quiz_submissions WHERE user_id = %s AND quiz_id = %s" 

IS_QUIZ_SUBMISSION_VIEWED = "SELECT * from quiz_submissions WHERE user_id = %s and quiz_id = %s and is_viewed = True"