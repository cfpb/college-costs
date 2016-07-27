# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('paying_for_college', '0007_remove_program_completion_cohorts'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='contact',
            name='contact',
        ),
        migrations.AddField(
            model_name='contact',
            name='contacts',
            field=models.TextField(help_text=b'COMMA-SEPARATED LIST OF EMAILS', blank=True),
        ),
    ]
