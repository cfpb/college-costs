#! /bin/bash
# run python unittests

cd paying_for_college/
coverage run --source='.' manage.py test
coverage report -m
