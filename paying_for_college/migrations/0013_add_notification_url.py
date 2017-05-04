# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('paying_for_college', '0012_add_feedback_url'),
    ]

    operations = [
        migrations.AddField(
            model_name='notification',
            name='url',
            field=models.TextField(null=True, blank=True),
        ),
    ]
