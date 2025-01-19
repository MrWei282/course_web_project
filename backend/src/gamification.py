import psycopg2
import random
from db.funcs.db_auth import *
from db.funcs.db_course import *
from db.funcs.db_assignment import *
from db.funcs.db_class import *
from db.funcs.db_resource import *
from db.funcs.db_file import *
from db.funcs.db_forum import *
from db.funcs.db_gamification import *
from db.funcs.db_quiz import *
from db.funcs.db_user_profile import *
from src.notif import *
from src.helpers import *
from src.error import InputError, AccessError
from src.user_profile import attach_badge_to_user

# user story 1 (DONE)

# user story 2, changed to allocate marks upon submission, not when released
#   - changed submit functions for assignment and quiz to give marks to students
# (DONE)

def edit_quiz_points_value(token, quiz_id, quiz_points):
    user_id = check_validity(token)
    db_update_quiz_points(quiz_points, quiz_id)
    return {
        "quiz_points": quiz_points
    }
    
def edit_assignment_points_value(token, assignment_id, assignment_points):
    user_id = check_validity(token)
    db_update_assignment_points(assignment_points, assignment_id)
    return {
        "assignment_points": assignment_points
    }
    
def get_shop(token, course_id):
    user_id = check_validity(token)
    item_ids = get_course_shop_inventory(course_id)
    items = []
    for item_id in item_ids:
        item = get_item_info(item_id)
        item_info = {
            "item_id": item["id"],
            "course_id": item["course_id"],
            "item_file": item["item_file"],
            "item_name": item["item_name"],
            "item_desc": item["item_desc"],
            "cost": item["cost"]
        }
        items.append(item_info)
    return {
        "items": items
    }
    
def insert_item_into_shop(token, course_id, item_file, item_name, item_desc, cost):
    user_id = check_validity(token)
    item_id = add_item_to_shop(course_id, item_file, item_name, item_desc, cost)
    return {
        "item_id": item_id
    }
    
# POST
def redeem_item_from_shop__get_item(token, course_id, item_id):
    user_id = check_validity(token)
    user_balance = get_students_points_balance(user_id, course_id)
    item_cost = get_item_info(item_id)["cost"]
    
    if user_balance < item_cost:
        raise AccessError("Insufficient Points")
    
    
   
    # notify teacher student has redeemed item
    
    email_list = get_staff_emails_from_course(course_id)
    student_name = get_user_info(user_id)["user_firstname"] + " " + get_user_info(user_id)["user_lastname"] 
    item_name = get_item_info(item_id)["item_name"]
    course_name = get_course_info(course_id)["course_name"]

    try:
        notif_item_redeemed(email_list, student_name, item_name, course_name)
    except:
        print("Unable to send email")
    
    add_item_to_student_inventory(user_id, course_id, item_id)
    return {
        "item_id": item_id
    }
    
# PUT
def redeem_item_from_shop__use_points(token, course_id, item_id):
    user_id = check_validity(token)
    user_balance = get_students_points_balance(user_id, course_id)
    item_cost = get_item_info(item_id)["cost"]
    
    if user_balance < item_cost:
        raise AccessError("Insufficient Points")
    
    points_balance = user_balance - item_cost
    update_student_points_balance(points_balance, user_id, course_id)
    
    mission_ids = get_course_missions_by_type(course_id, "shop")
    for mission_id in mission_ids:
        if get_mission_tracker_count(mission_id, user_id)["is_achieved"] != True:
            curr = get_mission_tracker_count(mission_id, user_id)["counter"]
            goal = get_mission_info(mission_id)["condition"]
            
            curr = curr + 1
            update_mission_counter(curr, mission_id, user_id)
            
            if curr >= goal:
                update_mission_achieved(mission_id, user_id)
                attach_badge_to_user(user_id, "item_badge")
                
                points = get_mission_info(mission_id)["points"]
                old_balance = get_students_points_balance(user_id, course_id)
                new_balance = old_balance + points
                update_student_points_balance(new_balance, user_id, course_id)
                
    if check_item_wishlisted(user_id, course_id, item_id) == True:
        update_bought_wishlist_item(user_id, course_id, item_id)
                
                
    return {
        "old_balance": user_balance,
        "new_balance": points_balance
    }
       
