from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenRefreshView
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [

    path('loginexisting/', views.login_EMAIL_EXISTING, name='loginexisting'),
    
    path('student/', views.StudentListCreateView.as_view(), name='student-list'),#student list
    
    path('student/<int:pk>/', views.StudentDetailView.as_view(), name='student-detail'),#student
    
    path('teacher/', views.TeacherListView.as_view(), name='teacher-list'),#teacher list
    
    path('teacher/<int:pk>/', views.TeacherDetailView2.as_view(), name='teacher-detail'),#teacher detail
    
    path('coursecategory/', views.CourseCategoryView.as_view(), name='coursecategory-list'),#course category list
    
    path('course/', views.CourseListAPIView.as_view(), name='course-list'),# course list
    
    path('course/<int:pk>/', views.CourseDetailAPIView.as_view(), name='course-detail'),# course detail
    
    path('coursecategory/<int:pk>/', views.CourseCategoryDetailView.as_view(), name='coursecategory-detail'),# course category detail
    
    path('login/',views.login_user, name='login'),# user login
    
    path('register/', views.register_user, name='register'),# user register
    
    path('coursevideo/', views.CourseVideoListAPIView.as_view(), name='coursevideo-list'),# course video list
    
    path('coursevideo/<int:pk>/', views.CourseVideoDetailAPIView.as_view(), name='coursevideo-detail'),# course video detail
    
    path('chapters/', views.ChapterListCreateAPIView.as_view(), name='chapter-list'),# chapter list
    
    path('chapters/<int:pk>/', views.ChapterDetailAPIView.as_view(), name='chapter-detail'),# chapter detail
    
    path('courseenrollment/', views.student_courseenrollement_view, name='courseenrollment'),# courseenrollement function
    
    path('courseenrollmentlist/', views.CourseEnrollementListAPIView.as_view(), name='courseenrollment-list'),# courseenrollment list
    
    path('courseenrollment/<int:pk>/', views.CourseEnrollementDetailAPIView.as_view(), name='courseenrollment-detail'),# courseenrollment 
    path('studentprogress/', views.student_dashboard ,name='studentprogress'),#student progress

    path('quiz/', views.QuizListCreateView.as_view(), name='quiz-list'),# quiz list
    
    path('quiz/<int:pk>/', views.QuizDetailView.as_view(), name='quiz-detail'),# quiz detail
    
    path('superadminlogin/',views.superadmin_login,name='superadminlogin'),
    
    path('superadminlogout/',views.superadmin_logout,name='superadminlogout'),
    
    path('logout/', views.logout_user, name='logout'),#logout
    
    path('addcourse/',views.add_course,name='addcourse'), #add course
    
    path('displaycourse/',views.display_course,name="displaycourse"), #display course
    
    path('updatecourse/<str:name>',views.update_course,name='updatecourse'), #update course
    
    path('deletecourse/<str:name>',views.delete_course,name="deltecourse"),#delete course
    
    path('createcertificate/',views.create_certificate_api,name='createcertificate'),#create certificate
    
    path('certificateview/',views.Certificatelist.as_view(),name='certificateview'), #certificate view 
    
    path('certificate/',views.view_certificate_api,name='certificate'),
    
    path('success/', views.payment_success, name='success'),# success view
    # course video progress
    path('courseenrollmentprogress/', views.student_courseenrollement_progress_view, name='courseenrollmentprogress'),# course enrollment progress
    
    path('material/',views.coursematerial.as_view(),name = 'material'),
    
    path('courseenrollstatus/',views.check_enrollment_status,name='courseenrollstatus'),
    
    # path('courseenrollprogress/',views.course_enroll_progress,name="courseenrollprogress"), # course enroll progress
    
      
    
    path('createcategory',views.Create_category,name='createcategory'
        
    ),
    path('updatecategory/<str:name>',views.Update_category,name='updatecategory'),
    
    path('deletecategory/<str:name>',views.Delete_category,name='deletecategory'),
    
    path(
        'createchapter/',views.create_chapter,name='createchapter'
    ),
    path('updatechapter/<str:name>',views.Update_chapter,name='updatechapter'),
    
    path('deletechapter/<str:name>',views.Delete_chapter,name='deletechapter'),
    
    path('createcategory',views.Create_category,name='createcategory'),
    
    path('updatecategory/<str:name>',views.Update_category,name='updatecategory'),
    
    path('deletecategory/<str:name>',views.Delete_category,name='deletecategory'),
    
    path('createcvideo/',views.Create_video,name='createvideo'),
    
    path('updatevideo/<str:name>',views.Update_video,name='updatevideo'),
    
    path('deletevideo/<str:name>',views.Delete_video,name='deletevideo'),
    
    path('createdocument/',views.Create_document,name='createdocument'),
    
    path('updatedocument/<str:name>',views.Update_document,name='updatedocument'),
    
    path('deletedocument/<str:name>',views.Delete_document,name='deletedocument'),
    
    path('createquiz/',views.create_quiz,name='createquiz'),
    
    path('updatequiz/<str:name>',views.update_quiz,name='updatequiz'),
    
    path('deletequiz/<str:name>',views.Delete_quiz,name='deletequiz'),
    
    path('coursedocument/',views.CourseDocumentlist.as_view(),name='coursedocument'),
    
    path('createtext/',views.create_textconntent,name='createtext'),
    
    path('updatetext/<str:name>',views.update_textconntent,name='updatetext'),
    
    path('deletetext/<str:name>',views.Delete_textconntent,name='deletetext'),
    
    path('admindashbord/',views.admin_dashboard ,name = 'admindashboard'),
    
    path('university/',views.UniversityListView.as_view(), name='university-list'),# university list
    
    path('university/<int:pk>/', views.UniversityDetailView.as_view(), name='university-detail'),# university detail
    
    path('adduniversity/',views.add_university,name='adduniversity'), #add university
    
    path('updateuniversity/<str:name>',views.update_university,name='updateuniversity'), #update university
    
    path('deleteuniversity/<str:name>',views.delete_university,name='deleteuniversity'), #delete university
    
    path('studentdashboard/',views.admin_dashboard,name='studentdashboard'),
    
    path('universitydashboard/',views.University_dashboard,name='universitydashboard'),
    
    path('teacherdashboard/',views.teacher_dashboard ,name='teacherdashboard'),

    path('assignedstudentlist/',views.assigned_student_list ,name='assignedstudentlist'),
    
    path('assigntouni/',views.assign_university_create ,name='assigntouni'),
    
    path('assignunivelist/',views.assignuniversitylistview.as_view() ,name='assignunilist'),
    
    path('assignunidetail/<int:pk>',views.assignuniversitydetailview.as_view() ,name='assignunidetail'),
    
    path('asigntounidelete/',views.assign_university_delete ,name='asigntounidelete'),
    
    path('assigncoursetofaculty/',views.assign_course_to_faculty ,name='assigncoursetofaculty'),
    path('assigncoursetofacultylist/',views.assigncourseToFacultyListView.as_view() ,name='assigncoursetofacultylist'),
    
    path('assigncoursetofacultydetail/<int:pk>',views.assigncourseToFacultyDetailView.as_view() ,name='assigncoursetofacultydetail'),
    
    path('getfacultycourse/',views.get_faculty_courses ,name='getfacultycourse'),
    
    path('assigncoursetostudentlist/',views.assigncourseToFacultyListView.as_view() ,name='assigncoursetostudentlist'),
    
    path('assigncoursetostudentdetail/<int:pk>',views.assigncourseToFacultyDetailView.as_view() ,name='assigncoursetostudentdetail'),
    
    path('assigncoursetostudent/',views.add_student_to_course ,name='assigncoursetostudent'),
    
    path('getstudentbyuni/',views.get_student_university,name='getstudentbyuni'),
    
    path('getfacultyuni/',views.get_faculty_university,name='getfacultyuni'),
    
    path('api/token/',views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('uploadcertificate/',views.uploadCertificate,name='uploadcertificate'),
    
    path('compledtedcourses/',views.complete_course,name='completedcourses'),
    
    path('completedcoursestatus/',views.course_progress,name='completedcoursestatus'),
    
    #save quiz scores:
    path('savequizscore/', views.save_quiz_result,name='savequizscore'),
    
    #GENERATE OTP  LINKS
    path('sendotp/',views.send_otp,name='sendotp'),
    
    path('verifyotp/',views.verify_otp,name='verifyotp'),
    
    path('unicourses/',views.uni_course_list,name='unicourses'),
    
    path('quizresultlistview/',views.Quizresultlist.as_view(),name='quizresultlistview'),
     
    path('chapterstatuscreate/',views.course_status_create,name='chapterstatuscreate'), # course status
    
    path('chapterstatus/',views.coursechapterstatusview.as_view(),name='chapterstatus'),
    
    path('chapterstatusview/',views.course_status_view,name='chapterstatusview'),

    path('createtemplate/', views.create_certificate_template, name='createtemplate'),

    path('templateview/', views.certificatetemplateview.as_view(), name='templateview'),

    
    
    #feedback

    path('feedbacklistview/',views.Feedbacklist.as_view(),name='feedbacklistview'),
    
    path('getfeedback/',views.create_feedback,name='getfeedback'),
    
    path('feedbackview/',views.get_feedback,name='feedbackview'),
    
    path('set-password/', views.set_password, name='set_password'),

    #delete the users 
    path('studentdelete/', views.delete_student, name='studentdelete'),

    path('facultydelete/', views.delete_faculty, name='facultydelete'),
    # bulk upload
    path('bulkupload/', views.bulk_register_user, name='bulkupload'),
    
    # semester course 
    path('semsterlist/', views.Semsterviewslist.as_view(), name='semsterlist'),
    
    path('addtemplatecourse/', views.add_template_course,name='addtemplatecourse'),
    
    path('createsem/',views.create_semester,name='createsem'),
    
    
    path('getsyllabus/',views.get_syllabus,name='getsyllabus'),
    
    path('createblogs/',views.create_blog,name='createblogs'),

    path('deleteblogs/<str:name>',views.delete_blog,name='deleteblogs'),
    
    path('listblogs/',views.Blogsviews.as_view(),name='listblogs'),

    path('edituserprofile/<str:email>', views.edit_user_profile, name='edituserprofile'),

    path('completedcourses/', views.get_student_completed_course, name='completedcourses'),
    
    path('progresscourses/', views.get_student_progress_course, name='progresscourses'),

    path('getcertificate/<str:email>',views.getCertificate,name='getcertificate'),

    path('deleteblogs/',views.delete_blog,name='deleteblogs'),
    
    path('editblogs/<str:name>',views.update_blog ,name='editblogs'),

    path('quizresults/', views.view_results, name='quizresults'),

    path('updatesem/<str:name>/<int:sem>', views.edit_semster, name='updatesem'),
    
    
    #course complete api 
    path('coursecompletestatus/',views.complete_course_api,name='coursecompletestatus'),
    
    #course view 
    path('completestatusview/',views.get_course_enrollments_api,name = 'completestatusview'),

    path('userprofileview/<str:email>/', views.view_user_profile, name='userprofileview'),

    path('certificatetemplatedelete/', views.delete_certificate_template, name='certificatetemplatedelete'),
    
    path('certificatetemplateupdate/', views.update_certificate_template, name='certificatetemplateupdate'),


    path('contactlistview/', views.Contactlist.as_view(), name='contactlistview'),
    
    path('contactus/<int:pk>', views.ContactDetail.as_view(), name='contactus-detail'),
    
    path('sendcontactus/', views.send_contactus, name='sendcontactus'),

    path('studentdetails/', views.get_all_student_details, name='studentdetails'),

    path('bloglcategorylist/',views.blogcategorylistview.as_view(),name='bloglcategorylist'),
    
    path('createblogcategory/', views.create_blog_category, name='createblogcategory'),
    
    path('updateblogcategory/<str:name>/', views.update_blog_category, name='updateblogcategory'),
    
    path('deleteblogcategory/<str:name>/', views.delete_blog_category, name='deleteblogcategory'),






    # Change Password
    path('password_change/', views.change_password, name='password_change'),
    path("forgot_password/",views.forget_password,name="forget_password"),




    #University Course Delete
    path('unicourseremove/<str:uni_name>/<str:course_name>/',views.assign_university_Remove,name='unicourseremove'),
    
    path('assigncoursedelete/<str:university>/<str:faculity_email>/<str:course_name>/',views.assign_faculty_dlete,name='assigncoursedelete'),


    #Bulk Quiz
    path('bulkquiz/',views.bulkk_create_quiz, name='bulkquiz'),


    #Update Sem
    path('updatesem/<str:uni_name>/<str:name>/<int:sem>', views.edit_semster, name='updatesem'),

    path('deletesem/<str:uni_name>/<str:name>/<int:sem>/',views.Delete_semster,name='deletesem'),



    #Faculty Start Learning
    path('userenrollcheck/', views.get_users_enroll_check, name='userenrollcheck'),

    

    
]