#!/bin/sh

# Setup script for local development
# NOTE: Run this script while in the project root directory.

# Set script to exit on any errors.
set -e

# Install project dependencies.
install(){
  echo 'Installing project dependencies...'
  pip install -r requirements/testing.txt
  # npm install
  # grunt build

}

# Setup local data store in sqlite3
dbsetup(){
  source .env
  echo 'Loading college data into local test database'
  python manage.py syncdb --noinput --no-initial-data
  python manage.py migrate paying_for_college
  python manage.py loaddata collegedata.json
  # python manage.py rebuild_index
}

install
dbsetup