def get_student_items_redeemed(token, course_id):
    user_id = check_validity(token)
    item_ids = get_student_inventory(user_id, course_id)
    items = []
    for item_id in item_ids:
        items.append(item_id[0])
    return {
        "item_ids": items
    }
    
def get_item(token, item_id):
    user_id = check_validity(token)
    item = get_item_info(item_id)
    return {
        "item_id": item["id"],
        "course_id": item["course_id"],
        "item_file": item["item_file"],
        "item_desc": item["item_desc"],
        "cost": item["cost"]
    }
# GET
def rank_student_by_points(token, course_id):
    user_id = check_validity(token)
    student_point_info = rank_students_in_course(course_id)
    rankings = []
    for student in student_point_info:
        student_info = get_user_info(student[0])
        student_ranking = {
            "user_id": student_info["user_id"],
            "user_firstname": student_info["user_firstname"],
            "user_lastname": student_info["user_lastname"],
            "user_points": student[1]
        }
        rankings.append(student_ranking)
        
    return {
        "rankings": rankings
    }
# PUT
def share_points(token, reciever_id, course_id, points):
    user_id = check_validity(token)
    if is_staff_in_course(reciever_id, course_id):
        raise AccessError("Lecturer or teachers cannot receive points")
    
    # update donator's points balance
    old_balance_A = get_students_points_balance(user_id, course_id)
    points = int(points)
    if points > old_balance_A:
        raise AccessError("Insufficient Balance")
    
    new_balance_A = old_balance_A - points
    update_student_points_balance(new_balance_A, user_id, course_id)
    
    # update reciever's points balance
    old_balance_B = get_students_points_balance(reciever_id, course_id)
    new_balance_B = old_balance_B + points
    update_student_points_balance(new_balance_B, reciever_id, course_id)
    return {
        "donator_id": user_id,
        "donator_old_balance": old_balance_A,
        "donator_new_balance": new_balance_A,
        "reciever_id": reciever_id,
        "reciever_old_balance": old_balance_B,
        "reciever_new_balance": new_balance_B
    }
# GET
def get_student_wishlisted_items(token, course_id):
    user_id = check_validity(token)
    item_ids = get_student_wishlist_items_not_bought(user_id, course_id)
    items = []
    for item_id in item_ids:
        item_info = get_item_info(item_id)
        item = {
            "item_id": item_id[0],
            "item_file": item_info["item_file"],
            "item_name": item_info["item_name"],
            "item_desc": item_info["item_desc"],
            "cost": item_info["cost"]
        }
        items.append(item)
    return {
        "items": items
    }
    
# POST
def wishlist_item(token, course_id, item_id):
    user_id = check_validity(token)
    wishlist_item_id = item_id
    item_ids = get_student_wishlist_items(user_id, course_id)
    
    for item_id in item_ids:
        item_info = get_item_info(item_id)
        item = item_info["id"]
        if item == wishlist_item_id:
            raise InputError("Item already wishlisted!")

    wishlist_item_lol(user_id, course_id, wishlist_item_id)
    return 
# GET
def get_all_missions_from_course(token, course_id):
    user_id = check_validity(token)
    mission_ids = get_course_missions(course_id)
    missions = []
    for mission_id in mission_ids:
        mission = get_mission_info(mission_id[0])
        stat_info = get_mission_tracker_count(mission_id[0], user_id)
        m = {
            "mission_id": mission["id"],
            "mission_title": mission["mission_title"],
            "mission_content": mission["mission_content"],
            "points": mission["points"],
            "condition": mission["condition"],
            "is_achieved": stat_info["is_achieved"]
        }
        missions.append(m)
    return {
        "missions": missions
    }
    
