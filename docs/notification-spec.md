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
  In this case, a new `oid` will need to be generated in order to complete a valid disclosure; `oid` values are allowed to generate only one notification.

Schools may use `oid` values of up to 128 hex characters.

## Email notification option
Endpoint notifications are preferred because they are more reliable and simpler to automate.  
Schools that can't set up endpoints can get notifications via email.

## Notification failures
If a technological problem prevents notifications from being transmitted to the school for more than a day, an email will be sent to the school's contacts with details about the unsent notifications and any attempts to transmit them. The email serves two purposes – to assist in troubleshooting, and to clarify the status of any unsent notifications while the issue is being resolved.
