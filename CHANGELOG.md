All notable changes to this project will be documented in this file.
We follow the [Semantic Versioning 2.0.0](http://semver.org/) format.

## Unreleased
- Pinned and shrinkwrapped NPM dependencies
- Added `snyk` to monitor for known NPM package vulnerabilities.
- Updated the project to Django 1.8 and removed solr dependencies
- Update the standalone templates to use on-demand-like header/footer
- Updated Capital Framework versions from 1.0.0 to 3.4.1
- Removed Bower as a build process
- Updated all NPM packages to latest non-breaking versions
- Revised the standalone setup build process to create a clean build on run
- Fixed an incorrect variable in `disclosures.less`
- Fixed a bug with the global eyebrow language list
- Addded more granular BLS data and a new API endpoint to deliver it
- Added a 'offers_perkins' field for the Student model
- Added a 'settlement_school' field for the Student model
- Removed the '.json' suffix from the API call /api/school/[SCHOOL ID]/
- Restored `nationalData` object to offer view

- Added an interaction between Step 1 and Step 2

## 2.0.4
- Notifications enabled

## 2.0.3
- Added animation to button interactions
- Change graphs to get all values from the financial model

## 2.0.2
- Add active class to selected big question button
- Fix graph point overlaps
- Adds avg_net_price to scorecard api updates
- Added animation to button interactions
- Switched to `merge=union` for CHANGELOG.md in .gitattributes
- Hot fix for aligning debt values with content intent

## 2.0.1
- Updated content to be dynamic based on remaining cost
- Added interaction and animation for answering the question
- Changed app to utilize AJAX API calls instead of expecting window objects
- Visibility of gradplus loan determined by program level
- undergrad property of financial model determined by program level
- Currency formatting for all currency values on page
- Added graph notifications
- Fix for expense calculations
- nationalData now retrieved via AJAX from API
- Changed url for "about this tool" page to /about-this-tool/
- Added "About this tool" section and content
- Updated content to pre-clearance version for settlement students
- Added debt burden calculations and notifications
- Added script for sending test notifications

## 2.0.0
### Added/updated
- New url for handling querystring offer data
- Added notification functionality for disclosures
- Added user interface for adding and removing private loans
- Update version of student-debt-calc to support multiple private loans
- Updated dispatchers to handle multiple private loans
- Updated DOM and JS to display totals properly
- Update content to be dynamic based on API and offer data
- Added printing ability across devices

### Removed
- API code for saving and revisiting worksheets

## 1.1.0 - 2015-10-28

### Initial refactoring
- Retooling comparisontool as a disclosures app

### Added
- new models for school program data and constants
- extended model for schools
- tests and test framework
