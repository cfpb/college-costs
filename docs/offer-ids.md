## Offer IDs

Offer IDs allow a school to provide a disclosure of a student's enrollment offer without revealing who the student is. They also allow the CFPB to send confirmations to the school that a disclosure was reviewed by a student, but without transmitting any information about the student.

Only the school will know which student the offer ID applies to.

Two important details to note:  

- **The first seven characters in the offer ID should be given to the student so that she can confirm on the  disclosure page that the offer is hers.** 
- **An offer ID can be used only once.**  
If an offer ID generates a notification, either successful or with an error, it cannot be used again to validate an offer. If a student needs to re-evaluate an offer, an new offer ID needs to be generated and used in a new offer URL. 

## Technical details
We chose a 40-hex-character hash as the form for an offer ID because it has two advantages:  

- The hashes contain only numbers and the letters a-f and are safe to transmit and accept.
- Unique hash values are easy to create in a way that cannot be traced back to a student.

The school can decide what values to use to generate the offer ID hashes. 
One easy method would be to combine a timestamp and another value -- such as a student ID or even a completely random number or numbers -- and generate a SHA-1 hash from those values.

Following is a short Python script that generates such a hash from an input value of the school's choice. It uses the SHA-1 hash algorithm to create the required 40-character offer ID.

```python
"""script to generate offer IDs"""
import hashlib
import datetime


def create_hash(value):
    """returns a one-time, unique 40-character SHA-1 hash using the value provided."""
    val = value + datetime.datetime.now().isoformat()
    return hashlib.sha1(val).hexdigest()
```

This would return a unique offer ID that could be used as the 'oid' value in a student's offer URL.  
If run again with the same value, it will generate a completely new unique ID, because a new timestamp is used in creating each hash.

The school could generate an ID, using any input value desired, keep a record of it as the student's offer ID and use it in the student's disclosure URL as spelled out in the [URL specification](https://cfpb.github.io/college-costs/url-spec/).

The Python hashing script above is [available for download](http://files.consumerfinance.gov.s3.amazonaws.com/pb/paying_for_college/scripts/create_offer_hash.py) and can be run from a shell command line with this command:

```
python create_offer_hash.py [VALUE]
```
Replace '[VALUE]' with a value of your choice, and the script will generate a unique offer ID with each use.  
Example:
```
python create_offer_hash.py student123
```

Entering that command will produce something like this:  
`2df92217303700c6165d56a24b89cef419133a89`
