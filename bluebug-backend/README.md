# BlueBug Backend

Django REST Framework backend for the BlueBug portfolio + lead-generation site.

## Stack
- Django 6.1 + Django REST Framework
- PostgreSQL (prod) / SQLite (dev)
- django-unfold (admin UI)
- Sentry (error monitoring)
- WhiteNoise (static files)
- Gunicorn (WSGI server)

## Local Setup

```bash
cd bluebug-backend
python -m venv ../venv
../venv/Scripts/activate  # Windows
pip install -r requirements/dev.txt
cp .env.example .env      # Fill in values
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health/` | DB connectivity health check |
| GET | `/api/projects/` | List all projects (`?category=`, `?featured=true`) |
| GET | `/api/projects/<slug>/` | Single project case study |
| GET | `/api/testimonials/` | Published testimonials only |
| GET | `/api/services/` | Service offerings |
| GET | `/api/team/` | Team members |
| POST | `/api/leads/` | Contact form submission (rate-limited: 5/hr/IP) |

## Deployment (Railway)

1. Set environment variables in Railway dashboard:
   - `DJANGO_SETTINGS_MODULE=config.settings.prod`
   - `SECRET_KEY=<generate with: python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())">`
   - `DATABASE_URL=<Railway PostgreSQL URL>`
   - `ALLOWED_HOSTS=api.yourdomain.com`
   - `CORS_ALLOWED_ORIGINS=https://yourdomain.com`
   - `SENTRY_DSN=<your sentry DSN>` (optional but recommended)

2. Enable automated daily backups on the Railway PostgreSQL instance.

3. The `Procfile` already configures Gunicorn correctly.

## Security Checklist (Section 9 from spec)

- [x] `DEBUG=False` guaranteed in `prod.py` (hardcoded, not env-overridable)
- [x] All secrets via environment variables
- [x] Lead endpoint rate-limited (5/hr/IP)
- [x] CORS locked to specific frontend domains in prod
- [x] HSTS + SSL redirect in prod
- [x] Secure session + CSRF cookies in prod
- [x] Custom exception handler — no raw tracebacks to client
- [x] Image upload validation (type + size)
- [x] Input sanitization on all Lead fields
- [x] N+1 query prevention (prefetch_related on case study)
- [x] Health check endpoint with real DB query
- [x] Structured logging to stdout (Railway captures it)
- [x] Sentry wired in for prod + staging
