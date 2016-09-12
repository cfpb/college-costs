## Offer IDs

Offer IDs allow a school to provide a disclosure of a student's enrollment offer without revealing who the student is. They also allow the CFPB to send a confirmation to the school after a disclosure is reviewed.

Only the school will know which student the offer ID applies to.

Two important details to note:  

- **The first seven characters in the offer ID should be given to the student so that she can confirm on the  disclosure page that the offer is hers.** 
- **An offer ID can be used only once.**  
If an offer ID generates a notification, either successful or with an error, it cannot be used again to validate an offer. If a student needs to re-evaluate an offer, a new offer ID needs to be generated and used in a new offer URL. 

## Technical details
We chose a 40-hex-character hash as the form for an offer ID because it has two advantages:  

- Unique hash values are easy to create in a way that cannot be traced back to a student.
- The hashes contain only numbers and the letters a-f and are safe to transmit and accept.

The school is free decide how to generate the offer IDs, but they need to be unique.   
One easy method would be to combine a timestamp and another value -- such as a student ID or a random number or phrase -- and generate a SHA-1 hash from the combined values.

Following is an example Python function that does just that.

```python
import hashlib
import datetime


def create_hash(value):
    val = value + datetime.datetime.now().isoformat()
    return hashlib.sha1(val).hexdigest()
```

This would return a unique offer ID that could be used as the 'oid' value in a student's offer URL.  
If run again, even with the same input value, it would generate a new unique ID, because a new timestamp is used in creating each hash.

The school could then keep a record of the ID and the student it is for, and use it in the student's disclosure URL as spelled out in our [URL specification](https://cfpb.github.io/college-costs/url-spec/).

## A helper script

The hashing function above is part of an offer-generating script that is [available for download](http://files.consumerfinance.gov.s3.amazonaws.com/pb/paying_for_college/scripts/create_offer_ids.py). When run from a shell command line, the script can be used to create a single ID or a whole batch of IDs, and the result can be saved as a spreadsheet.

The command to use the script takes this form:

```
python create_offer_ids.py "VALUE" [--number N] [--csv]
```

- VALUE is a word or phrase of your choice, used to increase randomness.
- The `--number` option allows you to provide a number [N] of IDs you'd like to create.
- The `--csv` option tells the script to create a spreadsheet containing the new IDs.

Example usages:

```
python create_offer_ids.py "go tigers"
```

This will return a single unique offer ID, something like this:  
`2df92217303700c6165d56a24b89cef419133a89`


```
python create_offer_ids.py "go tigers" --number 2
```

This will return two unique offer IDs, such as  
```4e259e04a2265b2d3d1114e3f66cb41a44f5be91```  
```ee350cdc99747d7b85e3556ef1d99ef2b0d1f8b0```


```
python create_offer_ids.py "go tigers" --number 200 --csv
```

The program will now return a message like this:  
```200 offer IDs were output to 'student_offer_ids_2016-10-11.csv'```

The CSV could be opened in a program such as Excel and used to assign IDs to prospective students.

Notes:  
- The date tag in the CSV's name depends on the day the script is run.  
- If run with the `--csv` option multiple times on the same day, the new IDs will be appended to the first CSV created that day, if it hasn't been moved to a different directory.
- If run on another day, a new CSV would be created with that day's date in the name.
