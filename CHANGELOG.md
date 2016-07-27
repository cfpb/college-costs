All notable changes to this project will be documented in this file.
We follow the [Semantic Versioning 2.0.0](http://semver.org/) format.

## Unreleased
- Show recalculation updates on mobile screens
- Added a file-exists check to update_ipeds script
- Fixed errors in the static content and error messaging
- Adjusted dynamic showing/hiding for job placement rate content
- Adjusted dynamic showing/hiding for program type content
- Altered the Program model to return only program lengths that are divisible by 6
- Hide the graduation rate cohort paragraph if that data isn't available
- Added functions to update_ipeds to create new school entries from IPEDS data
- Changed the Contact model's 'contact' field to a 'contacts' field to allow multiple school contacts
- Fixes for gradPlus fields, tuition payment plans, and the expenses section
- Fixes for 0% interest rates, perkins visibility, and grad overcap messages
- Update debt summary text for program durations less than one year.

## 2.1.4
- Added string checking for program codes
- Refined input of Pell Grants and family contributions
- Added a test so that notifications can't be sent to non-settlement schools
- Updated standalone search configs for running Elasticsearch locally
- Changed BLS json keyword for tax expenses to single word: "Taxes"
- Added an 'update_ipeds' script and manage.py command for annual updates
- Updated standalone requirements to Django==1.8.13 to match our servers
- Added 2 new fields, 'completion_cohort' and 'completers' to Program object
- Separate out private loans and tuition payment plans in the HTML/CSS
- Remove JS functions for combining family contributions with Parent PLUS loans
- Reorder and fix styles in the budget worksheet
- Show and hide content or offer sections depending on the program values and passed URL values
- Update Step 3 illustration for "think about working while you study"
- Make the tuition and fees field editable
- Adjust load_programs to fix rates > 1
- Update NPM packages and security policy
- Only hide total direct cost and tuition payment plans if the URL value is $0 or missing
- Tuition repayment plan calculations integrated into front-end
- Show recalculation updates on non-mobile screens
- Added purge functions for notifications and programs
- Added function to deliver program_length as even value
- Updated constant rates and caps with 2016 values

## 2.1.3
- Added load tests
- Error checking added to program view
- Error checking added to verification view
- removed 6 unneeded fields from school json payload
- Added notifications script and 2 fields to Notification model for errors
- Made program code required/program name not required in load programs script
- Made school name bold
- Use total direct cost value from offer URL
- Update toggle functionality, interactions, and dynamic content
- Addressed security vulnerability report in NPM dependencies
- Used total direct cost value from offer URL
- Updated toggle functionality, interactions, and dynamic content
- Fixed `median_salary` reference in load_programs and added test data
- Added management commands for notifications
- Make Step 1 summaries sticky if scrolling out of section to be edited

## 2.1.2
- Parent PLUS loans separated from other family contributions
- fix migrations for deployment, adding 0003
- Perkins loans hidden for schools that do not offer them
- Added a manage.py command for updating college data
- BLS data imported from expenses API
- BLS data set by program BLSAverage region
- BLS data set by program expected salary
- Expenses section BLS region selecter added
- Added "your salary and total student debt" section in step 2
- Added graduation rate and loan default rate external links
- Changed the scale of the loan default rate graph to 40%
- General code housekeeping (GitHub templates, linting improvements)
- Added load programs script
- loanDefaultRate values (three of them) removed from national-stats API calls
- metric-view refactored
- 10/25 loan term toggles added to metrics section
- Include half year options for program length
- Shift line item dollar signs over to accommodate six figure values
- add `operating` field to admin
- added a check to fetchProgramData() for offers with no pid
- added capture of bad URS in the API program view
- Modified Step 3 design and content
- added error notifications for calculation errors
- added contact and links to collegedata

## 2.1.1
- Parent PLUS loans separated from other family contributions
- Fixed migrations for deployment, adding 0003
- Adjusted setup.py to include fixtures and templates

## 2.1.0
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
- Updated format-usd to 1.0.1
- Removed the '.json' suffix from the API call /api/school/[SCHOOL ID]/
- Added an interaction between Step 1 and Step 2
- Added school filtering for the Django admin
- Removed national average graph data & explanatory boxes for settlement schools
- Added an interaction between Step 1 and Step 2
- Added school filtering for the Django admin
- Fix handling of ownership and control values in update_colleges script
- Added anticipated total direct cost to verification section
- Fixed file path for BLS json import in views

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
