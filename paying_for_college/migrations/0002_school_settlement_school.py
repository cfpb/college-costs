# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('paying_for_college', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='school',
            name='settlement_school',
            field=models.CharField(default=b'', max_length=100, blank=True, choices=[(b'edmc', b'Education Management Corporation'), (b'', b'Non-settlement')]),
        ),
    ]
