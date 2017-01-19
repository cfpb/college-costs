## CSV specifications for program data
The CSV should be UTF-8 encoded and must be delivered to the CFPB via sFTP.  

#### Column names and types for college program data
The eight boldface fields are required. Data submissions will be rejected if these fields are missing or blank, or if a program code contains illegal characters.

A sample CSV in the correct format can be [downloaded here](http://files.consumerfinance.gov.s3.amazonaws.com/pb/paying_for_college/csv/sample-program.csv).

name | type | note
:--- | :--- | :---
**ipeds_unit_id** | integer | will be used as the canonical 6-digit school ID
**program_code** | string | assumed unique within a school; <br>can't contain these characters: ; < > { } _
**program_name** | string |
**program_length** | integer | standard number of months to complete program
**program_level** | integer | 0 = Non-degree-granting<br> 1 = Certificate<br> 2 = Associate<br> 3 = Bachelor's<br> 4 = Graduate
**books_supplies** | integer | annual cost of books and supplies
**total_cost** | integer | total attendance cost for completing an entire program
**tuition_fees** | integer | annual cost of tuition and fees
accreditor | string | 
average_time_to_complete | integer | in months
campus_name | string
cip_code | string | used to look up related career/field
completers | integer | number in cohort who completed the program
completion_rate | float | 0.41 (would signify 41%)
completion_cohort | integer | number of students who enrolled in the program
default_rate | float |0.25
job_placement_rate | float | 0.33
job_placement_note | string | optional note on job rate
mean_student_loan_completers | integer | average of amounts grads owe
median_salary | integer |
median_student_loan_completers | integer | median of amounts grads owe
ope_id | string | alternate Dept. of Ed school ID as backup
soc_codes | string | pipe-separated list of related career/fields

#### Change log
Change | date
:----- | :---
Added note on sFTP delivery | 2017-01-09
Added boldface to required fields | 2016-10-21
Noted ipeds_unit_id is an integer | 2016-08-24
Added underscore to list of characters not allowed in a program code | 2016-08-24
Added notes indicating that books_supplies and tutiion_fees should be annual values | 2016-07-26
Added 'completion_cohort' and 'completers' values | 2016-07-11
Added illegal character list for program codes | 2016-07-01
Added requirement for UTF-8 encoding | 2016-06-29
Restored 'program_length' field, which was initially provided as 'monthsinprogram' | 2016-02-14
Added 0 as possible value for program_level, to match Ed. Dept. mappings | 2016-02-11
Changed average_salary to median_salary | 2016-01-28
Job_placement_note type changed to string | 2016-01-12
Note added to program_level to specify values | 2016-01-12
Fixed typo in note on median_student_loan_completers: it represents median not mean | 2016-01-12
