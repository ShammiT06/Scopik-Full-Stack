from django.db import models
from django.core import serializers
from django.db.models import signals
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import datetime, timedelta
from django.db.models import JSONField 
from datetime import datetime, timezone
import datetime
from datetime import datetime, timezone, timedelta
import uuid
from django.db import models



class University(models.Model):
    name=models.CharField(max_length=100)
    email=models.EmailField(unique=True)
    address = models.CharField(max_length=255)
    password=models.CharField(max_length=100)
    logo = models.URLField(null=True, blank=True)
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name_plural="2.University"


def get_default_university():
    return University.objects.get(name='Scopik').id  
    
class teacher(models.Model):
    university = models.ForeignKey(University, on_delete=models.CASCADE, null=True, blank=True, default=get_default_university)
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=15, unique=True)
    qualification = models.CharField(max_length=100,null=True,blank=True)
    user_type = models.CharField(max_length=10,default='Faculty')
    department= models.CharField(null=True,blank=True)
    profile_img = models.URLField(null=True, blank=True)
    password_reset_token = models.CharField(max_length=128, blank=True, null=True)
    

    def __str__(self):
        return self.name

    def to_json(self):
        return serializers.serialize('json', [self])

class AcademicYear(models.Model):
    year = models.PositiveIntegerField()  # 1 = First Year, 2 = Second Year, etc.

    def __str__(self):
        return f"Year {self.year}"


class course_category(models.Model):
    name = models.CharField(max_length=100)
    image = models.URLField(null=True,blank=True)


    def __str__(self):
        return self.name

    def to_json(self):
        return serializers.serialize('json', [self])

class course(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    categories = models.ManyToManyField(course_category, related_name='courses', blank=True)
    image = models.URLField(null=True,blank=True)
    total_chap = models.IntegerField()
    duration =models.IntegerField()
    price = models.IntegerField()
    background_image = models.URLField(null=True,blank=True)
    trending_course = models.BooleanField(default=False,null=True,blank=True)
    ratings= models.FloatField(default=4.0,blank=True,null=True)
    paid= models.BooleanField(default=False,null=True,blank=True)
    # Semester = models.ForeignKey(Semester,on_delete=models.CASCADE,null=True,blank=True)
    academic_year =models.IntegerField(default=1,null=True,blank=True)
    
    def __str__(self):
        return self.name
    
    def get_category_name(self):
        return self.category.name

    def to_json(self):
        return serializers.serialize('json', [self])
    
    def course_enrolled_count(self):
        return self.enrolled_students.count()
    @property
    def course_enrolled_count(self):
        """Dynamically compute total number of enrollments for this course."""
        return self.enrolled_students.count()
class Semester(models.Model):
    course = models.ManyToManyField('course', related_name='course_names', blank=True)
    sem = models.PositiveBigIntegerField()
    start_date = models.DateField()
    university = models.ForeignKey(University, on_delete=models.CASCADE, null=True, blank=True)
    department = models.CharField(max_length=100)
    
    
class Chapter(models.Model):
    course = models.ForeignKey(course, on_delete=models.CASCADE, related_name='chapters')
    title = models.CharField(max_length=100)
    chapter_type = models.CharField(max_length=50)  
    status = models.BooleanField(default=False)
    
    def __str__(self):
        return f"{self.title} ({self.chapter_type}) ({self.course.name})"

class course_video(models.Model):
    chapter = models.ForeignKey(Chapter, on_delete=models.CASCADE, related_name='videos')
    video_name = models.CharField(max_length=100)
    video = models.URLField(null=True,blank=True)
    status = models.BooleanField(default=False)
    type = models.CharField(max_length=100,default='video')
    
    def __str__(self):
        return self.video_name
    
class course_material(models.Model):
    chapter = models.ForeignKey(Chapter, on_delete=models.CASCADE, related_name='materials')
    material_name = models.CharField(max_length=100)
    material = models.URLField(null=True,blank=True)
    status = models.BooleanField(default=False)
    type = models.CharField(max_length=100,default='material')
    def __str__(self):
        return super().__str__()
    
class course_textcontent(models.Model):
    chapter = models.ForeignKey(Chapter, on_delete=models.CASCADE, related_name='textcontents')
    textcontent = models.TextField()
    status = models.BooleanField(default=False)
    type = models.CharField(max_length=100,default='text content')
    

def get_default_university():
    return University.objects.get(name='Scopik').id  
class student(models.Model):
    university = models.ForeignKey(University, on_delete=models.CASCADE, null=True, blank=True, default=get_default_university)
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=15, unique=True)
    user_type = models.CharField(max_length=10, default='student')
    profile_img = models.URLField(null=True, blank=True)
    department= models.CharField(null=True,blank=True,default='scopik')
    academicYear = models.IntegerField(null=True,blank=True)
    registerno =models.CharField(default='public',null=True)
    password_reset_token = models.CharField(max_length=128, blank=True, null=True)
    
    
    
    
    def __str__(self):
        return self.name
    def to_json(self):
        return serializers.serialize('json', [self])
  

