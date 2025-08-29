from rest_framework import serializers
from .models import Attendance, LMSActivity,student,teacher,course,course_category,courseenrollement,course_video,Chapter,Certificate,Quiz,QuizResult,payment,course_material,course_textcontent, University,assign_university ,Certificate_template,Semester,AcademicYear,course_to_faculty,course_chapter_status,Feedback,Blog,Contactus,blog_category
from django.contrib.auth.hashers import make_password
from django.utils.translation import gettext_lazy as _
from django.utils.translation import gettext as _




class AttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attendance
        fields = ['id', 'student', 'date', 'present']
        
class LMSActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = LMSActivity
        fields = ['id','student','date','hours_spent']
        

class studentSerializer(serializers.ModelSerializer):
     university = serializers.SlugRelatedField(
        queryset=University.objects.all(),
        slug_field='name')
     class Meta:
        model = student
        fields = '__all__'
        extra_kwargs = {
            'password': {'write_only': True}
        }

        def create(self, validated_data):
                    validated_data['password'] = make_password(validated_data['password'])
                    return super().create(validated_data)

        def validate_email(self, value):
            if student.objects.filter(email=value).exists():
                raise serializers.ValidationError(_("Email already exists."))
            return value

        def validate_phone_number(self, value):
            if student.objects.filter(phone_number=value).exists():
                raise serializers.ValidationError(_("Phone number already exists."))
            return value

class teacherSerializer(serializers.ModelSerializer):
    university = serializers.SlugRelatedField(
        queryset=University.objects.all(),
        slug_field='name')
    class Meta:
        model = teacher
        fields = '__all__'
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)

    def validate_email(self, value):
        if teacher.objects.filter(email=value).exists():
            raise serializers.ValidationError(_("Email already exists."))
        return value

    def validate_phone_number(self, value):
        if teacher.objects.filter(phone_number=value).exists():
            raise serializers.ValidationError(_("Phone number already exists."))
        return value

class course_categorySerializer(serializers.ModelSerializer):
    class Meta:
        model = course_category
        fields = '__all__'
class course_videoSerializer(serializers.ModelSerializer):
    class Meta:
        model = course_video
        fields = ['id', 'video_name', 'video', 'chapter']
        
class course_materialSerializer(serializers.ModelSerializer):
    class Meta:
        model = course_material
        fields = '__all__'
        
class course_textcontentserializer(serializers.ModelSerializer):
    class Meta:
        model = course_textcontent
        fields = '__all__'
        
        
class QuizSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quiz
        fields='__all__'


class ChapterSerializer(serializers.ModelSerializer):
    videos = course_videoSerializer(many=True, read_only=True)
    materials = course_materialSerializer(many=True, read_only=True)
    textcontents = course_textcontentserializer(many=True, read_only=True)
    quizzes = QuizSerializer(many=True, read_only=True)

    class Meta:
        model = Chapter
        fields = ['id', 'title', 'videos', 'materials', 'quizzes','textcontents']




class login_userserializer(serializers.ModelSerializer):
    class Meta:
        fields = ['email', 'password']
        extra_kwargs = {
            'password': {'write_only': True}
        }
        
class QuizResultSerializer(serializers.ModelSerializer):
    chapter=serializers.SlugField(
        source='chapter.title',
        read_only=True,)
    course = serializers.SlugField(
        source='course.name',
        read_only=True,)
    student = serializers.SlugField(
        source='student.name',
        read_only=True,)
    
    
    class Meta:
        model = QuizResult
        fields = '__all__'
    

class courseSerializer(serializers.ModelSerializer):
    chapters = ChapterSerializer(many=True, read_only=True)
    categories = serializers.SlugRelatedField(
    queryset=course_category.objects.all(),
    slug_field='name',
    many=True  
)
    class Meta:
        model = course
        fields = [
            'id',
            'name',
            'description',
            'image',
            'categories',
            'total_chap',
            'duration',
            'price',
            'background_image',
            'trending_course',
            'ratings',
            'paid',
            'course_enrolled_count',
            'chapters'
        ]
    def to_representation(self, instance):
        """Custom representation to make sure we reflect the @property."""
        representation = super().to_representation(instance)
        representation['course_enrolled_count'] = instance.course_enrolled_count
        return representation


