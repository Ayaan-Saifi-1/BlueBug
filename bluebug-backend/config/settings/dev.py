"""
Dev settings — DEBUG on, SQLite, CORS open, verbose logging.
Kabhi bhi is file ko production me use mat karna.
"""
from .base import *

DEBUG = True

ALLOWED_HOSTS = ['localhost', '127.0.0.1', '0.0.0.0']

# Dev me sabko allow karo — prod me explicit list hogi
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = False

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Dev me loud logging — sab kuch dikhao
LOGGING['loggers']['apps']['level'] = 'DEBUG'
LOGGING['root']['level'] = 'INFO'

# Dev me email console me — real send mat hoga
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
