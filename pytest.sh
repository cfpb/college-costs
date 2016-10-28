#! /bin/bash
# run python unittests
set -e

coverage run manage.py test > /dev/null
coverage report -m
