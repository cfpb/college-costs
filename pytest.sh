#! /bin/bash
# run python unittests

export DJANGO_SETTINGS_MODULE=paying_for_college.config.settings.standalone
coverage run --rcfile=.coveragerc --source='.' manage.py test
coverage report -m
