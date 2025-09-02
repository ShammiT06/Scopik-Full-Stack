from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.http import Http404
from .models import Certificate, student
from .serializers import CertificateSerializer
from rest_framework.decorators import action, api_view
from .models import student, teacher,  course_category,  course_video, Chapter, course,courseenrollement, Quiz,QuizResult,Certificate,Superadmin,payment,course_material,University,course_textcontent,LMSActivity,assign_university,course_to_faculty,Certificate_template,course_chapter_status,Feedback,Semester,Blog,Contactus,blog_category
from .serializers import studentSerializer, teacherSerializer, course_categorySerializer,course_videoSerializer, ChapterSerializer, courseSerializer,login_userserializer,course_enrollementDashboardSerializer, QuizSerializer,CertificateSerializer,course_materialSerializer,course_textcontentserializer, UniversitySerializer,Assignuniversityserializers,AssigencourseToFacultySerializer,QuizResultSerializer,Coursechapterserializer,FeedbackSeriallizers,Semesterseriaizers,BlogSerializers,Certificatetemplateserializer,ContactusSerializer,CreateblogcategorySerializer
from rest_framework import generics
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login, logout
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from django.http import HttpResponse
from .certificate_generator import generate_certificate_image
from urllib.parse import unquote
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import payment
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
import razorpay
from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings
from rest_framework import status
from .serializers import AttendanceSerializer, LMSActivitySerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth import logout
from .models import student, Attendance  
from django.contrib.auth.models import User
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from .models import EmailOTP
from .utils import generate_otp, send_otp_email
from django.contrib.auth.hashers import make_password
from django.db import transaction
from django.utils.crypto import get_random_string
from django.core.mail import send_mail
import uuid

#######################################################3
###************ APIS *******************************##
#######################################################
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        # Add extra user info in response
        data.update({
            'user': {
                'id': self.user.id,
                'name': self.user.name,
                'email': self.user.email,
                'user_type': self.user.user_type,
            }
        })
        return data
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class StudentListCreateView(generics.ListCreateAPIView):
    queryset = student.objects.all()
    serializer_class = studentSerializer
class StudentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = student.objects.all()
    serializer_class = studentSerializer
   
class TeacherListCreateView(generics.ListCreateAPIView):
    queryset = teacher.objects.all()
    serializer_class = teacherSerializer
   
class TeacherDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = teacher.objects.all()
    serializer_class = teacherSerializer

class TeacherListView(generics.ListCreateAPIView):
    queryset = teacher.objects.all()
    serializer_class = teacherSerializer

class TeacherDetailView2(generics.RetrieveUpdateDestroyAPIView):
    queryset = teacher.objects.all()
    serializer_class = teacherSerializer
   
class CourseCategoryView(generics.ListCreateAPIView):
    queryset = course_category.objects.all()
    serializer_class = course_categorySerializer


class blogcategorylistview(generics.ListAPIView):
    queryset = blog_category.objects.all()
    serializer_class = CreateblogcategorySerializer


class CourseCategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = course_category.objects.all()
    serializer_class = course_categorySerializer

class CourseVideoListAPIView(generics.ListCreateAPIView):
    queryset = course_video.objects.all()
    serializer_class = course_videoSerializer
class CourseVideoDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = course_video.objects.all()
    serializer_class = course_videoSerializer


class ChapterListCreateAPIView(generics.ListCreateAPIView):
    queryset = Chapter.objects.all()
    serializer_class = ChapterSerializer

class ChapterDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Chapter.objects.all()
    serializer_class = ChapterSerializer

permission_classes([IsAuthenticated])
class CourseListAPIView(generics.ListAPIView):
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = course.objects.all()
    serializer_class = courseSerializer
permission_classes([IsAuthenticated])
class CourseDetailAPIView(generics.RetrieveAPIView):
    queryset = course.objects.all()
    serializer_class = courseSerializer
   
class CourseDocumentlist(generics.ListAPIView):
    queryset = course_material.objects.all()
    serializer_class = course_materialSerializer
   
class coursetextview(generics.ListAPIView):
    queryset = course_textcontent.objects.all()
    serializer_class = course_textcontentserializer

class coursetextdetailview(generics.RetrieveDestroyAPIView):
    queryset = course_textcontent.objects.all()
    serializer_class = course_textcontentserializer

class CourseEnrollementListAPIView(generics.ListCreateAPIView):
    queryset = courseenrollement.objects.all()
    serializer_class = course_enrollementDashboardSerializer
class CourseEnrollementDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = courseenrollement.objects.all()
    serializer_class = course_enrollementDashboardSerializer
   
class QuizListCreateView(generics.ListCreateAPIView):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer
class QuizDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer

class Quizresultlist(generics.ListCreateAPIView):
    queryset = QuizResult.objects.all()
    serializer_class = QuizResultSerializer
   
class Certificatelist(generics.ListCreateAPIView):
    queryset = Certificate.objects.all()
    serializer_class = CertificateSerializer
   
class coursematerial(generics.ListCreateAPIView):
    queryset = course_material.objects.all()
    serializer_class = course_materialSerializer

class UniversityListView(generics.ListCreateAPIView):
    queryset = University.objects.all()
    serializer_class = UniversitySerializer
   
class UniversityDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = University.objects.all()
    serializer_class = UniversitySerializer

class assignuniversitylistview(generics.ListAPIView):
    queryset = assign_university.objects.all()
    serializer_class = Assignuniversityserializers
   
class assignuniversitydetailview(generics.RetrieveUpdateDestroyAPIView):
    queryset = assign_university.objects.all()
    serializer_class = Assignuniversityserializers

class certificatetemplateview(generics.ListCreateAPIView):
    queryset = Certificate_template.objects.all()
    serializer_class=Certificatetemplateserializer
   
   
class assigncourseToFacultyListView(generics.ListAPIView):
    queryset = course_to_faculty.objects.all()
    serializer_class = AssigencourseToFacultySerializer

class assigncourseToFacultyDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = course_to_faculty.objects.all()
    serializer_class = AssigencourseToFacultySerializer
   
class coursechapterstatusview(generics.ListAPIView):
    queryset = course_chapter_status.objects.all()
    serializer_class = Coursechapterserializer
   
class Feedbacklist(generics.ListAPIView):
   
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSeriallizers
   
class Semsterviewslist(generics.ListAPIView):
    queryset = Semester.objects.all()
    serializer_class = Semesterseriaizers
   
################ Blogs #######################
class Blogsviews(generics.ListAPIView):
    queryset = Blog.objects.all()
    serializer_class = BlogSerializers
   

   
