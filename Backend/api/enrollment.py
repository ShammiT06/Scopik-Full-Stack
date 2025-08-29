from datetime import date
from django.db import IntegrityError
from .models import Semester, student as Student ,courseenrollement as CourseEnrollment

def enroll_students_function():
    today = date.today()

    semesters = Semester.objects.filter(start_date__lte=today)

    for semester in semesters:
        courses = semester.course.all()

        students = Student.objects.filter(department=semester.department)

        for student_instance in students:
            for course_instance in courses:
                enrollment_exists = CourseEnrollment.objects.filter(
                    student=student_instance,
                    course=course_instance
                ).exists()

                if not enrollment_exists:
                    try:
                        CourseEnrollment.objects.create(
                            student=student_instance,
                            course=course_instance
                        )
                        print(f"Enrolled {student_instance} in {course_instance}")
                    except IntegrityError:
                        continue

    print("Student enrollment process completed.")