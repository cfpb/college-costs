import datetime
from django.utils import timezone
import json
from string import Template

from django.core.mail import send_mail

from paying_for_college.models import Notification

INTRO = ('Notification failures \n'
         'Notification delivery failed for the following offer IDs:\n\n')
NOTE_TEMPLATE = Template(('Offer ID $oid:\n'
                          '    timestamp: $time\n'
                          '    app errors: $errors\n'
                          '    send log: $log\n\n'))


def retry_notifications():
    """attempt to resend recent notifications that failed"""
    pass

    day_old = timezone.now() - datetime.timedelta(days=1)
    failed_notifications = Notification.objects.filter(sent=False,
                                                       timestamp__gt=day_old)
    for each in failed_notifications:
        each.notify_school()


def send_stale_notifications(add_email=[]):
    """Gather up notifications that have failed and are more than a day old."""

    stale_date = timezone.now() - datetime.timedelta(days=1)
    stale_notifications = Notification.objects.filter(sent=False,
                                                      timestamp__lt=stale_date)
    contacts = {notification.institution.contact: [] for notification
                in stale_notifications if notification.institution.contact}
    for noti in stale_notifications:
        payload = {
            'oid':    noti.oid,
            'time':   noti.timestamp.isoformat(),
            'errors': noti.errors,
            'log':    noti.log
        }
        clist = contacts[noti.institution.contact]
        clist.append(payload)
    for contact in contacts:
        msg = INTRO
        for msgdict in contacts[contact]:
            msg += NOTE_TEMPLATE.substitute(msgdict)
        recipients = [contact.contact] + add_email
        send_mail("CFPB notification failures",
                  msg,
                  "no-reply@cfpb.gov",
                  recipients,
                  fail_silently=False)
