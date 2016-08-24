## Notifications

School that need to receive notifications of completed disclosures have two ways to be notified.  
The first, and preferred, method is via an API endpoint that the school will maintain.  
The endpoint must be able to receive POST requests with a payload in this form:

```
oid: f38283b5b7c939a058889f997949efa566c616c5  
time: 2016-01-13T16:04:37.777104+00:00  
errors: none
```

## Feilds
**oid** is a 40-character hex string from the offer url to allow the school to match an offer to a student.  
**time** is a UTC timestamp string representing when the disclosure notification was generated.  
**errors** is a string indicating whether the disclosure was valid. It will have one of two values:  

- "none"  
This will confirm that the disclosure was completed and is valid.

- "INVALID: student indicated the offer information is wrong"  
This indicates that the student clicked on the link labeled "No, this is not my information"  
This option is intended to catch cases where the student was given the wrong URL or a faulty URL.  
In this case, a new oid will need to be generated in order to complete a valid disclosure; oid values are allowed to generate only one notification.

## Email notification
Endpoint notifications are preferred because they are more reliable and simpler to automate.  
Schools that can't set up endpoints can get notifications via email.


