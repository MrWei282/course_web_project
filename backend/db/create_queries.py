CREATE_USERS_TABLE = """
    CREATE TABLE IF NOT EXISTS users (
        id          SERIAL  PRIMARY KEY,
        firstname   text    NOT NULL,
        lastname    text    NOT NULL,
        password    text    NOT NULL,
        email       text    NOT NULL,
        role        text    NOT NULL,
        thumbnail   text,
        CONSTRAINT role_check CHECK (role in ('admin', 'lecturer', 'teacher', 'student'))
    );
"""

CREATE_USERS_COMMENTS_TABLE = """
    CREATE TABLE IF NOT EXISTS user_comments (
        id              SERIAL      PRIMARY KEY,
        user_id         integer,
        content         text,
        date            timestamp,
        commenter_id    integer,
        FOREIGN KEY(user_id) REFERENCES users(id),
        FOREIGN KEY(commenter_id) REFERENCES users(id)
    );
"""

CREATE_USER_REPLIES_TABLE = """
    CREATE TABLE IF NOT EXISTS User_Replies (
        id          SERIAL      PRIMARY KEY,
        content     text,
        date        timestamp,
        user_id     integer,
        comment_id  integer,
        FOREIGN KEY(user_id) REFERENCES users(id),
        FOREIGN KEY(comment_id) REFERENCES user_comments(id)
    )
"""

CREATE_USERS_PROFILE_TABLE = """
    CREATE TABLE IF NOT EXISTS user_posts (
        id              SERIAL      PRIMARY KEY,
        user_id         integer,
        content         text,
        date            timestamp,
        title           text,
        FOREIGN KEY(user_id) REFERENCES users(id)
    );
"""

CREATE_TOKENS_TABLE = """
    CREATE TABLE IF NOT EXISTS tokens (
        token   text    PRIMARY KEY,
        user_id integer,
        FOREIGN KEY(user_id) REFERENCES users(id)
    );
"""

CREATE_COURSES_TABLE = """ 
    CREATE TABLE IF NOT EXISTS Courses (
        id          SERIAL      PRIMARY KEY,
        name        text        NOT NULL,
        term        text        NOT NULL,
        thumbnail   text,
        requirement text,
        description text
    );
"""

CREATE_COURSES_STAFF_TABLE = """
    CREATE TABLE IF NOT EXISTS Course_staff (
        Course_id   integer,
        lecturer_id integer,
        FOREIGN KEY(Course_id) REFERENCES courses(id),
        FOREIGN KEY(lecturer_id) REFERENCES users(id),
        PRIMARY KEY (Course_id, lecturer_id)
    );
"""

CREATE_COURSES_STUDENT_TABLE = """
    CREATE TABLE IF NOT EXISTS Course_Students (
        Course_id       integer,
        student_id      integer,
        enrolment       boolean     NOT NULL,
        grade           integer,
        points_balance  integer,
        FOREIGN KEY(Course_id) REFERENCES courses(id),
        FOREIGN KEY(student_id) REFERENCES users(id),
        PRIMARY KEY (Course_id, student_id)
    );
"""

CREATE_FILES_TABLE = """
    CREATE TABLE IF NOT EXISTS Files (
        id              SERIAL  PRIMARY KEY,
        file            text,
        name            text,
        uploader_id     integer,
        FOREIGN KEY(uploader_id) REFERENCES users(id)
    );
"""
CREATE_RESOURCES_TABLE = """
    CREATE TABLE IF NOT EXISTS Resources (
        id          SERIAL  PRIMARY KEY,
        category    text,
        description text,
        file_id     integer,
        class_id    integer,
        FOREIGN KEY(file_id) REFERENCES files(id),
        FOREIGN KEY(class_id) REFERENCES classes(id)
    );
"""

CREATE_COURSE_RESOURCES_TABLE = """
    CREATE TABLE IF NOT EXISTS Course_Resources (
        Course_id   integer,
        resource_id  integer,
        FOREIGN KEY(Course_id) REFERENCES courses(id),
        FOREIGN KEY(resource_id) REFERENCES resources(id),
        PRIMARY KEY (Course_id, resource_id)
    );
"""

CREATE_CLASSES_TABLE = """
    CREATE TABLE IF NOT EXISTS Classes (
        id          SERIAL      PRIMARY KEY,
        name        text        NOT NULL,
        time        timestamp,
        course_id   integer,
        thumbnail   text,
        description text,
        FOREIGN KEY(course_id) REFERENCES courses(id)
    );
"""

CREATE_CLASS_USERS_TABLE = """
    CREATE TABLE IF NOT EXISTS Class_users (
        class_id    integer,
        user_id     integer,
        FOREIGN KEY(user_id) REFERENCES users(id),
        FOREIGN KEY(class_id) REFERENCES classes(id),
        PRIMARY KEY (class_id, user_id)
    );
"""

