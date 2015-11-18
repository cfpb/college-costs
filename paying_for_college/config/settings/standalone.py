from __future__ import absolute_import
from .dev import *

STANDALONE = True

STATICFILES_DIRS = (
    PROJECT_ROOT.child('local_static'),
)
