# Jazzminsettings import:
from .jazzmin import GLOBAL_JAZZMIN_SETTINGS

# API description import:
from .api import API_DESCRIPTION

# Python libraries import:
from datetime import timedelta
from pathlib import Path
import os

#==========================================================================
#
#                          Application Base Variables
#
#==========================================================================

# Main application Constance's:
# ALLOWED_HOSTS = os.environ.get('DJANGO_ALLOWED_HOSTS', default=['*'])
ALLOWED_HOSTS = ['*']
DEBUG = int(os.environ.get('DEBUG', default=True))
BASE_DIR = Path(__file__).resolve().parent.parent
DJANGO_SETTINGS_MODULE = 'alpenwegs.settings'
APP_NAME = 'AlpenWegs'
VERSION = '0.1a'

# Database Constance's:
DB_PASS = os.environ['DB_PASS']
DB_USER = os.environ['DB_USER']
DB_NAME = os.environ['DB_NAME']
DB_HOST = os.environ['DB_HOST']
DB_PORT = os.environ['DB_PORT']

# Redis Constance's:
REDIS_HOST = os.environ['REDIS_HOST']
REDIS_PORT = os.environ['REDIS_PORT']

# Application keys Constance's:
SECRET_KEY = os.environ.get('SECRET_KEY',
    default='django-insecure-#8$u0eijwv%8v$fm!7z62ogxavmv-prab76=f2mg$63d&6kngj')
CRYPTO_KEY = os.environ.get('CRYPTO_KEY',
    default=b'kKMcugPPwQaft1m4-G9kx7urqWhz6sh0hKcJmFNqiOQ=')

# Add test variable:
os.environ.setdefault(
    'DJANGO_SETTINGS_MODULE',
    'alpenwegs.settings'
)

#==========================================================================
#
#                          Application Base Settings
#
#==========================================================================

# Base Application settings:
INSTALLED_APPS = [
    # Django Jazzmin:
    'jazzmin',
    
    # Django apps:
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'whitenoise.runserver_nostatic',
    'django.contrib.staticfiles',
    'django.contrib.sites',

    # CORS headers:
    'corsheaders',

    # Allauth:
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    "allauth.headless",
    "allauth.usersessions",

    # Allauth social providers:
    # 'allauth.socialaccount.providers.google',
    'allauth.socialaccount.providers.github',

    # GeoDjango:
    'leaflet',
    'django.contrib.gis',

    # Celery and channels:
    'django_celery_beat',
    'channels',

    # Django rest framework:
    'rest_framework_simplejwt.token_blacklist',
    'rest_framework_simplejwt',
    'dj_rest_auth',
    'dj_rest_auth.registration',
    'rest_framework',
    'django_filters',
    'drf_spectacular',

    # AlpenWegs applications:
    'notifications.apps.NotificationsConfig',
    'compendiums.apps.CompendiumsConfig',
    'explorers.apps.ExplorersConfig',
    'profiles.apps.ProfilesConfig',
    'assets.apps.AssetsConfig',
]

# Middleware configuration:
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.locale.LocaleMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'allauth.account.middleware.AccountMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# Main URL file:
ROOT_URLCONF = 'alpenwegs.urls'

# Templates configuration:
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# CORS configuration:
CORS_ALLOWED_ORIGIN_REGEXES = [
    r"^http://5\.180\.148\.151:\d+$",
    r"^http://localhost:\d+$",
    r"^http://127\.0\.0\.1:\d+$",
]
CORS_ALLOW_CREDENTIALS = True

#==========================================================================
#
#                 Application WSGI and ASGI Configuration
#
#==========================================================================

# WSGI and ASGI configuration:
WSGI_APPLICATION = 'alpenwegs.wsgi.application'
ASGI_APPLICATION = 'alpenwegs.asgi.application'

#==========================================================================
#
#              Application Celery and Channels Configuration
#
#==========================================================================

# Celery configuration:
CELERY_BEAT_SCHEDULER = 'django_celery_beat.schedulers:DatabaseScheduler'
CELERY_RESULT_BACKEND = f'redis://{REDIS_HOST}:{REDIS_PORT}'
CELERY_BROKER_URL = f'redis://{REDIS_HOST}:{REDIS_PORT}'
CELERY_ACCEPT_CONTENT = ['application/json']
CELERY_TASK_SERIALIZER = 'json'
CELERY_RESULT_SERIALIZER = 'json'
CELERY_IGNORE_RESULT = True

# Channel configuration:
CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels_redis.core.RedisChannelLayer',
        'CONFIG': {
            'hosts': [f'redis://{REDIS_HOST}:{REDIS_PORT}'],
        },
    },
}

#==========================================================================
#
#                        Application API Configuration
#
#==========================================================================

