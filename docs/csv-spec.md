## CSV specifications for program data
The CSV should be UTF-8 encoded.  

#### Column names and types for incoming college program data

name | type | note
:--- | :--- | :---
ipeds_unit_id | integer | will be used as the canonical 6-digit school ID
ope_id | string | alternate Dept. of Ed school ID as backup
program_code | string | assumed unique within a school; <br>can't contain these characters: ; < > { } _
program_name | string |
program_length | integer | number of months in program
program_level | integer | 0 = Non-degree-granting<br> 1 = Certificate<br> 2 = Associate<br> 3 = Bachelor's<br> 4 = Graduate
accreditor | string | often will be blank
median_salary | integer |
average_time_to_complete | integer | in months
books_supplies | integer | annual cost of books and supplies
campus_name | string
cip_code | string | used to look up related career/field
completion_rate | float | 0.41 (would signify 41%)
completion_cohort | integer | number of students who enrolled in the program
completers | integer | number in cohort who completed the program
default_rate | float |0.25
job_placement_rate | float | 0.33
job_placement_note | string | optional note on job rate
mean_student_loan_completers | integer | average of amounts grads owe
median_student_loan_completers | integer | median of amounts grads owe
soc_codes | string | pipe-separated list of related career/fields
total_cost | integer | total attendance cost
tuition_fees | integer | annual cost of tuition and fees

#### Change log
Change | date
:----- | :---
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
