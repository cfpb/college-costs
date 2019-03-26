As of version 2.4.0, this project no longer uses `CHANGELOG.md`
to track released changes.

See the project repository release history at:

https://github.com/cfpb/college-costs/releases

You can find the release notes for versions prior to 2.4.0 below.

---

## 2.3.12
- Fix update_via_api script to handle longer ZIP codes coming from the Scorecard API

## 2.3.11
- Cleans up the Open Graph overrides for social sharing and adds to additional pages

## 2.3.10
- Update social images

## 2.3.9
- Configure travis to build wheels

## 2.3.8
- Fix bugs

## 2.3.7
- Improve handling of bad URLs or URL values in Feedback model method

## 2.3.6
- Modified Google Analytics question event to fire independent of settlement status

## 2.3.5
- Fixed Google Analytics events on "Yes" and "Not sure" buttons

## 2.3.4
- Add abstract model for Feedback and Notification

## 2.3.3
- Improved error handling for program CSVs to catch BOM and bad ope_id values
- New model methods on the Feedback model to assist in disclosure troubleshooting
- Fix in the `update_colleges` script to capture grad_rate properly

## 2.3.2
- Bumped snyk dependency to 1.24.6

## 2.3.1
- Added url field to Feedback model
- Fixed CSS static calls for feedback pages

## 2.3.0 - 2017-01-19
- Updated school model to remove settlement_school options
- Fixed CSS issue on feedback page
- Prepped for onboarding school system
- Added Google Analytics module and event triggers.

## 2.2.9
- Updated `load_programs` to load from specific s3 bucket location

## 2.2.8
- Fixed Python unit tests when run as part of cfgov-refresh.
- Removed debug print statements from Python unit tests.
- Added handling for a new disclosure URL field, `leng`

## 2.2.7
- Updated the `load_programs` script to be compatible with djangorestframework 3.1.3
- Updated the URL for national statistics to follow moving of Dept. of Education repo.
- Updates to the 'collegedata.json' fixture were backported from production, based on 2014-2015 values.
- The console message for the update-via-api management command was changed to note the Salary year being used.

## 2.2.4
- Prevented creation of notifications if a school has no contact info
- Allowed offer IDs of up to 128 characters, up from 40

## 2.2.3
- Added a script to tag settlement schools using an S3 csv of school IDs
- Added manage command to run update_national_stats_file

## 2.2.2
- Switch to djangorestframework==2.4.8 to match servers

## 2.2.1
- Added model function for exporting program as CSV
- Added management command for purging test programs
- Added docs/ directory and MkDocs framework to publish URL and CSV specs
- Marked all non-settlement schools with the `settlement_school` tag of "demo"

## 2.2.0 - 2016-08-18
- Release for school review
- Fixed wording in costs section after BLS review

## 2.1.8
- Fixed GradPlus and over-borrowing calculations
- Student-debt-calc bumped to v. 2.6.0

## 2.1.7
- Added security updates
- Fixed reporting of Perkins loan caps

## 2.1.6
- Add technical notes on the About This Tool page
- Make loan origination fees dynamic from the API
- Changed display of graph notifications for settlement school status
- Added page-level error for URL offers with bad ipeds
- Turned off auxiliary page URLs and the landing page, except in standalone
- Added `s3=True` option to `load_programs` to load CSVs straight from s3
- Fixed constant values for DLOriginationFee and plusOriginationFee
- Switches salary content to school phrasing if we have no program salary data
- Hides salary content with a warning if only national data available
- Tweaks wording around program vs school level for metric graphs
- Updates loan origination fee displays to work with corrected constants
- Fix alignment issues in debt summary
- Update our national statistics from scorecard project
- Consolidate how input elements are updated
- Fix input errors if attempting to borrow more than total cost of attendance
- Add form-level error for bad program ID
- Update national stats to deliver generic stats at /api/national-stats/
- simplify warnings for ID problems
- make bare /offer/ URL return blank disclosure
- Updated the budget section to better message lack of salary data
- Fixed how data flows into the About This Tool page
- don't treat PID as numeric in js -- characters are allowed
- Changed `/national-stats/` API to deliver a `nationalSalary` value of $34,300 regardless of program length

## 2.1.5
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
- Updated collegedata fixture to make sure all EDMC schools are marked as non-Perkins
- Update debt summary text for program durations less than one year.
- Added privateLoanFee constant to the database
- Added unicode-aware csv module
- Refactored the offer view to allow bad school, program and offer IDs
- Set total program debt multiplier minimum to 1.
- Refactored the load_programs script to handle non-utf-8 encoding
- Renamed salary variables to 'programSalary,' 'schoolSalary,' and 'nationalSalary' to distinguish data sources
- Adjust the update_ipeds script to create new schools first, so they get updated with IPEDS data too
- Tweaked load_programs to fall back to windows-1252
- Added new constant `constantsYear` and changed API and salary year vars to `apiYear` and `salaryYear`
- Adjusted update_ipeds script to get most recent year and to deliver sorted json for PR sanity

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

## 2.1.0 - 2016-05-25
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


## 2.0.0 - 2016-02-22

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
