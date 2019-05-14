from __future__ import absolute_import

from .dev import *


STANDALONE = True

SECRET_KEY = "forstandaloneonly"

HAYSTACK_CONNECTIONS = {'default':
                        {'ENGINE':
                         ('haystack.backends.elasticsearch_backend.'
                          'ElasticsearchSearchEngine'),
                         'URL': '127.0.0.1:9200',
                         'INDEX_NAME': 'build_haystack'}}