# POST
def create_mission_for_course(token, mission_title, mission_type, points, condition, course_id):
    user_id = check_validity(token)
    if not is_staff_in_course(user_id, course_id):
        raise AccessError("not an admin in this course")
    
    if mission_type == "assignment":
        content = "Submit assignment "
    elif mission_type == "quiz":
        content = "Submit quiz "
    elif mission_type == "guess_mark":
        content = "Guess marks correctly "
    elif mission_type == "spin_wheel":
        content = "Spin wheel "
    else:
        content = "Purchase items "
    # or 'shop'
        
        
    content = content + str(condition) + " time(s)"
    
    mission_id = create_mission(mission_title, content, mission_type, points, condition, course_id)
    
    student_ids = get_course_students(course_id)["students"]
    for student_id in student_ids:
        add_mission_to_student_tracker(mission_id, student_id)
    return
# GET
def get_wheel(token, course_id):
    user_id = check_validity(token)
    item_ids = get_course_shop_inventory(course_id)
    print(item_ids)
    owned_ids = get_student_inventory(user_id, course_id)
    have = []
    for owned_id in owned_ids:
        have.append(owned_id[0])
    owned_ids = have
    print(owned_ids)
    
    items = []
    for item_id in item_ids:
        item = get_item_info(item_id)
        item_info = {
            "item_id": item["id"],
            "course_id": item["course_id"],
            "item_file": item["item_file"],
            "item_name": item["item_name"],
            "item_desc": item["item_desc"],
            "cost": item["cost"]
        }
        if item_id[0] not in owned_ids:
            items.append(item_info)
    return {
        "items": items,
        "cost": get_spin_cost(course_id)
    }
    
# POST
def spin_wheel(token, course_id):
    # spins wheel, gets random id of item, adds that item
    # to user inventory
    user_id = check_validity(token)
    cost = get_spin_cost(course_id)
    balance = get_students_points_balance(user_id, course_id)
    if balance < cost:
        raise AccessError("Insufficient Balance")
    
    item_ids = get_course_shop_inventory(course_id)
    owned_ids = get_student_inventory(user_id, course_id)
    have = []
    for owned_id in owned_ids:
        have.append(owned_id[0])
    owned_ids = have
    
    # wheel automatically created, composed of items
    # in the shop that the user has yet to purchase
    prizes = []
    for item_id in item_ids:
        if item_id[0] not in owned_ids:
            prizes.append(item_id)
    
    if prizes == []:
        raise AccessError("All prizes already claimed!")
    
    prize_id = random.choice(prizes)
    
    add_item_to_student_inventory(user_id, course_id, prize_id)
    
    
    mission_ids = get_course_missions_by_type(course_id, "spin_wheel")
    for mission_id in mission_ids:
        if get_mission_tracker_count(mission_id, user_id)["is_achieved"] != True:
            curr = get_mission_tracker_count(mission_id, user_id)["counter"]
            goal = get_mission_info(mission_id)["condition"]
            
            curr = curr + 1
            update_mission_counter(curr, mission_id, user_id)
            
            if curr >= goal:
                update_mission_achieved(mission_id, user_id)
                attach_badge_to_user(user_id, "wheel_badge")
                
                points = get_mission_info(mission_id)["points"]
                old_balance = get_students_points_balance(user_id, course_id)
                new_balance = old_balance + points
                update_student_points_balance(new_balance, user_id, course_id)
                
    prize_info = get_item_info(prize_id)
    balance = get_students_points_balance(user_id, course_id)
    balance = balance - cost
    
    update_student_points_balance(balance, user_id, course_id)
    
    return {
            "item_id": prize_info["id"],
            "course_id": prize_info["course_id"],
            "item_file": prize_info["item_file"],
            "item_name": prize_info["item_name"],
            "item_desc": prize_info["item_desc"]
    }
    