# Rest framework configuration:
REST_FRAMEWORK = {
    'EXCEPTION_HANDLER': 'alpenwegs.ashared.api.base_response_exception.base_exception_handler',
    'DEFAULT_PAGINATION_CLASS': 'alpenwegs.ashared.api.base_response_pagination.BaseResponsePagination',
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend',
    ],
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        # 'alpenwegs.ashared.api.base_permissions_model.BasePermissionsModel',
        'rest_framework.permissions.AllowAny',
    ],
    'DEFAULT_RENDERER_CLASSES': [
        'alpenwegs.ashared.api.base_response_renderer.BaseResponseRenderer',
        'rest_framework.renderers.BrowsableAPIRenderer',
    ]
}
REST_AUTH = {
    'USE_JWT': True,
    'TOKEN_MODEL': None,
    'REGISTER_SERIALIZER': 'profiles.api.serializers.auth_serializers.UserRegisterSerializer',
    'JWT_AUTH_HTTPONLY': False,
}
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=15),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=10),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': False,
    'UPDATE_LAST_LOGIN': True,
}
REST_USE_JWT = True

# Schema configuration:
SPECTACULAR_SETTINGS = {
    'TITLE': 'AlpenWegs REST API',
    'DESCRIPTION': API_DESCRIPTION,
    'LICENSE': {
        'name': 'Apache v2 License',
    },
    'VERSION': VERSION,
    'SERVE_INCLUDE_SCHEMA': False,
    'COMPONENT_SPLIT_REQUEST': True,
    'SERVE_PERMISSIONS': [
        'rest_framework.permissions.AllowAny',
    ],
    'SWAGGER_UI_SETTINGS': {
        'deepLinking': True,
        'persistAuthorization': True,
        'displayOperationId': True,
        'defaultModelsExpandDepth': 1,
        'defaultModelExpandDepth': 3,
        'docExpansion': 'none',
    },
    'POSTPROCESSING_HOOKS': [
        'alpenwegs.ashared.api.schemas.schema_hooks.retag_auth_endpoints',
    ],
}

#==========================================================================
#
#                    Application User Configuration
#
#==========================================================================

# Default primary key field type:
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Default user model:
AUTH_USER_MODEL = 'profiles.UserModel'
SITE_ID = 1

# Allauth authentication backends:
AUTHENTICATION_BACKENDS = [
    'django.contrib.auth.backends.ModelBackend',
    'allauth.account.auth_backends.AuthenticationBackend',
]

# Allauth:
ACCOUNT_SIGNUP_FIELDS = ['email*', 'username*', 'password1*', 'password2*']
ACCOUNT_USER_MODEL_USERNAME_FIELD = 'username'
# ACCOUNT_EMAIL_VERIFICATION = 'mandatory'
ACCOUNT_PRESERVE_USERNAME_CASING = False
ACCOUNT_USER_MODEL_EMAIL_FIELD = 'email'
ACCOUNT_EMAIL_VERIFICATION = 'optional'
ACCOUNT_LOGIN_METHODS = {'email'}
ACCOUNT_UNIQUE_EMAIL = True

# Email:
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

#==========================================================================
#
#                     Application Database Configuration
#
#==========================================================================

# Database configuration:
DATABASES = {
    'default': {
        'ENGINE': 'django.contrib.gis.db.backends.postgis',
        'NAME': DB_NAME,
        'USER': DB_USER,
        'PASSWORD': DB_PASS,
        'HOST': DB_HOST,
        'PORT': DB_PORT,
    }
}

# Password validation:
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',},
]

# Logger configuration:
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'simple': {'format': '%(asctime)s - %(levelname)s - %(name)s - %(message)s'},
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'simple',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'INFO',
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': 'INFO',
            'propagate': False
        },
        'django.request': {
            'handlers': ['console'],
            'level': 'INFO',
            'propagate': False
        },
        'django.server': {
            'handlers': ['console'],
            'level': 'INFO',
            'propagate': False
        },
    },
}

# Internationalization:
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# Language configuration:
LANGUAGE_CODE = 'en-us'
LANGUAGES = [
    ('en', 'English')
]
LOCALE_PATHS = [
    os.path.join(BASE_DIR, 'locale'),
]

# Internationalization:
USE_I18N = True
USE_TZ = True

# Static files configuration:
STATIC_URL = '/static/'
STATICFILES_DIRS = [
    BASE_DIR / 'static',
]
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_FINDERS = [
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder'
]
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# Default primary key field type:
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Jazzmin configuration:
JAZZMIN_SETTINGS = GLOBAL_JAZZMIN_SETTINGS
JAZZMIN_UI_TWEAKS = {
    'theme': 'litera',
    'body_small_text': True,
    'brand_colour': 'navbar-light',
    'sidebar': 'sidebar-light-primary',
    'theme_color': 'indigo',
    'sidebar_nav_flat_style': True
}

# Leaflet configuration:
LEAFLET_CONFIG = {
    "DEFAULT_CENTER": (47.2, 8.55),
    "DEFAULT_ZOOM": 9,
    "MIN_ZOOM": 2,
    "MAX_ZOOM": 18,
}
