# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('paying_for_college', '0005_auto_20160711_2032'),
    ]

    operations = [
        migrations.AddField(
            model_name='program',
            name='completion_cohort',
            field=models.IntegerField(help_text=b'COMPLETION COHORT', null=True, blank=True),
        ),
    ]
