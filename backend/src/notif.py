import smtplib, ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

sender_email = "gitgudh18bcomp3900@outlook.com"
password = "gitgud666"
smtp_server = "smtp-mail.outlook.com"
port = 587
'''
email: gitgudh18bcomp3900@outlook.com
password: gitgud666
'''

'''
email_list (list of strings): list of emails we want to send notification to 
'''
def notif_forum_post(email_list, student_name, course_name):
    message = MIMEMultipart("alternative")
    message["Subject"] = "New Forum Post"
    message["From"] = sender_email
    message["To"] = ", ".join(email_list)

    body = MIMEText(f"""
    Hello there!

    New post by {student_name} in {course_name}, check it out!
    """)
    
    message.attach(body)
    text = message.as_string()

    context = ssl.create_default_context()
    with smtplib.SMTP(smtp_server, port) as server:
        server.starttls(context = context)
        server.login(sender_email, password)
        server.sendmail(sender_email, email_list, text)

def notif_material(email_list, course_name):
    message = MIMEMultipart("alternative")
    message["Subject"] = "New Teaching Material"
    message["From"] = sender_email
    message["To"] = ", ".join(email_list)

    body = MIMEText(f"""
    Hello there!

    New teaching material for {course_name}, check it out!
    """)
    
    message.attach(body)
    text = message.as_string()

    context = ssl.create_default_context()
    with smtplib.SMTP(smtp_server, port) as server:
        server.starttls(context = context)
        server.login(sender_email, password)
        server.sendmail(sender_email, email_list, text)
        
# send notification to all teachers
def notif_item_redeemed(email_list, student_name, item_name, course_name):
    message = MIMEMultipart("alternative")
    message["Subject"] = "Someone bought an item!"
    message["From"] = sender_email
    message["To"] = ", ".join(email_list)

    body = MIMEText(f"""
    Hello there!

    {student_name} has redeemed {item_name} from {course_name}!
    """)
    
    message.attach(body)
    text = message.as_string()

    context = ssl.create_default_context()
    with smtplib.SMTP(smtp_server, port) as server:
        server.starttls(context = context)
        server.login(sender_email, password)
        server.sendmail(sender_email, email_list, text)

def notif_profile_comment(email, student_name):
    message = MIMEMultipart("alternative")
    message["Subject"] = "New Comment"
    message["From"] = sender_email
    message["To"] = email
    
    body = MIMEText(f"""
    Hello there!

    {student_name} has left a comment under your profile!
    """)
    
    message.attach(body)
    text = message.as_string()

    context = ssl.create_default_context()
    with smtplib.SMTP(smtp_server, port) as server:
        server.starttls(context = context)
        server.login(sender_email, password)
        server.sendmail(sender_email, email, text)