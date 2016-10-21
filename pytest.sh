#! /bin/bash
# run python unittests

coverage run manage.py test > /dev/null
coverage report -m