###################  feedback apis  #############################
@api_view(['POST'])
def create_feedback(request):
    student_email = request.data.get('email')
    course_name = request.data.get('course')
    feedback_text = request.data.get('feed')
    print(student_email,course_name,feedback_text)
    try:
       
        student_instance = student.objects.get(email=student_email)
       
    except student.DoesNotExist:
        return Response({'error': 'Student does not exist'}, status=status.HTTP_404_NOT_FOUND)
    try:
        course_instance = course.objects.get(name=course_name)
    except course.DoesNotExist:
        return Response({'error': 'Course does not exist'}, status=status.HTTP_404_NOT_FOUND)
    print(student_instance,course_instance)
    try:
        Feedback.objects.create(
            student=student_instance,
            course=course_instance,
            feedback=feedback_text
        )
        return Response({'message': 'Feedback created successfully'}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
   
@api_view(['GET'])
def get_feedback(request):
    course_name = request.query_params.get('course')
    try:
        course_instance = course.objects.get(name=course_name)
    except course.DoesNotExist:
        return Response({'error': 'Course does not exist'}, status=status.HTTP_404_NOT_FOUND)
    feedbacks = Feedback.objects.filter(course=course_instance)
    serializer = FeedbackSeriallizers(feedbacks, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

#### ****  generate otp by email *** ##

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.core.mail import send_mail
import random

otp_storage = {}  # Temporary for demo; use DB or session in production

@api_view(['POST'])
def send_otp(request):
    email = request.data.get('email')

    if not email:
        return Response({'error': 'Email is required.'}, status=status.HTTP_400_BAD_REQUEST)

    otp = str(random.randint(100000, 999999))
    otp_storage[email] = otp

    # Send the OTP via email
    send_mail(
        subject='Your One-Time Password (OTP) for Scopik Edutech',
        message=f''' Hello 
        Your One-Time Password (OTP) for Verifying Your account on Scopik Edutek is: {otp}
        This OTP is Valid for 2 Minutes. Please do not Share it with anyone.
        If You did not request this OTP , Please Ignore this Email.
        Thank You,
        The Scopik Edutech Team
        ''',
        from_email='noreply@example.com',  # Change to your sender email
        recipient_list=[email],
        fail_silently=False,
    )

    return Response({'message': 'OTP sent successfully'}, status=status.HTTP_200_OK)

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

otp_storage = {}  # Temporary dictionary to hold OTPs. Replace with DB logic in production.

@api_view(['POST'])
def verify_otp(request):
    email = request.data.get('email')
    otp = request.data.get('otp')
    print(email,otp)

    if not email or not otp:
        return Response({'error': 'Email and OTP are required.'}, status=status.HTTP_400_BAD_REQUEST)

    if otp_storage.get(email) == otp:
        return Response({'message': 'OTP verified successfully'}, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'Invalid OTP'}, status=status.HTTP_400_BAD_REQUEST)

########**********  Certificate Api **********########

@api_view(['GET'])
def Certficateviewuser(request):
    email = request.GET.get('email')
    print(email)
    students_instance = student.objects.filter(email=email).first()
    print(students_instance)
   
    if students_instance:
        certificate_instance = Certificate.objects.filter(student=students_instance).first()
        data = {
            'certificate': certificate_instance.certificate_image.url if certificate_instance else None
        }
    else:
        data = {
            'error': 'Student not found.'
        }

    return Response(data)


@api_view(['POST'] )
def uploadCertificate(request):
    print(request.data)
    course=request.data.get('name')
    certificate_image = request.data.get('certificate_image')
    try:
        course_instance = course.objects.get(name=course)
    except course.DoesNotExist:
        return Response({"error": "Course not found"}, status=404)
    if not certificate_image:
        return Response({"error": "Certificate image not found"}, status=404)
    try:
        certificate = Certificate_template.objects.create(
            course=course_instance,
            certificate_image=certificate_image
        )
        certificate.save()
        return Response({"message": "Certificate uploaded successfully"}, status=201)
    except Exception as e:
        print(e)
        return Response({"error": "Failed to upload certificate"}, status=500)

##################################################
#************ user Login and Logout ************#
##################################################
@api_view(['POST', 'GET'])
def logout_user(request):
    from datetime import datetime
    from dateutil.parser import parse

    login_str = request.data.get('storedLoginTime')
    logout_str = request.data.get('logout_time')
    user_email = request.data.get('student_email')
   
    print(login_str,logout_str,user_email)

    if not logout_str or not user_email or not login_str:
        return Response({"error": "Missing logout_time, login_time, or email."}, status=400)
    try:
        login_time = parse(login_str)
        logout_time = parse(logout_str)
    except Exception:
        return Response({"error": "Invalid date format."}, status=400)

    from datetime import datetime, timedelta
    from dateutil.parser import parse
    from datetime import datetime
    from datetime import timedelta

    new_hours_spent = min((logout_time - login_time).total_seconds() / 3600, 24)
    student_instance = student.objects.filter(email=user_email).first()
    teacher_instance = teacher.objects.filter(email=user_email).first()
    university_instance = University.objects.filter(email=user_email).first()
    superadmin_instance = Superadmin.objects.filter(email=user_email).first()
   
    if student_instance:
        try:
            attendance_record = Attendance.objects.filter(student=student_instance).last()
            if attendance_record:
                attendance_record.logout_time = logout_time
                attendance_record.save()

            lms_record = LMSActivity.objects.filter(student=student_instance).last()
            if lms_record:
                previous_hours = lms_record.hours_spent or 0
                lms_record.logout_time = logout_time
                lms_record.hours_spent = round(previous_hours + new_hours_spent, 2)
                lms_record.save()
        except Exception as e:
            return Response({"error": f"Failed to update student records: {str(e)}"}, status=500)
   
    elif  teacher_instance:
            print("Faculty logout successful.")
            return Response({"message":"logout successfully"},status=200)
    elif university_instance:
        print("University admin successfully")
        return Response({"message":"logout successfully"},status=200)
    elif superadmin_instance:
        print("superadmin logout successfully ")
        return Response({"message":"logout successfully"},status=200)
    else:
        return Response({
            'error':'failed to logout the users '
        },status=500)
    try:
        logout(request._request)
        return Response({"message": "Logout successful.", "hours_spent": round(new_hours_spent, 2)},
                         status=200)
    except Exception as e:
        return Response({"error": f"Logout failed: {str(e)}"}, status=500)

@api_view(['POST'])
def login_user(request):
    try:
        email = request.data.get('email')
        password = request.data.get('password')
        user_type = request.data.get('user_type')
        login_time = request.data.get('login_time')

        print(email, password, user_type)

        users = None  # Start as None to avoid mistakes

        if user_type == 'student':
            try:
                users = student.objects.get(email=email, password=password, user_type=user_type)
            except student.DoesNotExist:
                return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)

        elif user_type == 'Faculty':
            try:
                users = teacher.objects.get(email=email, password=password, user_type=user_type)
            except teacher.DoesNotExist:
                return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)

        elif user_type == 'University_admin':
            try:
                users = University.objects.get(email=email, password=password)
            except University.DoesNotExist:
                return Response({'error': 'Invalid email or password'}, status=status.HTTP_400_BAD_REQUEST)

        elif user_type == 'Superadmin':
            try:
                users = Superadmin.objects.get(email=email, password=password)
            except Superadmin.DoesNotExist:
                return Response({'error': 'Invalid email or password'}, status=status.HTTP_400_BAD_REQUEST)

        else:
            return Response({"error": "Invalid user type"}, status=status.HTTP_400_BAD_REQUEST)

        refresh = RefreshToken.for_user(users)

        # Student-specific logic
        if user_type == 'student':
            from datetime import date
            today = date.today()

            attendance, created = Attendance.objects.get_or_create(student=users, date=today, defaults={'present': True, 'login_time': login_time})
            if not created:
                attendance.login_time = login_time
                attendance.save()

            LMSActivity.objects.get_or_create(student=users, date=today)

            return Response({
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user": {
                    "id": users.id,
                    "name": users.name,
                    "email": users.email,
                    "user_type": users.user_type,
                    "image":users.profile_img if users.profile_img else None,
                },
                "login_time": login_time
            }, status=status.HTTP_200_OK)

        # Faculty logic
        elif user_type == 'Faculty':
            return Response({
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user": {
                    "id": users.id,
                    "name": users.name,
                    "email": users.email,
                    "user_type": users.user_type,
                }
            }, status=status.HTTP_200_OK)

        # University admin logic
        elif user_type == 'University_admin':
            return Response({
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user": {
                    "name": users.name,
                    "email": users.email,
                    "user_type": 'University_admin',
                }
            }, status=status.HTTP_200_OK)

        # Superadmin logic
        elif user_type == 'Superadmin':
            return Response({
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user": {
                    "name": users.name,
                    "email": users.email,
                    "user_type": 'Superadmin',
                }
            }, status=status.HTTP_200_OK)

    except Exception as e:
        import traceback
        traceback.print_exc()
        return Response({"error": "Internal server error", "details": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def register_user(request):
        name = request.data.get('name')
        email = request.data.get('email')
        # password = request.data.get('password')
        user_type = request.data.get('user_type')
        print('usertype:', user_type)
        if user_type=='student':
            phone = request.data.get('phone')
            registerno=request.data.get('registerno')
            university = request.data.get('university')
            academicYear = request.data.get('academicYear')
            department=request.data.get('department')
        elif user_type == 'Faculty':
            phone = request.data.get('phone')
            department = request.data.get('department')
            university = request.data.get('university')
        model = student if user_type == 'student' else teacher if user_type == 'Faculty' else None

        if not model:
            return Response({"error": "Invalid user type"}, status=status.HTTP_400_BAD_REQUEST)
    # Check if user already exists
        if model.objects.filter(email=email).exists():
            return Response({"error": "User already exists"}, status=400)


        token = str(uuid.uuid4())
        print(university)
        if university == None:
            university = 'Scopik'
        try:
            university_instance = University.objects.get(name=university)
            print(university_instance)
        except University.DoesNotExist :
            return Response({"error": "University not found"}, status=400)
        if user_type=='student':
            student.objects.create(
                                   name=name,
                                   email=email,
                                   phone_number=phone,
                                   university=university_instance,
                                   academicYear=academicYear,
                                   registerno=registerno,
                                   department=department,
                                   password_reset_token=token
                                   )
        elif user_type=='Faculty':
            teacher.objects.create(
                                   name=name,
                                   email=email,
                                   phone_number=phone,
                                   university=university_instance,
                                   department=department,
                                   password_reset_token=token
                                   )
            
            
        # Send email with token link
        link = f"http://localhost:5173//set-password/{token}/{email}"
        send_mail(
        subject="Welcome to Scopik EduTech - Set Up Your Account",
        message=f"""Hi {name}, 
        Welcome to Scopik EduTech!
       Your account has been created. Click the link below to set your password and activate your account:
       {link}
       If you didn't request this, please ignore this email.  
       Regards,  
       Scopik EduTech Team""",
        from_email="noreply@yourapp.com",
        recipient_list=[email],
                )

        return Response({"message": "User registered. Check your email to set a password."})
       
@api_view(['POST'])
def set_password(request):
    email = request.data.get('email')
    token = request.data.get('token')
    password = request.data.get('password')
    try:
        users = student.objects.get(email=email, password_reset_token=token)
    except student.DoesNotExist:
        try:
            users = teacher.objects.get(email=email, password_reset_token=token)
        except teacher.DoesNotExist:
            return Response({"error": "Invalid token or email"}, status=400)

    # Save password and clear token
    users.password = password  # Optionally hash it
    users.password_reset_token = None
    users.save()

    return Response({"message": "Password set successfully"})

@api_view(['POST'])
def superadmin_login(request):
    if request.method == 'POST':
        username = request.query_params.get('useremail')
        password = request.data.get('password')
        print(password,username)
        try:
            users = Superadmin.objects.get(email=username)
        except Superadmin.DoesNotExist:
            return Response({"error": "Invalid username or password"}, status=400)
        try:
            if users.check_password(password):
                return Response({"message": "Login successful"}, status=200)
            else:
                return Response({"error": "Invalid username or password"}, status=400)
        except Exception as e:
            return Response({"error": "Invalid username or password"}, status=400)

@api_view(['POST'])
def superadmin_logout(request):
     if request.method == 'POST':
        try:
            logout(request._request)
            return Response('Logout successful')
        except Exception as e:
            print(e)
            return Response('Logout failed')
        else:
            return Response('Invalid request method')
#################################################
#************ Course Enrollement ***************#
#################################################
@api_view(['POST'])
def student_courseenrollement_view(request):
    # import logging
    # logger = logging.getLogger(name)
    # logger.info(f"Received enrollment request data: {request.data}")
    if request.method == 'POST':
        course_id = request.data.get('id')
        student_email = request.data.get('email')
        student_name = request.data.get('name')
        number = request.data.get('number')
        amount = request.data.get('amount')
        payment_method =request.data.get('payment_method' )
       
        print(amount)
        print(payment_method)

        
    print(student_email, course_id,student_name,number,amount)
    if not student_email:
        print("Email parameter is missing")
        return Response({"error": "Email parameter is required"}, status=400)
    try:
        students = student.objects.get(email=student_email)
        print(number)
        if not students:
            return Response({"error": "Student not found or unauthorized"}, status=404)
        course_details = course.objects.get(id=course_id)
        if not course_details:
            return Response({"error": "Course not found"}, status=404)
    except student.DoesNotExist:
        return Response({"error": "Student not found"}, status=404)
    except course.DoesNotExist:
        return Response({"error": "Course not found"}, status=404)
    except Exception as e:
        return Response({"error": str(e)}, status=500)
    student_obj = student.objects.get(email=student_email)
    course_obj = course.objects.get(id=course_id)
    print(student_obj)
    print(course_obj)



    if courseenrollement.objects.filter(course=course_obj, student=student_obj).exists():
    
        return Response({'error': 'Student already enrolled in this course'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        enrollement = courseenrollement(course=course_obj, student=student_obj)
        # enrollement.save()

        client = razorpay.Client(auth=("rzp_test_6b8dLoMFlQOROE", "cWTmuq2mTfiSTzsZW0uWv56f"))
        amount = int(float(amount) * 100)

        payment_order = client.order.create({
            'amount': amount,
            'currency': 'INR',
            'payment_capture': '1',
            
        })
        

        payment.objects.create(
            name=student_name,
            email=student_email,
            phone_number=number,
            student=student_obj,
            course=course_obj,
            amount=amount,
            payment_method=payment_method,
            payment_id=payment_order['id'],
            payment_status=True,
        )

       
        return Response({
            'message': 'Enrollment successful',
            'order_id': payment_order['id'],
            'razorpay_key_id': 'rzp_test_6b8dLoMFlQOROE',
            'amount': amount,
            'currency': 'INR',
            'payment_method': payment_method,
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        print(e)
        return Response({'error': f'Error occurred during enrollment: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

############################################
####********* Payment  API    *********####
############################################

@csrf_exempt
@api_view(['POST'])
def payment_success(request):
    if request.method == "POST":
        data = json.loads(request.body)

        razorpay_payment_id = data.get("razorpay_payment_id")
        razorpay_order_id = data.get("razorpay_order_id")
        razorpay_signature = data.get("razorpay_signature")

        if not razorpay_payment_id or not razorpay_order_id or not razorpay_signature:
            return JsonResponse({"error": "Missing payment details"}, status=400)

        client = razorpay.Client(auth=("rzp_test_6b8dLoMFlQOROE", "cWTmuq2mTfiSTzsZW0uWv56f"))

        try:
            # Verify signature
            client.utility.verify_payment_signature({
                'razorpay_order_id': razorpay_order_id,
                'razorpay_payment_id': razorpay_payment_id,
                'razorpay_signature': razorpay_signature
            })
            return JsonResponse({"status": "Payment verified successfully"})
        except razorpay.errors.SignatureVerificationError:
            return JsonResponse({"error": "Signature verification failed"}, status=400)

    return JsonResponse({"error": "Invalid request"},status=400)

#############++++  quiz result save api ++++++#############
@api_view(['POST'])
def save_quiz_result(request):
    student_email = request.data.get('email')
    course_name = request.data.get('course_name')
    chapter_name = request.data.get('chapter_name')
    score= request.data.get('score')
    print(student_email, course_name, chapter_name, score)
    if not student_email or not course_name or not chapter_name or score is None:
        return Response({"error": "Email, course_name, chapter_name and score are required"}, status=400)
    try:
        student_instance = student.objects.get(email=student_email)
        course_instance = course.objects.get(name=course_name)
        chapter_instance = Chapter.objects.get(title=chapter_name, course=course_instance)
    except student.DoesNotExist:
        return Response({"error": "Student not found"}, status=404)
    except course.DoesNotExist:
        return Response({"error": "Course not found"}, status=404)
    except Chapter.DoesNotExist:
        return Response({"error": "Chapter not found"}, status=404)
    try:
        quiz_result = QuizResult.objects.create(
            student=student_instance,
            course=course_instance,
            chapter=chapter_instance,
            score=score
        )
        quiz_result.save()
        return Response({"message": "Quiz result saved successfully"}, status=201)
    except Exception as e:
        print(e)
        return Response({"error": "Failed to save quiz result"}, status=500)
   
#################################################################################################################
#********** Student Dashboard API **********#########################****************############################
#################################################################################################################


@api_view(['GET'])
def student_dashboard(request):
    student_email = request.query_params.get('email')
    print(f"Requested email: {student_email}")

    if not student_email:
        return Response({"error": "Email parameter is required"}, status=400)

    try:
        student_instance = student.objects.get(email=student_email)
    except student.DoesNotExist:
        return Response({"error": "Student not found"}, status=404)

    # Now you trust the email. Optionally, validate token here.

    courses = courseenrollement.objects.filter(student=student_instance)
    certificateissue = Certificate.objects.filter(student=student_instance)
    total_courses = courses.count()
    completed_courses = courses.filter(completed=True).count()
    not_completed = total_courses - completed_courses
    certificate_gained=0
    if certificateissue:
        certificate_gained=certificateissue.count()
   
    course_details = [
    {
        'course_id': ce.course.id,
        'course_name': ce.course.name,
        'course_description': ce.course.description,
        'course_image': ce.course.image if ce.course.image else None,
    } for ce in courses
]

    attendance_records = Attendance.objects.filter(student=student_instance, present=True)
    attendance_dates = [att.date.isoformat() for att in attendance_records]
    activities = LMSActivity.objects.filter(student=student_instance)
    hours_by_date = {}
    for activity in activities:
        date_str = activity.date.strftime('%Y-%m-%d')
        hours_by_date[date_str] = hours_by_date.get(date_str, 0) + activity.hours_spent

    return Response({
        "student": {
            "name": student_instance.name,
            "email": student_instance.email,
            "id": student_instance.id,
            "profile_img": student_instance.profile_img if student_instance.profile_img else None,
            "department":student_instance.department,
            "university":student_instance.university.name
        },
        "courses": {
            "total": total_courses,
            "completed": completed_courses,
            "not_completed": not_completed,
            "course_details": course_details,
            'certificate_gained':certificate_gained,
        },
        "attendance": attendance_dates,
        "hours_spent": hours_by_date,
    })
   
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def save_attendance(request):
    serializer = AttendanceSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        print("attendence saved")
        return Response({'message': 'Attendance saved successfully'}, status=status.HTTP_201_CREATED)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def save_lms_activity(request):
    serializer = LMSActivitySerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'LMS activity saved successfully'}, status=status.HTTP_201_CREATED)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
   

@api_view(['GET'])
def student_courseenrollement_progress_view(request):
   student_email = request.GET.get('email')
   course_id = request.GET.get('course_id')
   print(student_email, course_id)
   if not student_email:
        print("Email parameter is missing")
        return Response({"error": "Email parameter is required"}, status=400)
   try:
        students = student.objects.get(email=student_email)
        if not students:
            return Response({"error": "Student not found or unauthorized"}, status=404)
        course_details = course.objects.get(id=course_id)
        if not course_details:
            return Response({"error": "Course not found"}, status=404)
   except student.DoesNotExist:
        return Response({"error": "Student not found"}, status=404)
   except course.DoesNotExist:
        return Response({"error": "Course not found"}, status=404)
   except Exception as e:
        return Response({"error": str(e)}, status=500)
   try:
        course_enrollment = courseenrollement.objects.create(student=students, course=course_details,enrolled=True)
        course_enrollment.save()
        return Response({"message": "Course enrollment created successfully"}, status=201)
   except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(['GET'])
def check_enrollment_status(request):
    student_email = request.query_params.get('email')
    course_id = request.query_params.get('course_id')

    if not student_email or not course_id:
        return Response({"error": "Both email and course_id are required"}, status=400)
    try:
        student_obj = student.objects.get(email=student_email)
        course_obj = course.objects.get(id=course_id)
    except student.DoesNotExist:
        return Response({"error": "Student not found"}, status=404)
    except course.DoesNotExist:
        return Response({"error": "Course not found"}, status=404)

    try:
        enrollment = courseenrollement.objects.filter(student=student_obj, course=course_obj).first()
        enrolled_status = enrollment.enrolled if enrollment else False
        return Response({"enrolled": enrolled_status}, status=200)
    except Exception as e:
        return Response({"error": str(e)}, status=500)
   
@api_view(['POST'])
def complete_course(request):
    student_email = request.data.get('email')
    course_id = request.data.get('course_id')
    if not student_email or not course_id:
        return Response({"error": "Both email and course_id are required"}, status=400)
    try:
        student_obj = student.objects.get(email=student_email)
        course_obj = course.objects.get(id=course_id)
    except student.DoesNotExist:
        return Response({"error": "Student not found"}, status=404)
    except course.DoesNotExist:
        return Response({"error": "Course not found"}, status=404)
    try:
        enrollment = courseenrollement.objects.filter(student=student_obj, course=course_obj).first
        enrollment.completed = True
        enrollment.save()
        return Response({"message": "Course marked as completed"}, status=200)
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(['GET'])
def course_progress(request):
    student_email = request.query_params.get('email')
    course_id = request.query_params.get('course_id')
   
    if not student_email or not course_id:
        return Response({"error": "Both email and course_id are required"}, status=400)
    try:
        student_obj = student.objects.get(email=student_email)
        course_obj = course.objects.get(id=course_id)
    except student.DoesNotExist:
        return Response({"error": "Student not found"}, status=404)
    except course.DoesNotExist:
        return Response({"error": "Course not found"}, status=404)
    try:
        completed = courseenrollement.objects.filter(student=student_obj, course=course_obj, completed=True).exists()
        if completed:
            return Response({"completed": True}, status=200)
        else:
            return Response({"completed": False}, status=200)
    except Exception as e:
        return Response({"error": str(e)}, status=500)


from django.http import Http404
from django.core.mail import EmailMessage
import uuid



@csrf_exempt
@api_view(['POST'])
def create_certificate_api(request):
    email = request.data.get('email')
    course_name = request.data.get('course')
    print(email)
    print(course_name)

    if not email or not course_name:
        return HttpResponse("Missing email or course name", status=400)

    try:
        student_instance = student.objects.get(email=email)
    except student.DoesNotExist:
        raise Http404("Student not found")

    try:
        course_instance = course.objects.get(name=course_name)
    except course.DoesNotExist:
        raise Http404("Course not found")

    # Generate certificate image as ContentFile
    student_name = student_instance.name
    print(student_name)
    certificate_file = generate_certificate_image(student_name, course_instance)

    # Create and save certificate model instance
    certificate = Certificate.objects.create(
        student=student_instance,
        course=course_instance,
        certificate_image=certificate_file,
    )
    certificate.certificate_image.save(certificate_file.name, certificate_file)
    certificate.save()


    token = str(uuid.uuid4())
    verification_link = f"http://127.0.0.1:8000/api/createcertificate/{token}/"
    print ("verification_link:", verification_link)




    email_subject=f"Your Certificate of Completion - {course_name}"
    email_body = f"""Dear {student_name},
    We are pleased to infrom you that you have successfully completed the course - {course_name}.
    
    You can access , Verify and Share Your Certificate Online using the following Link :
    {verification_link}

    Congratulations on Your Achievement..! We wish you continued Success in Your Learning Journey

    Best regards,
    Scopik EduTech Team """


    email_message = EmailMessage(
        subject=email_subject,
        body=email_body,
        from_email='your_email@gmail.com',
        to=[email],
        )
    # email_message.attach_file(certificate_file.name, content_type='image/jpeg')
    email_message.send()
    # return HttpResponse("Certificate created successfully", status=201)




    # Return the saved image as response
    response = HttpResponse(certificate_file,content_type='image/jpeg')
    response['Content-Disposition'] = f'attachment; filename="{certificate_file.name}"'
    return Response({'message':"Certificate created successfully"}, status=201)






@api_view(['GET'])
def verify_Certificate(request, token):
    try:
        verification = Certificate.objects.get(token=token)
        verification.is_verified = True
        verification.save()
        return Response({'message':"Certificate verified successfully"}, status=200)
    except Certificate.DoesNotExist:
        return Response({'message':"Certificate not found"}, status=404)




@api_view(['GET'])
def Certificate_views(request):
    email = request.GET.get('email')
    course_name = request.GET.get('course')
    print(email)
    print(course_name)
    try:
        student_instance = student.objects.get(email=email)
        course_instance = course.objects.get(name=course_name)
        certificate = Certificate.objects.get(student=student_instance, course=course_instance)
        print(certificate)
        return Response({
            "certificate": certificate.certificate_image.url
        })
    except Exception as e:
        print(e)
        return Response({"error": str(e)}, status=500)
   

@api_view(['GET'])
def Certficateviewuser(request):
    email = request.GET.get('email')
    print(email)
    students_instance = student.objects.filter(email=email).first()
    print(students_instance)
   
    if students_instance:
        certificate_instance = Certificate.objects.filter(student=students_instance).first()
        data = {
            'certificate': certificate_instance.certificate_image.url if certificate_instance else None
        }
    else:
        data = {
            'error': 'Student not found.'
        }

    return Response(data)

from django.http import FileResponse, Http404

@api_view(['GET'])
def view_certificate_api(request):
    email = request.GET.get('email')
    course_name = request.GET.get('course')

    print(f"Email: {email}")
    print(f"Course: {course_name}")

    if not email or not course_name:
        return Response({"error": "Missing email or course name"}, status=400)

    try:
        student_instance = student.objects.get(email=email)
        course_instance = course.objects.get(name=course_name)

        certificate = Certificate.objects.filter(student=student_instance, course=course_instance).first()

        if certificate and certificate.certificate_image:
            return FileResponse(certificate.certificate_image.open(), content_type='image/jpeg')
        else:
            return Response({"error": "Certificate not found"}, status=404)

    except student.DoesNotExist:
        return Response({"error": "Student not found"}, status=404)
    except course.DoesNotExist:
        return Response({"error": "Course not found"}, status=404)
    except Exception as e:
        print(f"Unexpected error: {e}")
        return Response({"error": str(e)}, status=500)


from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Certificate_template, course
from django.http import Http404

@api_view(['POST'])
def add_template_course(request):
    course_name = request.data.get('course_name')
    is_default = request.data.get('is_default', False)
    template_file = request.FILES.get('image')  # Correct: FILES not FILE

    if not template_file:
        return Response({"error": "Template image file is required."}, status=400)

    if is_default:
        is_default = str(is_default).lower() == 'true'  # Convert string to bool

    if is_default:
        # If setting default template, unset previous default
        Certificate_template.objects.filter(is_default=True).update(is_default=False)
       
        Certificate_template.objects.create(
            file=template_file,
            is_default=True
        )
        return Response({"message": "Default template added successfully."}, status=201)

    if not course_name:
        return Response({"error": "Course name is required if not default template."}, status=400)

    try:
        course_instance = course.objects.get(name=course_name)
    except course.DoesNotExist:
        raise Http404("Course not found.")

    Certificate_template.objects.create(
        file=template_file,
        course=course_instance,
        is_default=False
    )
    return Response({"message": f"Template added successfully for course '{course_name}'."}, status=201)

@api_view(['POST'])
def course_status_create(request):
    student_email = request.data.get('email')
    course_name = request.data.get('course')
    chapter_data = request.data.get('chapter')  # List of dicts: [{chapter_title, status}, ...]

    print("Incoming payload:", student_email, course_name, chapter_data)

    # Get student instance
    try:
        student_instance = student.objects.get(email=student_email)
    except student.DoesNotExist:
        return Response({'error': 'student not found'}, status=404)

    # Get course instance
    try:
        course_instance = course.objects.get(name=course_name)
    except course.DoesNotExist:
        return Response({'error': 'course not found'}, status=404)

    # Validate chapter_data
    if not isinstance(chapter_data, list):
        return Response({'error': 'Invalid chapter data format'}, status=400)

    for item in chapter_data:
        chapter_title = item.get('chapter_title')
        status = item.get('status')

        try:
            chapter_instance = Chapter.objects.get(title=chapter_title)
        except Chapter.DoesNotExist:
            return Response({'error': f'Chapter "{chapter_title}" not found'}, status=404)

        try:
            course_chapter_status.objects.create(
                student=student_instance,
                course=course_instance,
                chapter=chapter_instance,
                status=status
            )
        except Exception as e:
            return Response({'error': f'Failed to create status for chapter "{chapter_title}": {str(e)}'}, status=500)

    return Response({'message': 'Course status created for all chapters'}, status=201)

@api_view(['GET'])
def course_status_view(request):
    student_email = request.query_params.get('email')
    course_name = request.query_params.get('course')
    print(student_email,course_name)

    # Validate student
    try:
        student_instance = student.objects.get(email=student_email)
    except student.DoesNotExist:
        return Response({'error': 'Student not found'}, status=404)

    # Validate course
    try:
        course_instance = course.objects.get(name=course_name)
    except course.DoesNotExist:
        return Response({'error': 'Course not found'}, status=404)
    print(course_instance.total_chap)
    # Get all chapter statuses for the student in the course
    status_instances = course_chapter_status.objects.filter(
        student=student_instance,
        course=course_instance
    ).select_related('chapter')  # optimize query
    # Build response
    chapter_data = []
    for status in status_instances:
        chapter_data.append({
            'chapter_title': status.chapter.title,
            'status': status.status
            
        })

    response_data = {
        'student': student_instance.name,
        'course': course_instance.name,
        'chapters': chapter_data,
        'total':course_instance.total_chap,
        
    }

    return Response(response_data, status=200)

############################################################################################################################
#########********* Admin Dashboard API *********############################################################################
############################################################################################################################

############ ADD COURSE API ############
@api_view(['POST'])
def add_course(request):
    if request.method == 'POST':
        try:
            course_name = request.data.get('name')
            course_description = request.data.get('description')
            course_image = request.data.get('image')  
            total_chapter = request.data.get('total_chap')
            duration = request.data.get('duration')
            price = request.data.get('price')
            background_image = request.data.get('background_image')
            category_names = request.data.get('categories', [])

            if not isinstance(category_names, list):
                return Response({'error': 'Categories must be a list of names.'}, status=400)
            category_instances = course_category.objects.filter(name__in=category_names)
            if not category_instances.exists():
                return Response({'error': 'No matching categories found.'}, status=400)

            with transaction.atomic():
                new_course = course.objects.create(
                    name=course_name,
                    description=course_description,
                    image=course_image,
                    total_chap=total_chapter,
                    duration=duration,
                    price=price,
                    background_image=background_image,
                )
                new_course.categories.set(category_instances)

            return Response({'message': 'Course added successfully'}, status=201)

        except Exception as e:
            print("Error:", str(e))
            return Response({'error': 'Error occurred while adding course'}, status=400)

@api_view(['PUT'])
def update_course(request, name):
    try:
        decoded_name = unquote(name)
        course_obj = course.objects.get(name=decoded_name)
        new_name = request.data.get('name')
        if new_name:
            course_obj.name = new_name
        description = request.data.get('description')
        if description:
            course_obj.description = description

        total_chap = request.data.get('total_chap')
        if total_chap is not None:
            try:
                course_obj.total_chap = int(total_chap)
            except ValueError:
                return Response({'error': 'total_chap must be an integer.'}, status=400)

        duration = request.data.get('duration')
        if duration is not None:
            try:
                course_obj.duration = int(duration)
            except ValueError:
                return Response({'error': 'duration must be an integer.'}, status=400)

        price = request.data.get('price')
        if price is not None:
            try:
                course_obj.price = int(price)
            except ValueError:
                return Response({'error': 'price must be an integer.'}, status=400)
        image = request.data.get('image')
        if image:
            course_obj.image = image
        background_image = request.data.get('background_image')
        if background_image:
            course_obj.background_image = background_image
        categories = request.data.get('categories')
        if categories is not None:
            if not isinstance(categories, list):
                return Response({'error': 'categories must be a list.'}, status=400)
            category_objs = course_category.objects.filter(name__in=categories)
            course_obj.categories.set(category_objs)
        trending = request.data.get('trending_course')
        if trending is not None:
            course_obj.trending_course = str(trending).lower() in ['true', '1', 'yes']

        paid = request.data.get('paid')
        if paid is not None:
            course_obj.paid = str(paid).lower() in ['true', '1', 'yes']

        ratings = request.data.get('ratings')
        if ratings is not None:
            try:
                course_obj.ratings = float(ratings)
            except ValueError:
                return Response({'error': 'ratings must be a number.'}, status=400)

        course_obj.save()

        return Response({'message': 'Course updated successfully'}, status=status.HTTP_200_OK)

    except course.DoesNotExist:
        return Response({'error': 'Course not found'}, status=status.HTTP_404_NOT_FOUND)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
   

@api_view(['GET'])
def display_course(request):
    if request.method == 'GET':
        try:
            courses = course.objects.all()
            serializer = courseSerializer(courses, many=True)
            return Response(serializer.data, status=200)
        except Exception as e:
            print("Error:", str(e))
            return Response({'error': 'Error occurred while displaying courses'}, status=400)

@api_view(['DELETE'])
def delete_course(request, name):
    try:
        courses = course.objects.get(name=name)
        print(name)
        courses.delete()
        return Response({'message': 'Course deleted'}, status=status.HTTP_204_NO_CONTENT)
    except course.DoesNotExist:
        return Response({'error': 'Course not found'}, status=status.HTTP_404_NOT_FOUND)

########## ********* Category API *********##########

@api_view(['POST'])
def Create_category(request):
    category_name = request.data.get('category_name')
    category_image = request.data.get('images')
    print(category_name)
    if not category_name:
        return Response({"error": "Both category_name and category_description are required"}, status=400)
    try:
        course_category.objects.get(name=category_name)
        return Response({"error": "Category already exists"}, status=400)
   
    except course_category.DoesNotExist:
        category = course_category.objects.create(name=category_name,image=category_image)
        category.save()
       
        return Response({"message": "Category created"}, status=200)
    except Exception as e:
        print(e)
        return Response({"error": "Category already exists"}, status=400)

@api_view(['PUT'])
def Update_category(request, name):
    try:
        category = course_category.objects.get(name=name)
        category.name = request.data.get('category_name', category.name)
        category.image = request.data.get('images', category.image)
        category.save()
        return Response({"message": "Category updated"}, status=200)
    except course_category.DoesNotExist:
        return Response({"error": "Category not found"}, status=404)
    except Exception as e:
        print(e)
        return Response({"error": "Error occurred while updating category"}, status=500)
   

@api_view(['DELETE'])
def Delete_category(request, name):
    try:
        category = course_category.objects.get(name=name)
    except course_category.DoesNotExist:
        return Response({"error": "Category not found"}, status=404)
    category.delete()
    return Response({"message": "Category deleted successfully"}, status=200)

###************ Chapter API *********#######

@api_view(['POST'])
def create_chapter(request):
    chapter_name = request.data.get('title')
    # chapter_type = request.data.get('chapter_type')
    course_name = request.data.get('course')
    print(chapter_name,course_name)
    if not chapter_name or not course_name:
        return Response({"error": "Both chapter_name, chapter_description and course_id are required"}, status=400)
    try:
        # Get course instance by name
        course_instance = course.objects.get(id=course_name)
        chapters = Chapter.objects.create(title=chapter_name,course=course_instance)
        chapters.save()
        return Response({"message": "Chapter created successfully"}, status=201)
    except course.DoesNotExist:
        print(e)
        return Response({"error": "Course not found"}, status=404)
    except Exception as e:
        print(e)
        return Response({"error": str(e)}, status=500)

@api_view(['PUT'])
def Update_chapter(request, name):
    print(name)
    try:
        chapter_obj = Chapter.objects.get(title=name)
        print(chapter_obj.title,chapter_obj.course)
    except Chapter.DoesNotExist:
        print("chapter not found")
        return Response({"error": "Chapter not found"}, status=404)
    chapter_name = request.data.get('chapter_name', chapter_obj.title)
    course_identifier = request.data.get('course_name', chapter_obj.course)
    if not chapter_name or not course_identifier:
        return Response({"error": "Both chapter_name and course_name are required"}, status=400)
    try:
        if str(course_identifier).isdigit():
            course_instance = course.objects.get(id=int(course_identifier))
        else:
            course_instance = course.objects.get(name=course_identifier)
    except course.DoesNotExist:
        print("course not found")
        return Response({"error": "Course not found"}, status=404)
    chapter_obj.title = chapter_name
    chapter_obj.course = course_instance
    chapter_obj.save()
    return Response({"message": "Chapter updated successfully"}, status=200)


@api_view(['DELETE'])
def Delete_chapter(request, name):
    try:
        chapters = Chapter.objects.get(title=name)
        print(chapters)
    except Chapter.DoesNotExist:
        return Response({"error": "Chapter not found"}, status=404)
    chapters.delete()
    return Response({"message": "Chapter deleted successfully"}, status=200)

############ ********* Video API *********############
@api_view(['POST'])
def Create_video(request):
    video_name = request.data.get('video_name')
    video = request.data.get('video')
    chapter_name = request.data.get('chapter_name')
    print(video_name,video,chapter_name)

    if not video_name or not video or not chapter_name:
        return Response(
            {"error": "video_name, video, and chapter_name are required."},
            status=400
        )
    try:
        chapter_instance = Chapter.objects.get(title=chapter_name)
   
    except Chapter.DoesNotExist as msg:
        print(msg)
        return Response({"error": "Chapter not found."}, status=404)
    except Exception as e:
        print(e)
        return Response({"error": str(e)}, status=500)

    try:
        video_instance = course_video(
            video=video,
            video_name=video_name,
            chapter=chapter_instance
        )
        video_instance.save()
        return Response({"message": "Video created successfully."}, status=201)
    except Exception as e:
        print(e)
        return Response({"error": str(e)}, status=500)

@api_view(['PUT'])
def Update_video(request, name):
    try:
        video = course_video.objects.get(id=pk)
    except course_video.DoesNotExist:
        return Response({"error": "Video not found"}, status=404)
    video_name = request.data.get('video_name')
    video = request.FILES.get('video')
    chapter_name = request.data.get('chapter_name')
    try:
        chapter = Chapter.objects.get(title=chapter_name)
    except Chapter.DoesNotExist:
        return Response({"error": "Chapter not found"}, status=404)
    if not video_name or not video or not chapter_name:
        return Response({"error": "Both video_name, video and chapter_name are required"}, status=
                        400)
    video_instance = course_video.objects.filter(id=pk)
    video_instance.video = video
    video_instance.title = video_name
    video_instance.chapter = chapter
    video_instance.save()
    return Response({"message": "Video updated successfully"}, status=200)

@api_view(['DELETE'])
def Delete_video(request, name):
    try:
        video_instance = course_video.objects.get(id=pk)
    except course_video.DoesNotExist:
        return Response({"error": "Video not found"}, status=404)
    video_instance.delete()
    return Response({"message": "Video deleted successfully"}, status=200)


############ ********* Document API *********############
@api_view(['POST'])
def Create_document (request):
    document_name = request.data.get('document_name')
    document = request.data.get('document')
    chapter_name = request.data.get('chapter_name')
    print(document_name,document,chapter_name)
    try:
        chapter_instance = Chapter.objects.get(title=chapter_name)
    except Chapter.DoesNotExist:
        return Response({"error": "Chapter not found"}, status=404)
    if not document_name or not document or not chapter_name:
        return Response({"error": "Both document_name, document and chapter_name are required"}, status=400)
    document_instance = course_material.objects.create(material=document, material_name=document_name, chapter=chapter_instance)
    document_instance.save()
    return Response({"message": "Document created successfully"}, status=200)

@api_view(['PUT'])
def Update_document(request, name):
    try:
        document = course_material.objects.get(name=name)
    except course_material.DoesNotExist:
        return Response({"error": "Document not found"}, status=404)
    document_name = request.data.get('document_name')
    document = request.data.get('document')
    chapter_name = request.data.get('chapter_name')
    try:
        chapter_instance = Chapter.objects.get(title=chapter_name)
    except Chapter.DoesNotExist:
        return Response({"error": "Chapter not found"}, status=404)
    if not document_name or not document or not chapter_name:
        return Response({"error": "Both document_name, document and chapter_name are required"}, status=
                        400)
    document.title = document_name
    document.document = document
    document.chapter = chapter_instance
    document.save()
    return Response({"message": "Document updated successfully"}, status=200)
   
@api_view(['DELETE'])
def Delete_document(request, name):
    try:
        document = course_material.objects.get(str=str)
    except course_material.DoesNotExist:
        return Response({"error": "Document not found"}, status=404)
    document.delete()
    return Response({"message": "Document deleted successfully"}, status=200)

############# ********* Text Content API *********############
@api_view(['POST'])
def create_textconntent(request):
    text_content = request.data.get('text_content')
    chapter_name = request.data.get('chapter_name')
    print(text_content,chapter_name)
    try:
        chapter_instance = Chapter.objects.get(title=chapter_name)
    except Chapter.DoesNotExist:
        return Response({"error": "Chapter not found"}, status=404)
    if not text_content or not chapter_name:
        return Response({"error": "Both text_content and chapter_name are required"}, status=400)
    text_content_instance = course_textcontent.objects.create(textcontent=text_content, chapter=chapter_instance)
    text_content_instance.save()
    return Response({"message": "Text content created successfully"}, status=200)

@api_view(['PUT'])
def update_textconntent(request,name):
    try:
        text_content_instance = course_textcontent.objects.get(name=name)
    except course_textcontent.DoesNotExist:
        return Response({"error": "Text content not found"}, status=404)
    text_content = request.data.get('text_content')
    chapter_name = request.data.get('chapter_name')
    try:
        chapter_instance = Chapter.objects.get(title=chapter_name)
    except Chapter.DoesNotExist:
        return Response({"error": "Chapter not found"}, status=404)
    if not text_content or not chapter_name:
        return Response({"error": "Both text_content and chapter_name are required"}, status=400)
    text_content_instance.text = text_content
    text_content_instance.chapter = chapter_instance
    text_content_instance.save()
    return Response({"message": "Text content updated successfully"}, status=200)

@api_view(['DELETE'])
def Delete_textconntent(request, name):
    try:
        text_content_instance = course_textcontent.objects.get(name = name)
    except course_textcontent.DoesNotExist:
        return Response({"error": "Text content not found"}, status=404)
    text_content_instance.delete()
    return Response({"message": "Text content deleted successfully"}, status=200)


############## ********* Quiz API *********############
@api_view(['POST'])
def create_quiz(request):
    if request.method == 'POST':
        chapter_id = request.data.get('chapter')
        question = request.data.get('question')
        option1 = request.data.get('option1')
        option2 = request.data.get('option2')
        option3 = request.data.get('option3')
        option4 = request.data.get('option4')
        correct_indices = request.data.get('correct_option')
        print(chapter_id, question, option1, option2, option3, option4, correct_indices)

        chapter = Chapter.objects.get(id=chapter_id)

        quiz = Quiz.objects.create(
            chapter=chapter,
            question_text=question,
            option1=option1,
            option2=option2,
            option3=option3,
            option4=option4,
            correct_options=correct_indices
        )
    quiz.save()
    return Response({"message": "Quiz created successfully"}, status=200)

@api_view(['PUT'])
def update_quiz(request,name):
    try:
        quiz = Quiz.objects.get(str=str)
    except Quiz.DoesNotExist:
        return Response({"error": "Quiz not found"}, status=404)
    quiz.chapter = request.data.get('chapter')
    quiz.text = request.data.get('question')
    quiz.option1 = request.data.get('option1')
    quiz.option2 = request.data.get('option2')
    quiz.option3 = request.data.get('option3')
    quiz.option4 = request.data.get('option4')
    quiz.correct_answer = request.data.get('correct_option')
    quiz.save()
    return Response({"message": "Quiz updated successfully"}, status=200)

@api_view(['DELETE'])
def Delete_quiz(request, name):
    try:
        quiz = Quiz.objects.get(name=name)
    except Quiz.DoesNotExist:
        return Response({"error": "Quiz not found"}, status=404)
    quiz.delete()
    return Response({"message": "Quiz deleted successfully"}, status=200)

###### ********* Admin Dashboard API *********######
@api_view(['GET'])
def admin_dashboard(request):

    total_student = student.objects.count()
    total_course = course.objects.count()
    total_university = University.objects.count()
   
    data={
        'total_student':total_student,
        'total_course':total_course,
        'total_university':total_university
    }

    return Response(data)

###### ********* University API *********######
@api_view(['POST'])
def add_university(request):
        name = request.data.get('name')
        email = request.data.get('email')
        address = request.data.get('address')
        password = request.data.get('password')
        logo =  request.data.get('logo')
        university = University(name=name, email=email, address=address, password=password, logo=logo)
        university.save()
        return Response({'message': 'University added successfully'}, status=201)

@api_view(['PUT'])
def update_university(request, name):
    try:
        university = University.objects.get(name=name)
    except University.DoesNotExist:
        return Response({"error": "University not found"}, status=404)
   
    name = request.data.get('name', university.name)
    email = request.data.get('email', university.email)
    address = request.data.get('address', university.address)
    password = request.data.get('password', university.password)
    logo = request.data.get('logo', university.logo)

    print(name,email,address,password,logo)

    university.name = name
    university.email = email
    university.address = address
    university.password = password
    university.logo = logo
    university.save()
   
    return Response({"message": "University updated successfully"}, status=200)

@api_view(['DELETE'])
def delete_university(request, name):
    try:
        university = University.objects.get(name=name)
    except University.DoesNotExist:
        return Response({"error": "University not found"}, status=404)
   
    university.delete()
    return Response({"message": "University deleted successfully"}, status=200)

@api_view(['POST'])
def assign_university_create(request):
    university_name = request.data.get("university")
    course_name = request.data.get("course")
    try:
        university = University.objects.get(name=university_name)
    except University.DoesNotExist:
        return Response({"error": "University not found"}, status=404)
    try:
        courses = course.objects.get(name=course_name)
    except course.DoesNotExist:
        return Response({"error": "Course not found"}, status=404)
    if assign_university.objects.filter(university=university, course=courses).exists():
        return Response(
            {"message": "This course is already assigned to the university"},
            status=status.HTTP_208_ALREADY_REPORTED
        )
    university_assign = assign_university.objects.create(
        university=university,
        course=courses
    )
    return Response({"message": "University assigned successfully"}, status=200)

@api_view(['DELETE'])
def assign_university_delete(request, name):
    try:
        university_assign = assign_university.objects.get(name=name)
    except assign_university.DoesNotExist:
        return Response({"error": "University assignment not found"}, status=404)
   
    university_assign.delete()
    return Response({"message": "University assignment deleted successfully"}, status=200)

###############################################################################################################
#********************************UNIVERSITY  Dashboard ******* API *******************************************#
###############################################################################################################
@api_view(['GET'])
def University_dashboard(request):
    try:
        university_email = request.query_params.get('email')
        print(university_email)
        university = University.objects.get(email=university_email)
    except University.DoesNotExist:
        return Response({"error": "University not found"}, status=404)
   
    university_name = university.name
    university_logo = university.logo if university.logo else None
    university_address = university.address
    total_student = student.objects.filter(university=university).count()
    total_faculty = teacher.objects.filter(university=university).count()
    total_course = assign_university.objects.filter(university=university).count()
    total_student_1st_year = student.objects.filter(university=university, academicYear='1').count()
    total_student_2nd_year = student.objects.filter(university=university, academicYear='2').count()
    total_student_3rd_year = student.objects.filter(university=university, academicYear='3').count()

    data = {
        'university_name': university_name,
        'university_logo': university_logo,
        'university_address': university_address,
        'total_student': total_student,
        'total_faculty': total_faculty,
        'total_course':total_course,
        'student_first_year': total_student_1st_year,
        'student_second_year': total_student_2nd_year,
        'student_third_year': total_student_3rd_year
    }
    return Response(data)
@api_view(['POST'])
def assign_course_to_faculty(request):
    try:
        faculty_email = request.data.get('faculty_email')
        course_names = request.data.get('course_name', [])
        university_name = request.data.get('university')
        print(faculty_email,university_name,course_names)
        if not isinstance(course_names, list):
            return Response({'error': 'course_name must be a list of course names.'}, status=400)
        if not faculty_email or not university_name:
            return Response({'error': 'faculty_email and university are required.'}, status=400)
        try:
            faculty_instance = teacher.objects.get(email=faculty_email)
        except teacher.DoesNotExist:
            return Response({'error': 'Faculty with this email does not exist.'}, status=404)
        try:
            university_instance = University.objects.get(name=university_name)
        except University.DoesNotExist:
            return Response({'error': 'University with this name does not exist.'}, status=404)
        course_instances = course.objects.filter(name__in=course_names)
        if course_instances.count() != len(course_names):
            return Response({'error': 'Some course names do not exist.'}, status=400)
        existing_assignment = course_to_faculty.objects.filter(
            university=university_instance,
            faculty=faculty_instance,
            course__in=course_instances
        ).first()
        if existing_assignment:
            return Response({'message': 'One or more courses already assigned to this faculty.'},
                            status=status.HTTP_208_ALREADY_REPORTED)
        with transaction.atomic():
            new_course_faculty = course_to_faculty.objects.create(
                university=university_instance,
                faculty=faculty_instance
            )
            new_course_faculty.course.set(course_instances)  

        return Response({'message': 'Courses assigned to faculty successfully.'}, status=200)

    except Exception as e:
        return Response({'error': str(e)}, status=400)


@api_view(['GET'])
def uni_course_list(request):
    try:
        email = request.query_params.get('email')
        print(email)
        uni_obj= University.objects.get(email = email)
    except University.DoesNotExist:
        return Response({'error':'University not found'}, status=404)
    assignuni = assign_university.objects.filter(university = uni_obj)
    data=[]
    for course in assignuni:
        print(course.course.name)
        data.append({
            'course_name':course.course.name,
            'course_image':course.course.image if course.course.image else None,
        })
    return Response(data,status=200)

@api_view(['POST'])
def University_add_faculty(request):
    try:
        university_email = request.query_params.get('email')
        print(university_email)
        university = University.objects.get(email=university_email)
    except University.DoesNotExist:
        return Response({"error": "University not found"}, status=404)
   

@api_view(['GET'])
def get_faculty_university(request):
    try:
        university_email = request.query_params.get('email')
        print(university_email)
        university = University.objects.get(email=university_email)
    except University.DoesNotExist:
        return Response({"error": "University not found"}, status=404)
    teach = []
    faculties = teacher.objects.filter(university=university)
    fac_course=[]
    for tech in faculties:
        print(tech)
        ctf_records = course_to_faculty.objects.filter(faculty=tech)
        courses = []
        for ctf in ctf_records:
            courses.extend(list(ctf.course.all()))
            print("records",ctf)
        unique_courses = list(set(courses))

        print("course details",unique_courses)
        course_data = []
        for course in unique_courses:
            course_data.append({
                'id': course.id,
                'name': course.name,
                'description': course.description,
                'image': course.image if course.image else None,
            })

        teach.append({
            'name': tech.name,
            'email': tech.email,
            'department': tech.department,
            'course': course_data
        })
    return Response(teach, status=200)

@api_view(['GET'])
def get_student_university(request):
    try:
        university_email = request.query_params.get('email')
        print(university_email)
        university = University.objects.get(email=university_email)
    except University.DoesNotExist:
        return Response({"error": "University not found"}, status=404)
    students = student.objects.filter(university=university)
    data = []
    for stu in students:
        student_course = courseenrollement.objects.filter(student=stu)
        stu_course=[]
        for course in student_course:
            stu_course.append({
                'course_name': course.course.name,
                'course_id': course.course.id,
                'course_image': course.course.image if course.course.image else None,
            })
        print(stu_course)
  
        data.append({
            'name': stu.name,
            'email': stu.email,
            'department': stu.department,
            'academic_year': stu.academicYear,
            'profile_image': stu.profile_img if stu.profile_img else None,
            'courses': stu_course,
        })
    return Response(data, status=200)


@api_view(['DELETE'])
def delete_faculty(request):
    data = request.data
    select_all = data.get('select_all', False)
    selected_emails = data.get('selected_name', [])

    if select_all:
        count, _ = teacher.objects.all().delete()
        return Response({"message": f"All {count} faculty deleted"}, status=200)
    
    if selected_emails:
        faculties = teacher.objects.filter(email__in=selected_emails)  # email__in instead of name
        count = faculties.count()
        if count == 0:
            return Response({"error": "No matching faculty found"}, status=404)
        faculties.delete()
        return Response({"message": f"{count} selected faculty deleted"}, status=200)
    
    return Response({"error": "No faculty specified for deletion"}, status=400)

@api_view(['DELETE'])
def delete_student(request):
    data = request.data
    select_all = data.get('select_all', False)
    selected_emails = data.get('selected_name', [])  # Now this is email-based

    if select_all:
        count, _ = student.objects.all().delete()
        return Response({"message": f"All {count} student(s) deleted"}, status=200)

    if selected_emails:
        # safer to use email as a unique field
        students = student.objects.filter(email__in=selected_emails)
        count = students.count()

        if count == 0:
            return Response({"error": "No matching students found"}, status=404)

        students.delete()
        return Response({"message": f"{count} selected student(s) deleted"}, status=200)

    return Response({"error": "No students specified for deletion"}, status=400)
###############################################################################################################
#******************************** Teacher dashboard ******* API **********************************************#
###############################################################################################################

@api_view(['GET'])
def teacher_dashboard(request):
    try:
        teacher_email = request.query_params.get('email')
        teacher_instance = teacher.objects.get(email=teacher_email)
    except teacher.DoesNotExist:
        return Response({"error": "Teacher not found"}, status=404)

    try:
        teacher_dept = teacher_instance.department
        total_students = student.objects.filter(department=teacher_dept,university=teacher_instance.university).count()
        first_year_students = student.objects.filter(department=teacher_dept, academicYear='1',university=teacher_instance.university).count()
        second_year_students = student.objects.filter(department=teacher_dept, academicYear='2',university=teacher_instance.university).count()
        third_year_students = student.objects.filter(department=teacher_dept, academicYear='3',university=teacher_instance.university).count()
        ctf_records = course_to_faculty.objects.filter(faculty=teacher_instance)
        courses = []
        for ctf in ctf_records:
            courses.extend(list(ctf.course.all()))
        unique_courses = list(set(courses))
        course_names = [c.name for c in unique_courses]
        total_courses = 0
        for i in course_names:
            total_courses += 1

       
       
        data = {
            'teacher_name': teacher_instance.name,
            'teacher_email': teacher_instance.email,
            "phone":teacher_instance.phone_number if teacher_instance.phone_number else None,
            'teacher_img':teacher_instance.profile_img if teacher_instance.profile_img else None ,
            "teacher_department": teacher_instance.department,
            "teacher_university": teacher_instance.university.name if teacher_instance.university else None,
            'total_courses': total_courses,
            'total_students': total_students,
            'first_year_students': first_year_students,
            'second_year_students': second_year_students,
            'third_year_students': third_year_students
            }
        return Response(data)

    except Exception as e:
        print(e)
        return Response({"error": "something went wrong"}, status=505)

@api_view(['GET'])
def get_faculty_courses(request):
    try:
        faculty_email = request.query_params.get('email')
        print(faculty_email)
        faculty = teacher.objects.get(email=faculty_email)
    except teacher.DoesNotExist:
        return Response({"error": "Faculty not found"}, status=404)
    except Exception as e:
        print(e)
        return Response({"error": "An error occurred while fetching faculty courses"}, status=500)
    ctf_records = course_to_faculty.objects.filter(faculty=faculty)
    courses = []
    for ctf in ctf_records:
        courses.extend(list(ctf.course.all()))
    unique_courses = list(set(courses))
    print(unique_courses)
    print("this api")
    data = []
    for course in unique_courses:
        data.append({
            'id': course.id,
            'name': course.name,
            'description': course.description,
            'image': course.image if course.image else None,
        })
    return Response(data, status=200)


@api_view(['GET'])
def assigned_student_list(request):
    try:
        teacher_email = request.query_params.get('email')
        print(teacher_email)
        teachers = teacher.objects.get(email=teacher_email)
    except teacher.DoesNotExist:
        return Response({"error": "Teacher not found"}, status=404)
   
    students =student.objects.filter(department=teachers.department,university=teachers.university)
    student_list = []
    for stu in students:
        print("this api")
       
     
        student_course = courseenrollement.objects.filter(student=stu)
        stu_course=[]
        for course in student_course:
                stu_course.append({
                    'course_name': course.course.name,
                    'course_id': course.course.id,
                    'course_image': course.course.image if course.course.image else None,
        })
        print(stu.name)
        print(stu_course)
        
        student_info = {
                    'name': stu.name,
                    'email': stu.email,
                    'department': stu.department,
                    'university': stu.university.name if stu.university else None,
                    'academic_year': stu.academicYear,
                    'profile_image': stu.profile_img if stu.profile_img else None,
                    'courses': stu_course
                }
        print(student_info)
        student_list.append(student_info)
    return Response(student_list, status=200)


@api_view(['POST'])
def add_student_to_course(request):
    course_id = request.query_params.get('course_id')
    student_email = request.query_params.get('student_id')  # Actually email, so let's rename for clarity
    print(course_id, student_email)

    if not course_id or not student_email:
        return Response({"error": "course_id and student_id (email) are required"}, status=400)

    try:
        course_instance = course.objects.get(id=course_id)
    except course.DoesNotExist:
        return Response({"error": "Course not found"}, status=404)

    crs = course_to_faculty.objects.filter(course__id=course_id).first()
    if not crs:
        return Response({"error": "Course not assigned to faculty"}, status=404)

    try:
        stu = student.objects.get(email=student_email)
    except student.DoesNotExist:
        return Response({"error": "Student not found"}, status=404)

    try:
        enrollment, created = courseenrollement.objects.get_or_create(
            student=stu,
            course=course_instance,
        )
        if created:
            enrollment.enrolled = True
            enrollment.save()
            return Response({"message": "Student successfully added to course"}, status=200)
        else:
            return Response({"message": "Student already enrolled in course"}, status=208)
    except Exception as e:
        print(e)
        return Response({"error": f"Error adding student to course: {str(e)}"}, status=500)


############## LOGIN ####################

@api_view(['GET'])
def login_EMAIL_EXISTING(request):
    email = request.query_params.get('email')
    if not email:
        return Response({"error": "Email is required"}, status=400)


    models = [
        (student, ("Student exists", "student")),
        (teacher, ("Teacher exists", "Faculty")),
        (University, ("University exists", "University_admin")),
        (Superadmin, ("Admin exists", "Superadmin")),
    ]

    for model, (msg, usertype) in models:
        instance = model.objects.filter(email=email).first()
        if instance:
            return Response({"message": msg, "user_type": usertype, "name": instance.name, "email": instance.email}, status=200)

    return Response({"error": "Email does not exist"}, status=400)
   

###################### bulk the fields ##################
@api_view(['POST'])
def bulk_register_user(request):
    users = request.data.get('users', [])  # Expecting a list of user dicts
    if not isinstance(users, list) or not users:
        return Response({"error": "Invalid or empty users list"}, status=status.HTTP_400_BAD_REQUEST)
    print(users)
    response_data = {
        "success": [],
        "failed": []
    }

    for user in users:
        try:
            name = user.get('name')
            email = user.get('email')
            user_type = user.get('user_type')
            print('usertype:', user_type)

            if user_type == 'student':
                phone = user.get('phone')
                registerno = user.get('registerno')
                university = user.get('university')
                academicYear = user.get('academicYear')
                department = user.get('department')
            elif user_type == 'Faculty':
                phone = user.get('phone')
                department = user.get('department')
                university = user.get('university')
            else:
                response_data["failed"].append({"email": email, "reason": "Invalid user type"})
                continue

            model = student if user_type == 'student' else teacher

            if model.objects.filter(email=email).exists():
                response_data["failed"].append({"email": email, "reason": "User already exists"})
                continue

            university_instance = University.objects.get(name=university)

            token = str(uuid.uuid4())

            if user_type == 'student':
                student.objects.create(
                    name=name,
                    email=email,
                    phone_number=phone,
                    university=university_instance,
                    academicYear=academicYear,
                    registerno=registerno,
                    password_reset_token=token,
                    department=department
                )
            elif user_type == 'Faculty':
                teacher.objects.create(
                    name=name,
                    email=email,
                    phone_number=phone,
                    university=university_instance,
                    department=department,
                    password_reset_token=token
                )

            link = f"http://localhost:5173/set-password/{token}/{email}"
            send_mail(
                subject="Set your password",
                message=f"Hi {name}, click this link to set your password: {link}",
                from_email="noreply@yourapp.com",
                recipient_list=[email],
            )

            response_data["success"].append({"email": email})

        except University.DoesNotExist:
            response_data["failed"].append({"email": user.get('email'), "reason": "University not found"})
        except Exception as e:
            response_data["failed"].append({"email": user.get('email'), "reason": str(e)})

    return Response(response_data, status=status.HTTP_200_OK)




######################### reset password ################################


##################### SEM wise course ##############################

from datetime import datetime
@api_view(['POST'])
def create_semester(request):
    try:
        course_ids = request.data.get('course_ids', [])
        sem_number = request.data.get('sem')
        start_date_str = request.data.get('start_date')  
        department  = request.data.get('department')
        university_instance = request.data.get('university')
        print(
            course_ids,
            sem_number,
            department,
            university_instance,
            start_date_str
        )

        try:
            university = University.objects.get(name=university_instance)
        except University.DoesNotExist :
            return Response({'error': 'University does not exisit.'}, status=status.HTTP_400_BAD_REQUEST)

        if sem_number is None or start_date_str is None:
            return Response({'error': 'Semester number and start date are required.'}, status=status.HTTP_400_BAD_REQUEST)


        try:
            start_date = datetime.strptime(start_date_str, "%Y-%m-%d").date()
        except ValueError:
            return Response({'error': 'Invalid start date format. Use YYYY-MM-DD.'}, status=status.HTTP_400_BAD_REQUEST)


        semester = Semester.objects.create(sem=sem_number, start_date=start_date,department=department,university=university)


        if course_ids:
            courses = course.objects.filter(id__in=course_ids)
            semester.course.add(*courses)

        return Response({'message': 'Semester created successfully.', 'semester_id': semester.id}, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['PUT'])
def edit_semster(request, uni_name, name, sem):
    print(uni_name, name, sem)
    try:
        start_date_str = request.data.get('start_date')
        course_ids = request.data.get('course_ids', [])
        new_department = request.data.get('department')
        new_university = request.data.get('university')
        new_sem = request.data.get('sem')

        print(start_date_str, course_ids, new_department, new_university, new_sem)

        try:
            semester = Semester.objects.get(
                department=name,
                sem=sem,
                university__name=uni_name
            )
        except Semester.DoesNotExist:
            return Response(
                {'error': 'Semester not found for given university, department and semester.'},
                status=status.HTTP_404_NOT_FOUND
            )


        if start_date_str:
            try:
                start_date = datetime.strptime(start_date_str, "%Y-%m-%d").date()
                semester.start_date = start_date
            except ValueError:
                return Response(
                    {'error': 'Invalid start date format. Use YYYY-MM-DD.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

        if new_department:
            semester.department = new_department

 
        if new_university:
            try:
                from .models import University  # adjust import path
                uni_obj = University.objects.get(name=new_university)
                semester.University = uni_obj
            except University.DoesNotExist:
                return Response(
                    {'error': 'University not found.'},
                    status=status.HTTP_404_NOT_FOUND
                )

  
        if new_sem:
            semester.sem = new_sem

        semester.save()

        if course_ids:
            courses = course.objects.filter(id__in=course_ids)
            semester.course.set(courses)

        return Response({'message': 'Semester updated successfully.'}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def get_syllabus(request):
    department = request.query_params.get('department')
    try:
        semesters = Semester.objects.filter(department=department)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    data = []

    for sem in semesters:
        # Fetch unique course names for this semester
        course_names = list(sem.course.values_list('name', flat=True).distinct())
        
        data.append({
            'id': sem.id,
            'sem': sem.sem,
            'start_date': sem.start_date,
            'department': sem.department,
            'subjects': course_names
        })

    return JsonResponse(data, safe=False, status=status.HTTP_200_OK)
@api_view(['DELETE'])
def Delete_semster(request, uni_name, name, sem):
    
    try:
        university_instance = University.objects.get(name=uni_name)
    except University.DoesNotExist:
        return Response({'error': 'University not found.'}, status=status.HTTP_404_NOT_FOUND)
    try:
        semster_instance = Semester.objects.get(
            department=name,
            sem=sem,
            university=university_instance
        )
    except Semester.DoesNotExist:
        return Response({'error': 'Semester not found for given university, department and semester.'}, status=status.HTTP_404_NOT_FOUND)
    semster_instance.delete()
    return Response({'message': 'Semester deleted successfully.'}, status=status.HTTP_200_OK)



### blogs ############

##### api create blogs #############

@api_view(['POST'])
def create_blog_category(request):
    category_name = request.data.get('category_name')
    if not category_name:
        return Response({'error': 'category_name is required.'}, status=status.HTTP_400_BAD_REQUEST)    
    try:
        categorys_instance = blog_category.objects.create(Category=category_name)
        return Response({'message':'Blog category created successfully',})
    except Exception as e:
        return Response({'error':str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
@api_view(['PUT'])
def update_blog_category(request, name):
    try:
        category_instance = blog_category.objects.get(Category=name)
    except blog_category.DoesNotExist:
        return Response({"error": "Blog category not found"}, status=status.HTTP_404_NOT_FOUND)
    new_name = request.data.get('category_name')
    if not new_name:
        return Response({'error': 'category_name is required.'}, status=status.HTTP_400_BAD_REQUEST)
    category_instance.Category = new_name
    category_instance.save()
    return Response({'message': 'Blog category updated successfully'}, status=status.HTTP_200_OK)

@api_view(['DELETE'])
def delete_blog_category(request,name):
    try:
        category_instance = blog_category.objects.get(Category=name)
    except blog_category.DoesNotExist:
        return Response({"error": "Blog category not found"}, status=status.HTTP_404_NOT_FOUND)
    category_instance.delete()
    return Response({'message': 'Blog category deleted successfully'}, status=status.HTTP_200_OK)





@api_view(['POST'])
def create_blog(request):
    title = request.data.get('title')
    content = request.data.get('content')
    category = request.data.get('category') 
    image_urls = request.data.get('image_urls')  
    category = request.data.get('category')

    if not isinstance(image_urls, list):
        return Response({'error': 'image_urls must be a list of URLs.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        category_instance =blog_category.objects.get(Category=category)
    except blog_category.DoesNotExist:
        return Response({'error': f'{category} Category does not exist.'}, status=status.HTTP_404_NOT_FOUND)
    

    try:
        blog = Blog.objects.create(
            title=title,
            content=content,
            category=category_instance,
            image_urls=image_urls
        )
        return Response({'message': 'Blog created successfully'}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['DELETE'])
def delete_blog(request,name):
    try:
        blog_instance = Blog.objects.get(title=name)
    except Exception as e:
        return Response ({"err": (e),  },status=status.HTTP_400_BAD_REQUEST)
    blog_instance.delete()
    return Response({'message': 'Blog deleted successfully'}, status=status.HTTP_200_OK)

@api_view(['PUT'])
def update_blog(request, name):
    print(name)
    try:
        blog_instance = Blog.objects.get(title=name)
    except Blog.DoesNotExist:
        return Response({"error": "Blog not found"}, status=status.HTTP_404_NOT_FOUND)

    title = request.data.get('title')
    content = request.data.get('content')
    category_name = request.data.get('category')
    image_urls = request.data.get('image_urls')  # Expecting a list
    
    try:
        category_instance = blog_category.objects.get(Category=category_name)
    except blog_category.DoesNotExist:
        return Response({'error': 'Category does not exist.'}, status=status.HTTP_404_NOT_FOUND)
    
    

    if image_urls and not isinstance(image_urls, list):
        return Response({'error': 'image_urls must be a list of URLs.'}, status=status.HTTP_400_BAD_REQUEST)

    if title:
        blog_instance.title = title
    if content:
        blog_instance.content = content
    if image_urls:
        blog_instance.image_urls = image_urls

    if category_name:
        blog_instance.category= category_instance
    
    blog_instance.save()

    return Response({'message': 'Blog updated successfully'}, status=status.HTTP_200_OK)


   
#### course complete ##########
@api_view(['POST'])
def complete_course_api(request):
    course_name = request.data.get('course')
    student_name = request.data.get('email')
    print(course_name,student_name)
    try:
        course_instance = course.objects.get(name=course_name)
    except course.DoesNotExist:
        return Response({'error': 'Course not found'}, status=status.HTTP_404_NOT_FOUND)

    try:
        student_instance = student.objects.get(email=student_name)
    except student.DoesNotExist:
        return Response({'error': 'Student not found'}, status=status.HTTP_404_NOT_FOUND)

    try:
        course_enroll_instance = courseenrollement.objects.get(
            course=course_instance,
            student=student_instance
        )
    except courseenrollement.DoesNotExist:
        return Response({'error': 'Enrollment not found'}, status=status.HTTP_404_NOT_FOUND)

    if course_enroll_instance.completed:
        return Response({'message': 'Course already completed'}, status=status.HTTP_400_BAD_REQUEST)

    course_enroll_instance.completed = True
    course_enroll_instance.save()
    return Response({'message': 'Course completed successfully'}, status=status.HTTP_200_OK)

       
       
@api_view(['GET'])
def get_course_enrollments_api(request):
    course_name = request.query_params.get('course')
    student_name = request.query_params.get('email')
    try:
        course_instance = course.objects.get(name=course_name)
    except course.DoesNotExist:
        return Response({'error': 'Course not found'}, status=status.HTTP_404_NOT_FOUND)
    try:
        student_instance = student.objects.get(email=student_name)
    except student.DoesNotExist:
        return Response({'error': 'Student not found'}, status=status.HTTP_404_NOT_FOUND)
    course_enrollement_instance = courseenrollement.objects.get(
        course=course_instance,
        student=student_instance
    )
    print(course_enrollement_instance.completed)
   
    return Response({course_name:course_enrollement_instance.completed}, status=status.HTTP_200_OK)

### Certificate Template ###
@api_view(['POST'])
def create_certificate_template(request):
    file = request.FILES.get('file')
    course_name = request.data.get('course')
    default = request.data.get('default', 'false').lower() in ['true', '1', 'yes']

    if not file or not course_name:
        return Response({'error': 'File and course are required.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        course_instance = course.objects.get(name=course_name)
    except course.DoesNotExist:
        return Response({'error': 'Course not found'}, status=status.HTTP_404_NOT_FOUND)

    try:
        certificate_template = Certificate_template.objects.create(
            course=course_instance,
            is_default=default,
            file=file
        )
        return Response({'message': 'Certificate template created successfully'}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'error': 'Error creating certificate template'}, status=status.HTTP_400_BAD_REQUEST)
    

### **** ****   users profile edit     **** **** ###
@api_view(['PUT'])
def edit_user_profile(request,email):   
    user_email = email
    print(user_email)
    try:
        user = University.objects.get(email=user_email)
        name_instance = request.data.get('name')
        address_instance = request.data.get('address')
        logo_instance = request.data.get('logo')
        
        if name_instance or address_instance or logo_instance:  
            user.name = name_instance
            user.address = address_instance
            user.logo = logo_instance
            user.save()  
        else:
            print("Name parameter not provided in the request.")
        return Response({"message": "updated profile successfully"}, status=status.HTTP_200_OK)
    except University.DoesNotExist:
        pass

    try:
        user = teacher.objects.get(email=user_email)
        name_instance = request.data.get('name')
        phone_instance = request.data.get('phone')
        img_instance = request.data.get('profile_img')
        dept_instance = request.data.get('Department')
        qualification = request.data.get('qualification')
        profile_instance = request.data.get('profile_img')
        
        if name_instance or phone_instance or img_instance or dept_instance or qualification or profile_instance:  
            user.name = name_instance
            user.phone_number = phone_instance
            user.profile_img = img_instance
            user.department = dept_instance
            user.qualification = qualification
            user.profile_img = profile_instance
            user.save()  
        else:
            print("Name parameter not provided in the request.")
        return Response({"message": "updated profile successfully"}, status=status.HTTP_200_OK)
    except teacher.DoesNotExist:
        pass

    try:
        user = student.objects.get(email=user_email)
        name_instance = request.data.get('name')
        phone_instance = request.data.get('phone')
        img_instance = request.data.get('profile_img')
        dept_instance = request.data.get('Department')
        year_instance = request.data.get('year')
        print(name_instance,phone_instance)
        if name_instance or phone_instance or img_instance or dept_instance or year_instance:  
            user.name = name_instance
            user.phone_number = phone_instance
            user.profile_img = img_instance
            user.department = dept_instance
            user.year = year_instance
            user.save()  
        else:
            print("Name parameter not provided in the request.")
        return Response({"message": "updated profile successfully Student"}, status=status.HTTP_200_OK)
    except student.DoesNotExist:
        pass

    return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

### **** ****   users profile view     **** **** ###
@api_view(['GET'])
def view_user_profile(request,email):   
    user_email = email
    print(user_email)
    try:
        user = University.objects.get(email=user_email)
        data={
            'name':user.name,
            'address':user.address,
            'log':user.log if user.logo else None,
        }
        
        return Response(data, status=status.HTTP_200_OK)
    except University.DoesNotExist:
        pass

    try:
        user = teacher.objects.get(email=user_email)
        data={
            'name':user.name,
            'phone': user.phone_number,
            'qualification':user.qualification,
            'department':user.department,
            'role':user.user_type,
            'profile_img':user.profile_img if user.profile_img else None ,
        }
        return Response(data, status=status.HTTP_200_OK)
    except teacher.DoesNotExist:
        pass

    try:
        user = student.objects.get(email=user_email)
        data = {
            'name':user.name,
            'phone':user.phone_number,
            'profile_img':user.profile_img if user.profile_img else None ,
            'department':user.department,
            'university':user.university.name,
            'year':user.academicYear,
            'role':user.user_type,
            'registerno':user.registerno
            }
        return Response(data, status=status.HTTP_200_OK)
    except student.DoesNotExist:
        pass

    return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)



@api_view(['GET'])
def get_student_completed_course(request):
    student_email = request.query_params.get('email')   
    
    try:
        student_instance = student.objects.get(email=student_email)
    except student.DoesNotExist:
        return Response({'error': 'Student not found.'}, status=status.HTTP_404_NOT_FOUND)
    
    course_instances = courseenrollement.objects.filter(student=student_instance, completed=True)
    
    if not course_instances.exists():
        return Response({'error': 'No active courses found.'}, status=status.HTTP_404_NOT_FOUND)
    
    course_data = []
    
    for course_instance in course_instances:
        try:
            course_obj = course.objects.get(name=course_instance.course)
            course_data.append({
                'id':course_obj.id,
                'course_name': course_obj.name,
                'image': course_obj.image,
                'desc':course_obj.description,
                'total_chap':course_obj.total_chap
            })
        except course.DoesNotExist:
            continue  # Skip if course not found
    
    return Response({'courses': course_data})
    
@api_view(['GET'])
def get_student_progress_course(request):
    student_email = request.query_params.get('email')   
    print(student_email)
    
    try:
        student_instance = student.objects.get(email=student_email)
    except student.DoesNotExist:
        return Response({'error': 'Student not found.'}, status=status.HTTP_404_NOT_FOUND)
    
    course_instances = courseenrollement.objects.filter(student=student_instance, completed=False)
    
    if not course_instances.exists():
        return Response({'error': 'No active courses found.'}, status=status.HTTP_200_OK)
    
    course_data = []
    
    for course_instance in course_instances:
        try:
            course_obj = course.objects.get(name=course_instance.course)
            course_data.append({
                'id':course_obj.id,
                'course_name': course_obj.name,
                'image': course_obj.image,
                'desc':course_obj.description,
                'total_chap':course_obj.total_chap
            })
        except course.DoesNotExist:
            continue  # Skip if course not found
    
    return Response({'courses': course_data})


@api_view(['GET'])
def getCertificate(request, email):
    try:
        student_instance = student.objects.get(email=email)
    except student.DoesNotExist:
        return Response({"err": "Student not found"}, status=status.HTTP_404_NOT_FOUND)

    certificates = Certificate.objects.filter(student=student_instance)

    if not certificates.exists():
        return Response({"err": "No certificates found"}, status=status.HTTP_404_NOT_FOUND)
    data=[]
    certificate_urls = [cert.certificate_image.url for cert in certificates]
    print(certificate_urls)
    for i in certificate_urls:
        data.append({'certificate':i})

    return Response({"certificates":data})


@api_view(['DELETE'])
def delete_certificate_template(request):
    course_name = request.query_params.get('course')
    try:
        course_instance = course.objects.get(name=course_name)
    except course.DoesNotExist:
        return Response({'error': 'Course not found'}, status=status.HTTP_404_NOT_FOUND)
    try:
        certificate_template = Certificate_template.objects.get(course=course_instance)
        certificate_template.delete()
        return Response({'message': 'Certificate template deleted successfully'}, status=status.HTTP_200_OK)
    except Certificate_template.DoesNotExist:
        return Response({'error': 'Certificate template not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['PUT'])
def update_certificate_template(request):
   course_name = request.query_params.get('course')
   file = request.FILES.get('file')
   default = request.data.get('default', 'false').lower() in ['true', '1', 'yes']
   try:
       course_instance = course.objects.get(name=course_name)
   except course.DoesNotExist:
        return Response({'error': 'Course not found'}, status=status.HTTP_404_NOT_FOUND)

        # Validate certificate template existence
   try:
    certificate_template_instance = Certificate_template.objects.get(course=course_instance)
   except Certificate_template.DoesNotExist:
        return Response({'error': 'Certificate template not found'}, status=status.HTTP_404_NOT_FOUND)

        # Perform the update safely
   try:
    if file:
        certificate_template_instance.file = file
        certificate_template_instance.is_default = default
        certificate_template_instance.save()
        return Response({'message': 'Certificate template updated successfully'}, status=status.HTTP_200_OK)
   except Exception as e:
        return Response({'error': 'Error updating certificate template', 'details': str(e)}, status=status.HTTP_400_BAD_REQUEST)
@api_view(['GET'])
def view_results(request):
    student_email = request.query_params.get('email')
    course_name = request.query_params.get('course_name')
    chapter_name = request.query_params.get('chapter_id')
    print(student_email,course_name,chapter_name)
    if not student_email or not course_name or not chapter_name :
        return Response({"error": "Email, course_name, chapter_name and score are required"}, status=400)
    try:
        student_instance = student.objects.get(email=student_email)
        course_instance = course.objects.get(name=course_name)
        chapter_instance = Chapter.objects.get(id=chapter_name, course=course_instance)
    except student.DoesNotExist:
        return Response({"error": "Student not found"}, status=404)
    except course.DoesNotExist:
        return Response({"error": "Course not found"}, status=404)
    except Chapter.DoesNotExist:
        return Response({"error": "Chapter not found"}, status=404)
    try:
        quiz_result = QuizResult.objects.get(
            student=student_instance,
            course=course_instance,
            chapter=chapter_instance)
        print(quiz_result.score)
        return Response({'score':quiz_result.score},status=status.HTTP_200_OK)
        
    except Exception as e:
        print(e)
        return Response({"error": "Failed to save quiz result"},status=500)
    


########### Contact us ##################
class Contactlist(generics.ListCreateAPIView):
    queryset = Contactus.objects.all()
    serializer_class = ContactusSerializer

class ContactDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Contactus.objects.all()
    serializer_class = ContactusSerializer

######################### contact us send api ##########################
@api_view(['POST'])
def send_contactus(request):
    name=request.data.get('name')
    email = request.data.get('email')
    phone=request.data.get('phone')
    message = request.data.get('message')
    
    if not name or not email or not phone or not message:
        return Response({"error": "All fields are required"}, status=status.HTTP_400_BAD_REQUEST)
    try:

        Contactus.objects.create(name=name, email=email, phone=phone, message=message)
        return Response({"message": "Contact message sent successfully"}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def get_all_student_details(request):
    try:
        students = student.objects.all()
    except students.DoesNotExist:
        return Response({'error': 'No students found.'}, status=status.HTTP_404_NOT_FOUND)
    student_list=[]
    for stu in students:
        try:
            stu_course = courseenrollement.objects.filter(student=stu)
        except courseenrollement.DoesNotExist:
            return Response({'error': 'No courses found for student.'}, status=status.HTTP_404_NOT_FOUND)
        student_course = []
        for course in stu_course:
            student_course.append({
                'course_name': course.course.name,
                'course_id': course.course.id,
                'course_image': course.course.image if course.course.image else None,
                'complated':course.completed
            })
        if not student_course:
            student_course = None
        else:
            student_course = student_course
        student_payment = payment.objects.filter(student=stu)
        print(student_payment)
        student_payment_list = []  
        for  pays in student_payment:
            student_payment_list.append({
                'payment_id': pays.id,
                'amount': pays.amount,
                'status': pays.payment_status,
                'date': pays.payment_date,
                'course_name': pays.course.name if pays.course else None,
                'phone_number': pays.phone_number,
                'payment_date':pays.payment_date,
                'payment_method':pays.payment_method
                
            })
            
        if not student_payment_list:
            student_payment_list = None
        else:
            student_payment_list = student_payment_list
        
        student_info = {
            'name': stu.name,
            'email': stu.email,
            'department': stu.department,
            'university': stu.university.name if stu.university else None,
            'academic_year': stu.academicYear,
            'profile_image': stu.profile_img if stu.profile_img else None,
            'registerno': stu.registerno,
            'phone_number': stu.phone_number,
            'university': stu.university.name if stu.university else None,
            
            'courses': student_course,
            'payments': student_payment_list
        }
        student_list.append(student_info)
    return Response(student_list, status=status.HTTP_200_OK)





##### Forget Password ####


@api_view(["PUT"])
def change_password(request):
    email = request.data.get('email')  or request.query_params.get('email')
    new_password = request.data.get('new_password')  or request.query_params.get('new_password')
    user_type = request.data.get('user_type') or request.query_params.get('user_type')
    if not email or not new_password :
        return Response({'error': 'Please fill all fields'}, status=400)
    try:
        if user_type == 'student':
            student_instance = student.objects.get(email=email)
            student_instance .password = new_password
            student_instance.save()
        elif user_type == 'Faculty':
            faculty_instance = teacher.objects.get(email=email)
            faculty_instance.password = new_password
            faculty_instance.save()
        elif user_type == 'University_admin':
            University_instance = University.objects.get(email=email)
            University_instance.password = new_password
            University_instance.save()
        elif user_type == 'Superadmin':
            Superadmin_instance = University.objects.get(email=email)
            Superadmin_instance.password = new_password
            Superadmin_instance.save()

        else:
            return Response({'error': 'Invalid user type'}, status=400)
    except student.DoesNotExist:
        return Response({'error': 'Student not found'}, status=404)
    except teacher.DoesNotExist:
        return Response({'error': 'Faculty not found'}, status=404)
    except University.DoesNotExist:
        return Response({'error': 'University not found'}, status=404)
    except Superadmin.DoesNotExist:
        return Response({'error': 'Superadmin not found'}, status=404)
    return Response({'message': 'Password changed successfully'}, status=200)

@api_view(['POST'])
def forget_password(request):
    email = request.data.get('email')
    print(email)
    token = uuid.uuid4()



    link = f"http://localhost:5173/set-password/{token}{email}"
    send_mail(
        subject="Verify your Email",
     message = f"""
Dear User,

We received a request to reset your password. Please click the link below to set a new password:

{link}

If you did not request a password reset, please ignore this message.

Best regards,  
Support Team
"""
 ,
        from_email=settings.EMAIL_HOST_USER,
        recipient_list=[email],
        fail_silently=False,
        )
    return Response({'message': 'Email sent successfully'}, status=200)



## New Changes ##

@api_view(['DELETE'])
def assign_university_Remove(request,uni_name,course_name):
    try:
        university = University.objects.get(name=uni_name)
    except University.DoesNotExist:
        return Response({"error": "University not found"}, status=404)
    
    try:
        course_instance = course.objects.get(name=course_name)
    except course.DoesNotExist:
        return Response({"error": "Course not found"}, status=404)

    try:
        university_assign = assign_university.objects.get(university=university, course=course_instance)
    except assign_university.DoesNotExist:
        return Response({"error": "University assignment not found"}, status=404)
    
    university_assign.delete()
    return Response({"message": "University assignment removed successfully"},status=200)




########### ********* Delete  Course to Faculty API *********############q
@api_view(['DELETE'])
def assign_faculty_dlete(request,university,faculity_email,course_name):
    try:
        faculty_instance = teacher.objects.get(email=faculity_email)
    except teacher.DoesNotExist:
        return Response({'error': 'Faculty with this email does not exist.'}, status=404)
    
    try:
        course_instance = course.objects.get(name=course_name)
    except course.DoesNotExist:
        return Response({'error': 'Course with this name does not exist.'}, status=404)
    try:
        university_instance = University.objects.get(name=university)
    except University.DoesNotExist:
        return Response({'error':'university not found '},status=404)

    try:
        course_to_faculty_instance = course_to_faculty.objects.get(faculty=faculty_instance, course=course_instance, university=university_instance)
        course_to_faculty_instance.delete()
        return Response({'message': 'Course unassigned from faculty successfully.'}, status=200)
    except course_to_faculty.DoesNotExist:
        return Response({'error': 'This faculty is not assigned to this course.'},status=404)


## Bulk Quiz ##
@api_view(['POST'])
def bulkk_create_quiz(request):
    quizzes = request.data.get('quizzes', [])
    print(quizzes)
    if not quizzes:
        return Response({"error": "Quizzes list is required"}, status=400)
    for quiz_data in quizzes:
            print(quiz_data)
            chapter_id = quiz_data.get('chapter')
            question = quiz_data.get('question')
            option1 = quiz_data.get('option1')
            option2 = quiz_data.get('option2')
            option3 = quiz_data.get('option3')
            option4 = quiz_data.get('option4')
            correct_indices = quiz_data.get('correct_option')
            print(chapter_id, question, option1, option2, option3, option4, correct_indices)
            try:
                chapter = Chapter.objects.get(title=chapter_id)
            except Chapter.DoesNotExist:
                return Response({"error": f"Chapter with id {chapter_id} not found"}, status=404)
            quiz = Quiz.objects.create(
            chapter=chapter,
            question_text=question,
            option1=option1,
            option2=option2,
            option3=option3,
            option4=option4,
            correct_options=correct_indices
            )
            quiz.save()
            
    return Response({"message": "Quiz created successfully"}, status=200)


#### Faculty Start Learning ####

@api_view(['GET'])
def get_users_enroll_check(request):
    user_email = request.query_params.get('email')
    course_name = request.query_params.get('course')
    user_type = request.query_params.get('user_type')
    
    print(user_email, course_name, user_type)
    
    if user_type == "student":
        try:
            user_instance = student.objects.get(email=user_email)
        except student.DoesNotExist:
            return Response({'error': 'Student not found.'}, status=status.HTTP_404_NOT_FOUND)

        try:
            course_instance = course.objects.get(name=course_name)
        except course.DoesNotExist:
            return Response({'error': 'Course not found.'}, status=status.HTTP_404_NOT_FOUND)

        try:
            enroll_instance = courseenrollement.objects.get(student=user_instance, course=course_instance)
            return Response({
                'enrolled': enroll_instance.enrolled
            })
        except courseenrollement.DoesNotExist:
            return Response({'error': 'Enrollment record not found.'}, status=status.HTTP_404_NOT_FOUND)
    elif user_type == 'Faculty':
        try:
            user_instance = teacher.objects.get(email=user_email)
        except teacher.DoesNotExist:
            return Response({'error': 'Teacher not found.'}, status=status.HTTP_404_NOT_FOUND)
        try:
            course_instance = course.objects.get(name=course_name)
        except course.DoesNotExist:
            return Response({'error': 'Course not found.'}, status=status.HTTP_404_NOT_FOUND)
        try:
            faculty_courses = course_to_faculty.objects.filter(faculty=user_instance)
            is_assigned = False
            for record in faculty_courses:
                if record.course.filter(id=course_instance.id).exists():
                    is_assigned = True
                    break
            return Response({'assigned': is_assigned}, status=status.HTTP_200_OK)
        except course_to_faculty.DoesNotExist:
            return Response({'error': 'Enrollment record not found.'}, status=status.HTTP_404_NOT_FOUND)

    elif user_type == 'University_admin':
        try:
            user_instance = University.objects.get(email=user_email)
        except University.DoesNotExist:
            return Response({'error': 'university not found.'}, status=status.HTTP_404_NOT_FOUND)
        try:
            course_instance = course.objects.get(name=course_name)
        except course.DoesNotExist:
            return Response({'error': 'Course not found.'}, status=status.HTTP_404_NOT_FOUND)

        is_assigned = assign_university.objects.filter(
            university=user_instance,
            course=course_instance
        ).exists()

        return Response({'assigned': is_assigned}, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'Invalid or unsupported user_type provided.'}, status=status.HTTP_400_BAD_REQUEST)