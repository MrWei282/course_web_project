UPDATE_USER_NAME = """
    UPDATE users
    SET firstname = %s, lastname = %s
    WHERE id = %s;
"""

UPDATE_USER_EMAIL = """
    UPDATE users
    SET email = %s
    WHERE id = %s;
"""

UPDATE_USER_PASSWORD = """
    UPDATE users
    SET password = %s
    WHERE id = %s;
"""

SET_USER_THUMBNAIL = """
    UPDATE users
    SET thumbnail = %s
    WHERE id = %s;
"""

CREATE_COMMENT_ON_USER_PROFILE = "INSERT INTO user_comments (user_id, content, date, commenter_id) VALUES (%s, %s, %s, %s) RETURNING id"

RETURN_COMMENT_ID = "SELECT id FROM user_comments WHERE user_id = %s AND date = %s AND commenter_id = %s"

GET_COMMENT_INFO_FROM_ID = "SELECT * FROM user_comments WHERE id = %s"

EDIT_POST_GIVEN_COMMENT_ID = "UPDATE user_comments SET content = %s WHERE id = %s"

DELETE_POST = "DELETE FROM user_comments WHERE id = %s"

REPLY_TO_COMMENT = "INSERT INTO User_Replies (content, date, user_id, comment_id) VALUES (%s, %s, %s, %s) RETURNING id"

RETURN_REPLY_ID = "SELECT id FROM User_Replies WHERE user_id = %s AND date = %s AND comment_id = %s"

DELETE_REPLY = "DELETE FROM User_Replies WHERE id = %s"

GET_REPLY_INFO_FROM_ID = "SELECT * FROM User_Replies WHERE id = %s"

EDIT_REPLY_GIVEN_REPLY_ID = "UPDATE User_Replies SET content = %s WHERE id = %s"

DELETE_ALL_REPLIES = "DELETE FROM User_Replies WHERE comment_id = %s"

GET_ALL_COMMENTS_ON_USER_PROFILE = "SELECT id FROM user_comments WHERE user_id = %s"

GET_ALL_REPLIES_TO_COMMENT = "SELECT id FROM User_Replies WHERE comment_id = %s"

GET_USER_AVATAR = "SELECT thumbnail FROM users WHERE id = %s"

CREATE_POST = "INSERT INTO user_posts (user_id, content, date, title) VALUES (%s, %s, %s, %s) RETURNING id"

GET_ALL_POSTS_FROM_USER_PROFILE = "SELECT id FROM user_posts WHERE user_id = %s"

GET_POST_INFO_FROM_ID = "SELECT * FROM user_posts WHERE id = %s"

EDIT_POST_GIVEN_POST_ID = "UPDATE user_posts SET content = %s WHERE id = %s"

INSERT_BADGE = "INSERT INTO Badges (badge) VALUES (%s)"

GET_BADGE_ID = "SELECT id FROM Badges WHERE badge LIKE %s"

INSERT_BADGE_INTO_USER = "INSERT INTO User_Badges (user_id, badge_id) VALUES (%s, %s)"

GET_USER_BADGES = "SELECT badge_id FROM User_Badges WHERE user_id = %s"

GET_BADGE_INFO = "SELECT badge FROM Badges WHERE id = %s"