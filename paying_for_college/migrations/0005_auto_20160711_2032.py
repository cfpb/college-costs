# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('paying_for_college', '0004_auto_20160626_0342'),
    ]

    operations = [
        migrations.AddField(
            model_name='program',
            name='completers',
            field=models.IntegerField(help_text=b'COMPLETERS OF THE PROGRAM', null=True, blank=True),
        ),
        migrations.AddField(
            model_name='program',
            name='completion_cohorts',
            field=models.IntegerField(help_text=b'COMPLETION COHORTS', null=True, blank=True),
        ),
    ]
