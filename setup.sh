#!/bin/sh

# Setup script for local development
# NOTE: Run this script while in the project root directory.

# Set script to exit on any errors.
set -e

# Install project dependencies.
install(){
  echo 'Installing project dependencies...'
  pip install -r requirements/base.txt
  # npm install
  # bower install --config.interactive=false

  # Update test dependencies.

  # Protractor - JavaScript acceptance testing.
  # ./$NODE_DIR/protractor/bin/webdriver-manager update

  # Tox - Django server unit testing.
  # pip install tox
}

# Setup local data store in sqlite3
dbsetup(){
  echo 'Loading college data into local test database'
  cd 'paying-for-college'
  python manage.py makemigrations
  python manage.py migrate
  python loaddata colleges.json
}

install
dbsetup
