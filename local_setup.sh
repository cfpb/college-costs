#!/bin/sh

# Setup script for local development
# NOTE: Run this script while in the project root directory.

# Set script to exit on any errors.
set -e

# Install project dependencies.
install(){
  echo 'Installing project dependencies...'
  pip install -r paying_for_college/requirements/base.txt
  # npm install
  # grunt build

}

# Setup local data store in sqlite3
dbsetup(){
  echo 'Loading college data into local test database'
  python manage.py makemigrations
  python manage.py migrate
  python manage.py loaddata colleges.json
  python manage.py collectstatic --noinput
#  python manage.py rebuild_index
}

install
dbsetup