class EmailOTP(models.Model):
    email = models.EmailField(unique=True)
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)

    def is_expired(self):
        return datetime.now(timezone.utc) > self.created_at + timedelta(minutes=10)



class courseenrollement(models.Model):
    course = models.ForeignKey(course, on_delete=models.CASCADE, related_name='enrolled_students')
    student = models.ForeignKey(student, on_delete=models.CASCADE, related_name='enrolled_courses', null=True, blank=True)
    course_complete_modules=models.PositiveIntegerField(default=0)
    course_complete_videos=models.PositiveIntegerField(default=0)
    enrollment_date = models.DateTimeField(auto_now_add=True)
    completed = models.BooleanField(default=False)
    enrolled= models.BooleanField(default=False)
    
    def __str__(self):
        return f"{self.student} enrolled in {self.course} status {self.percentage_complete:.2f}%"
    def get_student_name(self):
        return self.student.name
    def get_course_name(self):
        return self.course.name
    def to_json(self):
        return serializers.serialize('json', [self])

    @property
    def percentage_complete(self):
        total_videos = sum(chapter.videos.count() for chapter in self.course.chapters.all())
        if total_videos == 0:
            return 0
        return (self.course_complete_videos / total_videos) * 100

    @property
    def status(self):
        pct = self.percentage_complete
        if pct == 100:
            return "Completed"
        elif pct >= 76:
            return "Almost Done"
        elif pct >= 26:
            return "In Progress"
        else:
            return "Started"
    
    @property
    def is_completed(self):
        return self.percentage_complete == 100

    def update_completion(self, completed_videos_count, completed_modules_count):
        self.course_complete_videos = completed_videos_count
        self.course_complete_modules = completed_modules_count
        self.completed = (completed_videos_count == sum(chapter.videos.count() for chapter in self.course.chapters.all()))
        self.save()
    
    class Meta:
        unique_together = ('course', 'student')

    def __str__(self):
        return f"{self.student.name} enrolled in {self.course.name}"

    
class Quiz(models.Model):
    chapter= models.ForeignKey(Chapter, on_delete=models.CASCADE,null=True,blank=True)
    question_text = models.TextField()
    option1 = models.CharField(max_length=100)
    option2 = models.CharField(max_length=100)
    option3 = models.CharField(max_length=100)
    option4 = models.CharField(max_length=100)
    correct_options = models.PositiveBigIntegerField(blank=True, null=True) 
    chapter = models.ForeignKey(Chapter, on_delete=models.CASCADE, related_name='quizzes')
    
    def __str__(self):
        return self.question_text
    def get_chapter_name(self):
        return self.chapter.title

class QuizResult(models.Model):
    student = models.ForeignKey(student, on_delete=models.CASCADE)
    course = models.ForeignKey(course, on_delete=models.CASCADE, null=True, blank=True)
    chapter = models.ForeignKey(Chapter, on_delete=models.CASCADE, null=True, blank=True)
    score = models.IntegerField()
    date_taken = models.DateTimeField(auto_now_add=True)
   

    def __str__(self):
        return f"{self.student} - {self.course} - {self.score}"   
    def get_student_name(self):
        return self.student.name
    def get_quiz_result(self):
        return self.score
    def get_chapter_name(self):
        return self.course.name
    
    
