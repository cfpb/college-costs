#! /bin/bash
# run python unittests

cd paying-for-college/
coverage run --source='.' manage.py test
coverage report -m