# PUT 
def guess_quiz_mark(token, course_id, quiz_id, guess):
    user_id = check_validity(token)
    marks = view_released_quizes(user_id, course_id)
    
    if check_quiz_submission_viewed(user_id, quiz_id) == True:
        raise AccessError("Marks already viewed")
    
    balance = get_students_points_balance(user_id, course_id)
    cost = get_guess_cost(course_id)
    if balance < cost:
        raise AccessError("Insufficient Balance")
    balance = balance - cost
    
    update_student_points_balance(balance, user_id, course_id)
    
    correct = -1
    for mark in marks:
        if quiz_id == mark[2]:
            correct = mark[6]
            break
    if correct == -1:
        raise AccessError("Quiz not attempted, does not exist or not released")
    
    if guess == correct:
        mission_ids = get_course_missions_by_type(course_id, "guess_mark")
        for mission_id in mission_ids:
            if get_mission_tracker_count(mission_id, user_id)["is_achieved"] != True:
                curr = get_mission_tracker_count(mission_id, user_id)["counter"]
                goal = get_mission_info(mission_id)["condition"]
                
                curr = curr + 1
                update_mission_counter(curr, mission_id, user_id)
                
                if curr >= goal:
                    update_mission_achieved(mission_id, user_id)
                    attach_badge_to_user(user_id, "mark_badge")
                    
                    points = get_mission_info(mission_id)["points"]
                    old_balance = get_students_points_balance(user_id, course_id)
                    new_balance = old_balance + points
                    update_student_points_balance(new_balance, user_id, course_id)
                    
        balance = get_students_points_balance(user_id, course_id)
        prize = 3 * cost
        balance = balance + prize
        update_student_points_balance(balance, user_id, course_id)
        return {
            "correct_guess": True
        }
    else:
        return {
            "correct_guess": False
        }
        
def guess_assignment_mark(token, course_id, submission_id, guess):
    user_id = check_validity(token)
    correct = get_submission_info(submission_id)['grade']
      
    if check_submission_released(submission_id) == False:
        raise AccessError("Assignment not released yet")
    if check_submission_viewed(submission_id) == True:
        raise AccessError("Marks already viewed")
    
    balance = get_students_points_balance(user_id, course_id)
    cost = get_guess_cost(course_id)
    if balance < cost:
        raise AccessError("Insufficient Balance")
    balance = balance - cost
    
    update_student_points_balance(balance, user_id, course_id)
    
    if guess == correct:
        mission_ids = get_course_missions_by_type(course_id, "guess_mark")
        for mission_id in mission_ids:
            if get_mission_tracker_count(mission_id, user_id)["is_achieved"] != True:
                curr = get_mission_tracker_count(mission_id, user_id)["counter"]
                goal = get_mission_info(mission_id)["condition"]
                
                curr = curr + 1
                update_mission_counter(curr, mission_id, user_id)
                
                if curr >= goal:
                    update_mission_achieved(mission_id, user_id)
                    attach_badge_to_user(user_id, "mark_badge")
                    
                    points = get_mission_info(mission_id)["points"]
                    old_balance = get_students_points_balance(user_id, course_id)
                    new_balance = old_balance + points
                    update_student_points_balance(new_balance, user_id, course_id)
                  
        balance = get_students_points_balance(user_id, course_id)
        prize = 3 * cost
        balance = balance + prize
        update_student_points_balance(balance, user_id, course_id)
        return {
            "correct_guess": True
        }
    else:
        return {
            "correct_guess": False
        }
           
def change_spin_cost(token, course_id, cost):
    user_id = check_validity(token)
    update_spin_cost(course_id, cost)
    
def change_guess_cost(token, course_id, cost):
    user_id = check_validity(token)
    update_guess_cost(course_id, cost)
    
def get_student_points(token, course_id):
    user_id = check_validity(token)
    return get_students_points_balance(user_id, course_id)

def get_game_guess_cost(token, course_id):
    user_id = check_validity(token)
    return get_guess_cost(course_id)

