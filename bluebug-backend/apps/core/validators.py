"""
Image validators — file type aur size check karte hain upload se pehle.
Kabhi bhi frontend validation par trust mat karo — yeh server-side gate hai.
"""
from django.core.exceptions import ValidationError
import os

# Max 5MB per image — cover aur gallery dono ke liye
MAX_IMAGE_SIZE_MB = 5
MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024

ALLOWED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp']


def validate_image_file(value):
    """
    File extension aur size dono check karo.
    Sirf jpg/jpeg/png/webp allow karo — gif, svg, bmp nahi.
    """
    ext = os.path.splitext(value.name)[1].lower()
    if ext not in ALLOWED_IMAGE_EXTENSIONS:
        raise ValidationError(
            f"Unsupported file type '{ext}'. Only {', '.join(ALLOWED_IMAGE_EXTENSIONS)} are allowed."
        )
    if value.size > MAX_IMAGE_SIZE_BYTES:
        raise ValidationError(
            f"Image too large ({value.size // (1024*1024):.1f}MB). Maximum allowed size is {MAX_IMAGE_SIZE_MB}MB."
        )