class Certificate(models.Model):
    student = models.ForeignKey(student, on_delete=models.CASCADE)
    course = models.ForeignKey(course, on_delete=models.CASCADE)
    issue_date = models.DateTimeField(auto_now_add=True)
    certificate_image = models.ImageField(upload_to='certificates/')
    
    def __str__(self):
        return f"Certificate for {self.student} in {self.course}"
    
    def get_student_name(self):
        return self.student.name
    def get_course_name(self):
        return self.course.name

class Superadmin(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=100)
    def __str__(self):
        return self.name


class Attendance(models.Model):
    student = models.ForeignKey(student, on_delete=models.CASCADE)
    date = models.DateField()
    present = models.BooleanField(default=False)
    login_time=models.TimeField(auto_now=True)
    logout_time=models.TimeField(auto_now=True)

class LMSActivity(models.Model):
    student = models.ForeignKey(student, on_delete=models.CASCADE)
    date = models.DateField(null=True,blank=True)
    hours_spent = models.FloatField(default=0)
    login_time=models.TimeField(auto_now=True)
    logout_time=models.TimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.student} - {self.date} - {self.hours_spent} - {self.login_time} -{self.logout_time}"
    
    
    def calculate_hours_spent(self):
        if self.login_time and self.logout_time:
            login_dt = datetime.combine(self.date, self.login_time)
            logout_dt = datetime.combine(self.date, self.logout_time)
            time_diff = logout_dt - login_dt
            self.hours_spent = round(time_diff.total_seconds() / 3600, 2)
        else:
            self.hours_spent = 0


class payment(models.Model):

    payment_choies={
        ("card")
    }
    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone_number = models.CharField(max_length=15)
    student = models.ForeignKey(student, on_delete=models.CASCADE)
    course = models.ForeignKey(course, on_delete=models.CASCADE)
    amount = models.IntegerField()
    payment_method=models.CharField(null=True, blank=True , max_length=100)
    payment_id = models.CharField(max_length=100, unique=True, null=True, blank=True)
    payment_date = models.DateTimeField(auto_now_add=True)
    payment_status = models.BooleanField(default=False)

    def _str_(self):
        return f"{self.student} - {self.course} - {self.amount} - {self.payment_status}"
    
    def get_student_name(self):
        return self.student.name
    def get_course_name(self):
        return self.course.name
    
    
class Certificate_template(models.Model):
    file = models.ImageField(upload_to='templates/')
    course = models.ForeignKey(course, on_delete=models.CASCADE, null=True, blank=True)
    is_default = models.BooleanField(default=False)

    def __str__(self):
        if self.is_default:
            return "Default Template"
        return f"Template for {self.course.name}"
        
        
################   super admin   ##############
class assign_university(models.Model):
    university = models.ForeignKey(University, on_delete=models.CASCADE)
    course =  models.ForeignKey(course,on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.course.name} - {self.university.name}"

    class Meta:
        verbose_name_plural = "Assign University to Superadmin"



############ University ##############
class course_to_faculty(models.Model):
    course = models.ManyToManyField(course, related_name='courses', blank=True)
    faculty = models.ForeignKey(teacher, on_delete=models.CASCADE)
    university = models.ForeignKey(University, on_delete=models.CASCADE)
    
    def __str__(self):
        return f"{self.course.name} - {self.faculty.name} - {self.university}"


class course_chapter_status(models.Model):
    student = models.ForeignKey(student, on_delete=models.CASCADE)
    course = models.ForeignKey(course, on_delete=models.CASCADE)
    chapter = models.ForeignKey(Chapter,on_delete=models.CASCADE)
    status = models.BooleanField(default=False)


class Feedback(models.Model):
    student = models.ForeignKey(student, on_delete=models.CASCADE)
    course = models.ForeignKey(course, on_delete=models.CASCADE)
    feedback = models.CharField(max_length=500,null=True,blank=True)


class blog_category(models.Model):
    Category = models.CharField(max_length=100)
    

class Blog(models.Model):
    title = models.CharField(max_length=100)
    category = models.ForeignKey(blog_category, on_delete=models.CASCADE, related_name='blogs', null=True, blank=True)
    content = models.TextField()    
    image_urls = models.JSONField(default=list)


class Contactus(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=10)
    message = models.TextField()
    date = models.DateTimeField(auto_now_add=True)

    def _str_(self):
        return f"Contact from {self.name}-{self.email}"