#! /bin/bash
# run python unittests

# coverage run --source='.' manage.py test > /dev/null
coverage run manage.py test > /dev/null
coverage report -m
