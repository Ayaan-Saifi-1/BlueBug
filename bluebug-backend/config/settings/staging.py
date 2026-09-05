"""
Staging settings — prod jaisa lekin Railway preview environment ke liye.
DJANGO_SETTINGS_MODULE=config.settings.staging
"""
from .prod import *

# Staging me bhi DEBUG False — prod jaise exact behavior test karo
DEBUG = False

ALLOWED_HOSTS = env.list('ALLOWED_HOSTS', default=['staging-api.bluebug.xyz', 'localhost'])

# Staging frontend
CORS_ALLOWED_ORIGINS = env.list(
    'CORS_ALLOWED_ORIGINS',
    default=['https://staging.bluebug.xyz', 'http://localhost:3000']
)

# Sentry — staging ka apna environment label
if SENTRY_DSN:
    import sentry_sdk
    sentry_sdk.init(
        dsn=SENTRY_DSN,
        traces_sample_rate=1.0,   # Staging me 100% trace karo — identify issues fast
        environment='staging',
        send_default_pii=False,
    )
