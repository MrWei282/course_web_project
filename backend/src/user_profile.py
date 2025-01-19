import psycopg2
from db.funcs.db_auth import *
from db.funcs.db_course import *
from db.funcs.db_class import *
from db.funcs.db_resource import *
from db.funcs.db_file import *
from db.funcs.db_forum import *
from db.funcs.db_user_profile import *
from src.notif import notif_profile_comment
from src.helpers import *
from src.error import InputError, AccessError
import py_avataaars as pa
import io
import base64

def backend_update_user_name(token, firstname, lastname):
    user_id = check_validity(token)
    update_user_name(firstname, lastname, user_id)
    return

def backend_update_user_email(token, email):
    user_id = check_validity(token)
    update_user_email(email, user_id)
    return

def backend_update_user_password(token, password):
    user_id = check_validity(token)
    update_user_password(hashing(password), user_id)
    return

def backend_comment_on_user_profile(user_id, content, date, commenter_token):
    commenter_id = check_validity(commenter_token)
    comment_on_user_profile(user_id, content, date, commenter_id)
    try:
        notif_profile_comment(get_user_info(user_id)["user_email"], get_user_info(commenter_id)["user_firstname"] + " " + get_user_info(commenter_id)["user_lastname"])
    except Exception as e:
        raise InputError(f"Failed to send email notification: {str(e)}")
    return

def backend_reply_comment(token, content, date, comment_id):
    user_id = check_validity(token)
    reply_to_comment(content, date, user_id, comment_id)
    return

def backend_get_all_comments(token, viewed_id):
    check_validity(token)
    all_comments = []
    for comment_id in get_all_comments_on_profile(viewed_id):
        comment_info = get_comment_info(comment_id)
        all_replies = []
        for reply_id in get_all_replies_for_comment(comment_id):
            reply_info = get_reply_info(reply_id)
            all_replies.append(reply_info)
        comment_info["replies"] = all_replies
        all_comments.append(comment_info)
    
    return all_comments

def backend_edit_comment(token, content, comment_id):
    user_id = check_validity(token)
    comment_info = get_comment_info(comment_id)
    if user_id == comment_info["commenter_id"]:
        edit_comment_given_comment_id(content, comment_id)
    else:
        raise AccessError("not author of the comment")
    return

def backend_delete_comment(token, comment_id):
    user_id = check_validity(token)
    comment_info = get_comment_info(comment_id)
    if user_id == comment_info["commenter_id"] or user_id == comment_info["user_id"]:
        delete_post_given_comment_id(comment_id)
    else:
        raise AccessError("not author of the comment or the profile owner")
    return

def backend_edit_reply(token, content, reply_id):
    user_id = check_validity(token)
    reply_info = get_reply_info(reply_id)
    if user_id == reply_info["user_id"]:
        edit_reply_given_reply_id(content, reply_id)
    else:
        raise AccessError("not author of the reply")
    return

def backend_delete_reply(token, reply_id):
    user_id = check_validity(token)
    reply_info = get_reply_info(reply_id)
    if user_id == reply_info["user_id"] or user_id == get_comment_info(reply_info["comment_id"])["user_id"]:
        delete_reply_given_reply_id(reply_id)
    else:
        raise AccessError("not author of the reply or the profile owner")
    return

def backend_profile_comment_info(token, comment_id):
    check_validity(token)
    comment_info = get_comment_info(comment_id)
    
    return comment_info

def backend_profile_reply_info(token, reply_id):
    check_validity(token)
    reply_info = get_reply_info(reply_id)
    
    return reply_info

def backend_user_create_post(token, content, date, title):
    user_id = check_validity(token)
    post_id = create_user_post(user_id, content, date, title)
    
    return post_id

def backend_user_all_posts(token, viewed_id):
    check_validity(token)
    all_posts = []
    for post_id in get_all_posts_from_profile(viewed_id):
        all_posts.append(get_post_info_from_id(post_id))
    
    return all_posts

def edit_user_post(token, post_id, content):
    user_id = check_validity(token)
    post_info = get_post_info_from_id(post_id)
    if user_id == post_info["user_id"]:
        edit_post_given_post_id(content, post_id)
    else:
        raise AccessError("not author of the post")
    return

def generate_avatar(options):
    # Generate the avatar with the provided options
    avatar = pa.PyAvataaar(
        style = eval('pa.AvatarStyle.%s' % options["style"]),
        skin_color = eval('pa.SkinColor.%s' % options["skin_color"]),
        top_type = eval('pa.TopType.SHORT_HAIR_SHORT_FLAT.%s' % options["top_type"]),
        hair_color = eval('pa.HairColor.%s' % options["hair_color"]),
        hat_color = eval('pa.Color.%s' % options["hat_color"]),
        facial_hair_type = eval('pa.FacialHairType.%s' % options["facial_hair_type"]),
        facial_hair_color = eval('pa.HairColor.%s' % options["facial_hair_color"]),
        mouth_type = eval('pa.MouthType.%s' % options["mouth_type"]),
        eye_type = eval('pa.EyesType.%s' % options["eye_type"]),
        eyebrow_type = eval('pa.EyebrowType.%s' % options["eyebrow_type"]),
        nose_type = pa.NoseType.DEFAULT,
        accessories_type = eval('pa.AccessoriesType.%s' % options["accessories_type"]),
        clothe_type = eval('pa.ClotheType.%s' % options["clothe_type"]),
        clothe_color = eval('pa.Color.%s' % options["clothe_color"]),
        clothe_graphic_type = eval('pa.ClotheGraphicType.%s' %options["clothe_graphic_type"]),
    )

    # Convert the avatar to a PNG image and encode it as a base64 string
    img_byte_arr = io.BytesIO()
    avatar.render_png_file(img_byte_arr)
    encoded_img = base64.b64encode(img_byte_arr.getvalue()).decode('utf-8')

    return encoded_img

def set_avatar(token, avatar_base64):
    user_id = check_validity(token)
    set_user_profile_avatar(avatar_base64, user_id)

    return

def get_avatar(user_id):
    avatar = get_user_avatar(user_id)

    return {
        "avatar": avatar
    }

def get_badges(user_id):
    badge_ids = get_user_badges(user_id)
    badges = []
    for badge in badge_ids:
        badges.append(get_badge_info(badge)[0])
    return badges

def attach_badge_to_user(user_id, badge):
    badge_id = get_badge_id(badge)
    add_badge_to_user(user_id, badge_id)

    return 