CREATE_ASSIGNMENTS_TABLE = """
    CREATE TABLE IF NOT EXISTS Assignments (
        id                  SERIAL      PRIMARY KEY,
        course_id           integer     NOT NULL,
        due_date            text        NOT NULL,
        grade               integer,
        description         text,
        percentage          integer,
        file_id             integer,
        class_id            integer,
        assignment_points   integer,
        FOREIGN KEY(course_id) REFERENCES courses(id),
        FOREIGN KEY(class_id) REFERENCES classes(id)
    );
"""

CREATE_ASSIGNMENTS_STUDENTS_TABLE = """
    CREATE TABLE IF NOT EXISTS Submissions (
        id          SERIAL      PRIMARY KEY,
        ass_id      integer,
        file_id     integer,
        student_id  integer,
        submit_time text,
        feedback    text,
        grade       integer,
        max_grade   integer,
        percentage  integer,
        is_marked   boolean,
        is_released boolean,
        is_viewed   boolean,
        FOREIGN KEY(ass_id) REFERENCES assignments(id),
        FOREIGN KEY(student_id) REFERENCES users(id),
        FOREIGN KEY(file_id) REFERENCES files(id)
    );
"""

CREATE_QUIZ_TABLE = """
    CREATE TABLE IF NOT EXISTS Quiz (
        id          SERIAL  PRIMARY KEY,
        title       text,
        course_id   integer,
        class_id    integer,
        creator_id  integer,
        create_time timestamp,
        deadline    timestamp,
        quiz_points integer,
        FOREIGN KEY(class_id) REFERENCES classes(id),
        FOREIGN KEY(course_id) REFERENCES courses(id),
        FOREIGN KEY(creator_id) REFERENCES users(id)
    );
"""

CREATE_QUIZ_QUESTIONS_TABLE = """
    CREATE TABLE IF NOT EXISTS Questions (
        id              SERIAL  PRIMARY KEY,
        quiz_id         integer,
        type            text,
        question        text,
        max_mark        integer,
        file_base64     text,
        choice_A        text,
        choice_B        text,
        choice_C        text,
        choice_D        text,
        correct_choice  text,
        FOREIGN KEY(quiz_id) REFERENCES quiz(id),
        CONSTRAINT type_check CHECK (type in ('multiple_choice', 'short_answer')),
        CONSTRAINT correct_choice_check CHECK (correct_choice in ('A', 'B', 'C', 'D'))
    );
"""

CREATE_QUIZ_SUBMISSIONS = """
    CREATE TABLE IF NOT EXISTS Quiz_Submissions (
        id          SERIAL      PRIMARY KEY,
        user_id     integer,
        quiz_id     integer,
        submit_time timestamp,
        is_marked   boolean,
        is_released boolean,
        total_mark  integer,
        max_total_mark integer,
        feedback    text,
        is_viewed   boolean,
        FOREIGN KEY(user_id) REFERENCES users(id),
        FOREIGN KEY(quiz_id) REFERENCES quiz(id)
    );
"""

CREATE_QUIZ_SUBMITTED_ANSWERS = """
    CREATE TABLE IF NOT EXISTS Quiz_Submitted_Answers (
        id                  SERIAL      PRIMARY KEY,
        question_id         integer,
        submission_id       integer,
        user_id             integer,
        submitted_answer    text,
        is_marked           boolean,
        FOREIGN KEY(user_id) REFERENCES users(id),
        FOREIGN KEY(submission_id) REFERENCES Quiz_Submissions(id),
        FOREIGN KEY(question_id) REFERENCES questions(id)
    );
"""

CREATE_QUIZ_MARKING = """
    CREATE TABLE IF NOT EXISTS Quiz_Marking (
        id                      SERIAL      PRIMARY KEY,    
        submission_id           integer,
        mark                    integer,
        max_mark                integer,
        feedback                text,
        FOREIGN KEY(submission_id) REFERENCES Quiz_Submissions(id)
    );
"""

CREATE_FORUM_CATEGORY = """
    CREATE TABLE IF NOT EXISTS Categories (
        id          SERIAL      PRIMARY KEY,
        name        text        UNIQUE,
        course_id   integer,
        FOREIGN KEY(course_id) REFERENCES courses(id)
    )
"""

CREATE_THREAD_CATEGORIES = """
    CREATE TABLE IF NOT EXISTS Thread_Categories (
        thread_id   integer,
        category_id integer,
        FOREIGN KEY(thread_id) REFERENCES Threads(id),
        FOREIGN KEY(category_id) REFERENCES categories(id),
        PRIMARY KEY (thread_id, category_id)
    )
"""

CREATE_FORUM_THREADS = """
    CREATE TABLE IF NOT EXISTS Threads (
        id          SERIAL      PRIMARY KEY,
        title       text,
        content     text,
        date        timestamp,
        user_id     integer,
        file_id     integer,
        course_id   integer,
        FOREIGN KEY(course_id) REFERENCES courses(id),
        FOREIGN KEY(user_id) REFERENCES users(id),
        FOREIGN KEY(file_id) REFERENCES files(id)
    )
"""

