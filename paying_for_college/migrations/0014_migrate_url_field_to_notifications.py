# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations
from django.core.exceptions import ObjectDoesNotExist, MultipleObjectsReturned


def parse_url(feedback):
    """
    Replicates the Feedback model method 'parsed_url' because model methods
    are not available in migrations (grumble).
    """
    data = {}
    if 'feedback' in feedback.url or '?' not in feedback.url:
        return data
    split_fields = feedback.url.split('?')[1].split('&')
    for field in split_fields:
        pair = field.split('=')
        data[pair[0]] = pair[1]
    return data


def forward(apps, schema_editor):
    Notification = apps.get_model('paying_for_college', 'Notification')
    Feedback = apps.get_model('paying_for_college', 'Feedback')
    db_alias = schema_editor.connection.alias

    for feedback in Feedback.objects.using(db_alias).exclude(url=None):
        try:
            notification = Notification.objects.using(
                db_alias).get(oid=parse_url(feedback).get('oid'))
            notification.url = feedback.url
            notification.save()
        except IndexError:
            continue
        except ObjectDoesNotExist:
            continue
        except MultipleObjectsReturned:
            continue


def backward(apps, schema_editor):
    Notification = apps.get_model('paying_for_college', 'Notification')
    db_alias = schema_editor.connection.alias

    for notification in Notification.objects.using(db_alias).all():
        notification.url = None
        notification.save()


class Migration(migrations.Migration):

    dependencies = [
        ('paying_for_college', '0013_add_notification_url'),
    ]

    operations = [
        migrations.RunPython(forward, backward),
    ]
