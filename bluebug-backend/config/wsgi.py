"""
WSGI config for BlueBug backend.
Production me DJANGO_SETTINGS_MODULE=config.settings.prod set karna zaroori hai.
"""
import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.dev')

application = get_wsgi_application()