CREATE_FORUM_REPLIES = """
    CREATE TABLE IF NOT EXISTS Replies (
        id          SERIAL      PRIMARY KEY,
        content     text,
        date        timestamp,
        user_id     integer,
        thread_id   integer,
        file_id     integer,
        FOREIGN KEY(user_id) REFERENCES users(id),
        FOREIGN KEY(thread_id) REFERENCES Threads(id),
        FOREIGN KEY(file_id) REFERENCES files(id)
    )
"""

CREATE_LIVE_CLASS_TABLE = """
    CREATE TABLE IF NOT EXISTS Live_class (
        meeting_id  integer     PRIMARY KEY,
        start_time  timestamp,
        course_id   integer,
        class_id    integer,
        FOREIGN KEY(class_id) REFERENCES classes(id),
        FOREIGN KEY(course_id) REFERENCES courses(id)
    )
"""

CREATE_COURSE_SHOP_TABLE = """
    CREATE TABLE IF NOT EXISTS course_shop (
        id                  SERIAL      PRIMARY KEY,
        course_id           integer,
        item_file           text,
        item_name           text,
        item_desc           text,
        cost                integer,
        FOREIGN KEY(course_id) REFERENCES courses(id)
    )
"""

CREATE_STUDENT_COURSE_INVENTORY = """
    CREATE TABLE IF NOT EXISTS student_course_inventory (
        student_id          integer,
        course_id           integer,
        item_id             integer,
        FOREIGN KEY(Course_id) REFERENCES courses(id),
        FOREIGN KEY(student_id) REFERENCES users(id),
        FOREIGN KEY(item_id) REFERENCES course_shop(id),
        PRIMARY KEY (student_id, course_id, item_id)
    )
"""

CREATE_STUDENT_WISHLIST = """
    CREATE TABLE IF NOT EXISTS student_wishlist (
        student_id          integer,
        course_id           integer,
        item_id             integer,
        is_bought           boolean,
        FOREIGN KEY(Course_id) REFERENCES courses(id),
        FOREIGN KEY(student_id) REFERENCES users(id),
        FOREIGN KEY(item_id) REFERENCES course_shop(id),
        PRIMARY KEY (student_id, course_id, item_id)
    )
"""

CREATE_MISSION_TABLE = """
    CREATE TABLE IF NOT EXISTS missions (
        id                  SERIAL      PRIMARY KEY,
        mission_title       text,
        mission_content     text,
        mission_type        text,
        points              integer,
        condition           integer,
        course_id           integer,
        FOREIGN KEY(Course_id) REFERENCES courses(id),
        CONSTRAINT mission_type_check CHECK (mission_type in ('quiz', 'assignment', 'guess_mark', 'spin_wheel', 'shop'))
    )
"""

CREATE_MISSION_TRACKER_TABLE = """
    CREATE TABLE IF NOT EXISTS mission_tracker (
        mission_id          integer,
        student_id          integer,
        counter             integer,
        is_achieved         boolean,
        FOREIGN KEY(mission_id) REFERENCES missions(id),
        FOREIGN KEY(student_id) REFERENCES users(id),
        PRIMARY KEY (mission_id, student_id)
    )
"""

CREATE_COST_TABLE = """
    CREATE TABLE IF NOT EXISTS cost (
        course_id           integer,
        spin_cost           integer,
        guess_cost          integer,
        FOREIGN KEY(course_id) REFERENCES courses(id),
        PRIMARY KEY (course_id)
    )

"""

CREATE_BADGES_TABLE = """
    CREATE TABLE IF NOT EXISTS Badges (
        id              SERIAL      PRIMARY KEY,
        badge           text,
        CONSTRAINT badge_check CHECK (badge in ('assignment_badge', 'quiz_badge', 'mark_badge', 'wheel_badge', 'item_badge'))
    )
"""

CREATE_USER_BADGES_TABLE = """
    CREATE TABLE IF NOT EXISTS User_Badges (
        id                   SERIAL     PRIMARY KEY,
        user_id              integer,
        badge_id             integer,
        FOREIGN KEY(badge_id) REFERENCES badges(id),
        FOREIGN KEY(user_id) REFERENCES users(id)
    )
"""

CREATE_RECORDINGS_TABLE = """
    CREATE TABLE IF NOT EXISTS recordings (
        id          SERIAL      PRIMARY KEY,
        title       text,
        user_id     integer,
        description text,
        link        text, 
        course_id   integer,
        class_id    integer,
        chat_log    text,
        FOREIGN KEY(class_id) REFERENCES classes(id),
        FOREIGN KEY(user_id) REFERENCES users(id),
        FOREIGN KEY(Course_id) REFERENCES courses(id)
    )
"""
