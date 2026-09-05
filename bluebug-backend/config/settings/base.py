"""
BlueBug Backend — Base Settings
Yahan sirf woh settings hain jo sab environments me common hain.
Koi bhi environment-specific cheez (DEBUG, DATABASE, SECRETS) yahan mat likhna.
"""

from pathlib import Path
import os
import environ

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent.parent

env = environ.Env()

# -------------------------------------------------------------------
# SECRET_KEY: Har environment ka apna key hoga .env se.
# Default sirf local dev ke liye — prod me yeh KABHI use nahi hoga.
# -------------------------------------------------------------------
SECRET_KEY = env('SECRET_KEY', default='django-insecure-e$+ui4yqgzj^0@03-n09ecshqj)1)j9spui8!l8bkj9nz=dn=g')

# Default auto field — nahin set karo to Django warning deta hai har migration me
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


# Application definition
INSTALLED_APPS = [
    'unfold',  # unfold pehle hona chahiye admin se
    'unfold.contrib.filters',
    'unfold.contrib.forms',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Third party
    'rest_framework',
    'corsheaders',
    'imagekit',

    # Local apps
    'apps.projects',
    'apps.services',
    'apps.leads',
    'apps.team',
    'apps.core',
]

# -------------------------------------------------------------------
# Middleware — CorsMiddleware sabse pehle hona chahiye
# -------------------------------------------------------------------
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'

# Databases are configured per environment (dev.py / prod.py)


# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# Static / Media
STATIC_URL = 'static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
MEDIA_URL = 'media/'
MEDIA_ROOT = BASE_DIR / 'media'

# Email backend — dev me console, prod me real SMTP
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

# -------------------------------------------------------------------
# Django REST Framework
# -------------------------------------------------------------------
REST_FRAMEWORK = {
    'DEFAULT_EXCEPTION_HANDLER': 'apps.core.exceptions.custom_exception_handler',
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 12,
    # Throttling globally — leads endpoint ke liye alag class set ki hai
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '60/min',       # general read endpoints
        'lead_create': '5/hour', # POST /api/leads/ — spam block
    },
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
    ],
    'DEFAULT_PARSER_CLASSES': [
        'rest_framework.parsers.JSONParser',
        'rest_framework.parsers.MultiPartParser',
        'rest_framework.parsers.FormParser',
    ],
}

# -------------------------------------------------------------------
# Structured Logging — stdout pe, taaki Railway/Render capture kar sake
# -------------------------------------------------------------------
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {process:d} {thread:d} {message}',
            'style': '{',
        },
        'simple': {
            'format': '{levelname} {asctime} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'WARNING',
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': 'WARNING',
            'propagate': False,
        },
        'django.request': {
            'handlers': ['console'],
            'level': 'ERROR',
            'propagate': False,
        },
        'apps': {
            # Humare apne apps ka logging — DEBUG level in dev, WARNING in prod
            'handlers': ['console'],
            'level': env('LOG_LEVEL', default='WARNING'),
            'propagate': False,
        },
    },
}
