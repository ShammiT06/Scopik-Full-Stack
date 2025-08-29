import random
from django.core.mail import send_mail
from django.conf import settings

def generate_otp():
    return str(random.randint(100000, 999999))

def send_otp_email(email, otp):
    subject = "LMS Email Verification OTP"
    message = f"                 Your OTP for registration is: {otp}"
    from_email = settings.EMAIL_HOST_USER
    send_mail(subject, message, from_email, [email])