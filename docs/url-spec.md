## URL specifications for offer data

#### Mapping url fields to data points
Values should be annual unless otherwise specified.

This scheme results in URLs about 400 characters long, well below browser/server character limits.  
Here's what a full URL would look like:
<br>
consumerfinance.gov/paying-for-college2/<br>
understanding-your-financial-aid-offer/offer/?<br>
iped=204316&pid=business-1042&oid=a9e280139f3238cbc9702c7b0d62e5c238a835a0<br>
&book=650&gib=3000&gpl=1000&hous=3000&insi=4.55&insl=3000&inst=36<br>
&mta=3000&othg=100&othr=500&parl=10000&pelg=1500&perl=3000<br>
&ppl=1000&prvl=3000&prvf=2.1&prvi=4.55&schg=2000&stag=2000<br>
&subl=3500&totl=40000&tran=500&tuit=38976&unsl=2000&wkst=3000
<br>

#### Value details
- School IDs (iped) must be an integer.
- Program IDs (pid) must not contain these characters: `; < > { } _`
- Offer IDs (oid) must contain only hex characters: a-f, 0-9

The values below are just examples to show type.   
Rates can be more precise than two decimal places, but may be rounded for display.  
Dollar amounts should be in rounded whole numbers.  

In URL | Description | Example value | Note
:----- | :---------  | :------------ | :---
iped | college ID | 123456 | 6-digit integer: the unit ID from IPEDS
pid  | program ID | business-981 | string: this would be combined with school ID to get a unique program
oid  | offer ID | 9e0280139f3238cbc970<br>2c7b0d62e5c238a835d0 | 40-hex-character hashed value: represents one offer to one student. First 7 characters should be given to the student for matching with the disclosure page.
book | books | 650 | books + supplies
gib  | gi bill | 3000 |
gpl  | grad plus loans | 1000 |
hous | housing | 3000 | room + board
insi | institutional (school) loan interest rate | 0.0455 | rates should be expressed as coefficients, so 4.55% is 0.0455
insl | institutional loans (all) | 3000 | including tuition payment plans
inst | institutional loan term | 48 | in months
mta  | military assistance | 3000 |
othg | other grants and scholarships | 100 |
othr | other costs | 500 |
parl | parent loans | 10000 | includes all family contributions (except parent plus loans)
pelg | pell_grant | 1500 |
perl | perkins loans | 3000 |
ppl  | parent plus loans | 1000 |
prvl | private loans | 3000 |
prvf | private loan origination fee | 0.021 | coefficient, not percentage point
prvi | private loan interest | 0.0455 | coefficient, not percentage point
schg | school grants and scholarships | 2000 |
stag | state grants | 2000 |
subl | subsidized loans | 3500 |
totl | total direct cost | 40000 | tuition, fees, books, supplies
tran | transportation | 200 |
tuit | tuition | 38976 | annual tuition + fees
unsl | unsubsidized loans | 2000 |
wkst | work study | 3000 |

#### Change log
Change | date
:----- | :---
Added underscore to list of characters not allowed in a program ID | 2016-08-24
Added note that values should be annual unless otherwise specified | 2016-07-26
Added note for parl: it represents all family contributions | 2016-07-19
Added notes on expressing rates and fees | 2016-07-15
Added `totl` field | 2016-06-22
Added `prvf` and `inst` fields | 2016-05-27
Removed the `fam` and `ta` fields | 2015-01-12
