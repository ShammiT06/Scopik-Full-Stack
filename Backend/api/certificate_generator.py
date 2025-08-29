from PIL import Image, ImageDraw, ImageFont
import os
from django.core.files.base import ContentFile
from django.conf import settings
from datetime import datetime
from .models import Certificate_template

def generate_certificate_image(student_name, course_instance):
    if not course_instance:
        raise Exception("Course does not exist.")
    
    # Try to get a template for the course
    template_obj = Certificate_template.objects.filter(course=course_instance).first()

    # If no course-specific template, try to get the default template
    if not template_obj:
        template_obj = Certificate_template.objects.filter(is_default=True).first()
    
    if not template_obj:
        raise Exception("No certificate template found for this course and no default template is set.")
    
    template_path = template_obj.file.path
    if not os.path.exists(template_path):
        raise Exception(f"Certificate template file not found at {template_path}")
    
    # Load the certificate template image
    image = Image.open(template_path).convert("RGB")
    draw = ImageDraw.Draw(image)

    # Define font paths (assuming fonts folder at project root)
    fonts_dir = os.path.join(settings.BASE_DIR, 'static', 'font')
    name_font_path = os.path.join(fonts_dir, 'GreatVibes-Regular.ttf')
    text_font_path = os.path.join(fonts_dir, 'Poppins-Regular.ttf')

    # Debug to check if font files exist
    if not os.path.exists(name_font_path) or not os.path.exists(text_font_path):
        raise Exception("Font files not found. Check your fonts directory.")

    # Load fonts with sizes
    name_font = ImageFont.truetype(name_font_path, size=90)
    course_font = ImageFont.truetype(text_font_path, size=40)
    date_font = ImageFont.truetype(text_font_path, size=35)

    # Certificate name positioning using textbbox
    bbox = draw.textbbox((0, 0), student_name, font=name_font)
    name_width = bbox[2] - bbox[0]
    name_height = bbox[3] - bbox[1]
    name_x = (image.width - name_width) // 2
    name_y = int(image.height * 0.47)

    # Course name positioning
    course_text = course_instance.name
    bbox = draw.textbbox((0, 0), course_text, font=course_font)
    course_width = bbox[2] - bbox[0]
    course_x = (image.width - course_width) // 2
    course_y = int(image.height * 0.60)

    # Date positioning (bottom-left)
    date_text = datetime.now().strftime("%d-%m-%Y")
    bbox = draw.textbbox((0, 0), date_text, font=date_font)
    date_width = bbox[2] - bbox[0]
    date_x = int(image.width * 0.12)
    date_y = int(image.height * 0.89)

    # Draw text
    draw.text((name_x, name_y), student_name, font=name_font, fill=(0, 0, 0))
    draw.text((course_x, course_y), course_text, font=course_font, fill=(0, 0, 0))
    draw.text((date_x, date_y), date_text, font=date_font, fill=(0, 0, 0))

    # Save to in-memory file
    from io import BytesIO
    buffer = BytesIO()
    image.save(buffer, format="JPEG")
    
    return ContentFile(buffer.getvalue(), name=f"{student_name}_certificate.jpg")