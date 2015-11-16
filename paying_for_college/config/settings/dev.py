from __future__ import absolute_import
from .base import *

DEBUG = True

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': PROJECT_ROOT.child('db.sqlite3'),
    }
}
