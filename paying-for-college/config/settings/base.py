# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import os
import base64
from unipath import Path

REPOSITORY_ROOT = Path(__file__).ancestor(4)
PROJECT_ROOT = Path(__file__).ancestor(3)

SECRET_KEY = os.getenv('DJANGO_SECRET_KEY',
                       base64.b64encode(os.urandom(64)))[:50]

DEBUG = False

ALLOWED_HOSTS = []

INSTALLED_APPS = (
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.humanize',
    'haystack',
    'disclosures',
    'debt',
    # 'guides',
)

HAYSTACK_SOLR_URL = 'http://127.0.0.1:8983/solr'
HAYSTACK_CONNECTIONS = {
    'default': {
        'ENGINE': 'haystack.backends.solr_backend.SolrEngine',
        'URL': 'http://localhost:9001/solr/default',
        'TIMEOUT': 60 * 5,
        'INCLUDE_SPELLING': True,
        'BATCH_SIZE': 100,
        'EXCLUDED_INDEXES': ['thirdpartyapp.search_indexes.BarIndex'],
    },
    # 'autocomplete': {
    #     'ENGINE': 'haystack.backends.whoosh_backend.WhooshEngine',
    #     'PATH': '/home/search/whoosh_index',
    #     'STORAGE': 'file',
    #     'POST_LIMIT': 128 * 1024 * 1024,
    #     'INCLUDE_SPELLING': True,
    #     'BATCH_SIZE': 100,
    #     'EXCLUDED_INDEXES': ['thirdpartyapp.search_indexes.BarIndex'],
    # },
    # 'slave': {
    #     'ENGINE': 'xapian_backend.XapianEngine',
    #     'PATH': '/home/search/xapian_index',
    #     'INCLUDE_SPELLING': True,
    #     'BATCH_SIZE': 100,
    #     'EXCLUDED_INDEXES': ['thirdpartyapp.search_indexes.BarIndex'],
    # },
    'db': {
        'ENGINE': 'haystack.backends.simple_backend.SimpleEngine',
        'EXCLUDED_INDEXES': ['thirdpartyapp.search_indexes.BarIndex'],
    }
}

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.auth.middleware.SessionAuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'django.middleware.security.SecurityMiddleware',
)

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [PROJECT_ROOT.child('templates'),
                 '/Users/higginsw/Projects/UnityBox/cfpb_django/apps/django-cfgov-common/cfpb_common/templates'],
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

WSGI_APPLICATION = 'config.wsgi.application'


# Internationalization
# https://docs.djangoproject.com/en/1.8/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.8/howto/static-files/

STATIC_URL = '/static/'
STATIC_ROOT = PROJECT_ROOT.child('static')
# STATIC_ROOT = '/Users/higginsw/Projects/college-costs/paying-for-college/static/'
