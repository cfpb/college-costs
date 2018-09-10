#!/bin/sh

# Setup script for local development
# NOTE: Run this script while in the project root directory.

# Set script to exit on any errors.
set -e

init(){
  DATABASE="paying_for_college/db.sqlite3"
}

# Install project dependencies.
install(){
  echo 'Installing front-end resources...'
  ./setup.sh
}

# Setup local data store in sqlite3
dbsetup(){
  source .env
  echo 'Loading requirements...'
  pip install -e '.[docs,testing]'
  if [ -f $DATABASE ]; then
    echo 'Removing existing database...'
    rm -f $DATABASE
  fi
  echo 'Applying migrations...'
  python manage.py migrate
  echo 'Loading college data into local test database...'
  python manage.py loaddata collegedata
  # python manage.py rebuild_index
}

install
dbsetup
