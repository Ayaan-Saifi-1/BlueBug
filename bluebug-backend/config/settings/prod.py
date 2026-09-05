"""
Production settings — DEBUG structurally False, HTTPS enforced, Sentry live.
Railway/Render deployment ke liye yahi file use hogi.
DJANGO_SETTINGS_MODULE=config.settings.prod
"""
from .base import *
import sentry_sdk
from sentry_sdk.integrations.django import DjangoIntegration

# -------------------------------------------------------------------
# DEBUG is ALWAYS False in prod — hardcoded, env se override nahi hoga
# -------------------------------------------------------------------
DEBUG = False

ALLOWED_HOSTS = env.list('ALLOWED_HOSTS', default=['api.bluebug.xyz'])

# -------------------------------------------------------------------
# CORS — sirf frontend domains ko allow karo, kabhi * nahi
# -------------------------------------------------------------------
CORS_ALLOWED_ORIGINS = env.list(
    'CORS_ALLOWED_ORIGINS',
    default=['https://bluebug.xyz', 'https://www.bluebug.xyz']
)
CORS_ALLOW_CREDENTIALS = False

# -------------------------------------------------------------------
# Database — PostgreSQL via DATABASE_URL env var
# -------------------------------------------------------------------
DATABASES = {
    'default': env.db('DATABASE_URL')
}
DATABASES['default']['CONN_MAX_AGE'] = 60  # connection pooling

# -------------------------------------------------------------------
# Security headers — HTTPS pe mandatory
# -------------------------------------------------------------------
SECURE_SSL_REDIRECT = True
SECURE_HSTS_SECONDS = 31536000          # 1 year
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_BROWSER_XSS_FILTER = True
SESSION_COOKIE_SECURE = True
SESSION_COOKIE_HTTPONLY = True
CSRF_COOKIE_SECURE = True
CSRF_COOKIE_HTTPONLY = True
X_FRAME_OPTIONS = 'DENY'

# -------------------------------------------------------------------
# Static files — WhiteNoise se serve karo (Cloudinary/S3 ke bina bhi kaam karta hai)
# Prod me media files Cloudinary se serve karein — yahan fallback local hai
# -------------------------------------------------------------------
MIDDLEWARE.insert(1, 'whitenoise.middleware.WhiteNoiseMiddleware')
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# -------------------------------------------------------------------
# Email — prod me real SMTP
# -------------------------------------------------------------------
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = env('EMAIL_HOST', default='smtp.gmail.com')
EMAIL_PORT = env.int('EMAIL_PORT', default=587)
EMAIL_USE_TLS = True
EMAIL_HOST_USER = env('EMAIL_HOST_USER', default='')
EMAIL_HOST_PASSWORD = env('EMAIL_HOST_PASSWORD', default='')
DEFAULT_FROM_EMAIL = env('DEFAULT_FROM_EMAIL', default='noreply@bluebug.xyz')

# -------------------------------------------------------------------
# Sentry — prod aur staging me errors track karte hain
# -------------------------------------------------------------------
SENTRY_DSN = env.str('SENTRY_DSN', default='')
if SENTRY_DSN:
    sentry_sdk.init(
        dsn=SENTRY_DSN,
        integrations=[DjangoIntegration()],
        traces_sample_rate=0.2,        # 20% transactions trace karo — free tier limit
        profiles_sample_rate=0.1,
        send_default_pii=False,         # PII kabhi mat bhejo Sentry ko
        environment='production',
    )
