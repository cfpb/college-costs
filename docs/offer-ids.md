## Offer IDs

Offer IDs allow a school to provide details of a student's enrollment offer without revealing who the student is. It also allows EDMC to send confirmations to the school that a disclosure was reviewed the student, but without knowing who the student is and without transmitting any personal information.

Only the school will know which student the offer ID applies to.

We chose a 40-hex-character hash as the offer ID because it is safe to accept and transmit, and unique hashes are easy to create in a way that cannot be linked to a student.

The school can decide what values to use to generate the offer ID hashes. 
An easy method would be to combine a timestamp and another value -- such as a student ID or even a completely random number or numbers -- and generate a hash from those values.

Following is a Python script that would generate such a hash from an input value of the school's choice. It uses the SHA-1 hash algorithm, which generates a 40-character hash string. This is the same algorithm used to generate GitHub commit ID.

```python
"""script to generate offer IDs"""
import sys
import hashlib
import datetime


def create_hash(value):
    """returns a unique 40-character SHA-1 hash using the value provided."""
    val = value + datetime.datetime.now().isoformat()
    return hashlib.sha1(val).hexdigest()
```

This would return a unique offer ID that could be used as the 'oid' value in the offer URL.  
If run again with the same value, it will generate a completely new unique value, because a timestamp used.

The school could generate the ID, keep a record of it as the student's offer ID and use it in the schools disclosure URL as spelled out in the [URL specification](https://cfpb.github.io/college-costs/url-spec/).

The Python hashing script is [available for download](http://files.consumerfinance.gov.s3.amazonaws.com/pb/paying_for_college/scripts/create_offer_hash.py) and can be run with this command:

```
python create_offer_hash.py [VALUE]
```
