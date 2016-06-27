# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('paying_for_college', '0003_auto_20160525_2048'),
    ]

    operations = [
        migrations.AddField(
            model_name='notification',
            name='log',
            field=models.TextField(blank=True),
        ),
        migrations.AddField(
            model_name='notification',
            name='sent',
            field=models.BooleanField(default=False),
        ),
    ]