class course_enrollementDashboardSerializer(serializers.ModelSerializer):
    percentage_complete = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()
    course = serializers.SlugRelatedField(
          queryset=course.objects.all(),
          slug_field='name')
    student = serializers.SlugRelatedField(
          queryset=student.objects.all(),
          slug_field='name')

    class Meta:
        model = courseenrollement
        fields = '__all__'

    def get_percentage_complete(self, obj):
        return obj.percentage_complete

    def get_status(self, obj):
        return obj.status

class paymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = payment
        fields = '__all__'
        extra_kwargs = {
            'amount': {'required': True},
            'payment_method': {'required': True}
        }
        
class CertificateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Certificate
        fields = ['id', 'course', 'student', 'certificate_image', 'issue_date']



class UniversitySerializer(serializers.ModelSerializer):
    class Meta:
        model = University
        fields = '__all__'
    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)
    

    def validate_email(self, value):
        if University.objects.filter(email=value).exists():
            raise serializers.ValidationError(_("Email already exists."))
        return value
    def validate_phone_number(self, value):
        if University.objects.filter(phone_number=value).exists():
            raise serializers.ValidationError(_("Phone number already exists."))
        return value
    def validate_name(self, value):
        if University.objects.filter(name=value).exists():
            raise serializers.ValidationError(_("University name already exists."))
        return value
    def validate_address(self, value):
        if University.objects.filter(address=value).exists():
            raise serializers.ValidationError(_("University address already exists."))
        return value
    def validate_website(self, value):
        if University.objects.filter(website=value).exists():
            raise serializers.ValidationError(_("University website already exists."))
        return value
    
        

class Assignuniversityserializers(serializers.ModelSerializer):
      university = serializers.SlugRelatedField(
        queryset=University.objects.all(),
        slug_field='name'   )
      course = serializers.SlugRelatedField(
          queryset=course.objects.all(),
          slug_field='name'
      )
      class Meta:
            model=assign_university
            fields = [
                'university',
                'course',
            ]
            
class AssigencourseToFacultySerializer(serializers.ModelSerializer):
    course = serializers.SlugRelatedField(
        queryset=course.objects.all(),
        slug_field='name',many=True
    )
    faculty = serializers.SlugRelatedField(
        queryset=teacher.objects.all(),
        slug_field='name'
    )

    class Meta:
        model = course_to_faculty
        fields = ['course', 'faculty']
        
        
class Certificateserializers(serializers.ModelSerializer):
    class Meta:
        model = Certificate_template
        fields = '__all__'
        
class Coursechapterserializer(serializers.ModelSerializer):
    course = serializers.SlugRelatedField(queryset=course.objects.all(),slug_field='name')
    chapter = serializers.SlugRelatedField(queryset=Chapter.objects.all(),slug_field='title')
    student = serializers.SlugRelatedField(queryset=student.objects.all(),slug_field = 'name')
    class Meta:
        model = course_chapter_status
        fields = '__all__'

class FeedbackSeriallizers(serializers.ModelSerializer):
    student = serializers.SlugRelatedField(queryset=student.objects.all(),slug_field = 'name')
    course = serializers.SlugRelatedField(queryset=course.objects.all(),slug_field='name')
    class Meta:
        model = Feedback
        fields = '__all__'


class CreateblogcategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = blog_category
        fields = ['Category']
        
    def validate_Category(self, value):
        if blog_category.objects.filter(Category=value).exists():
            raise serializers.ValidationError(_("Category already exists."))
        return value



        
class Semesterseriaizers(serializers.ModelSerializer):
    course = serializers.SlugRelatedField(queryset=course.objects.all(),slug_field = 'name',many=True )
    university = serializers.SlugRelatedField(queryset=University.objects.all(),slug_field = 'name' )
    class Meta:
        model = Semester
        fields = '__all__'

class BlogSerializers(serializers.ModelSerializer):
    category = serializers.SlugRelatedField(queryset=blog_category.objects.all(),slug_field = 'Category' )
    class Meta:
        model = Blog
        fields = '__all__'


class Certificatetemplateserializer(serializers.ModelSerializer):
    course = serializers.SlugRelatedField(
          queryset=course.objects.all(),
          slug_field='name'
      )
    class Meta:
        model = Certificate_template
        fields = [
            'file',
            'course',
            'is_default'
        ]

class ContactusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contactus
        fields = '__all__'