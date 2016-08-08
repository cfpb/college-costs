# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('paying_for_college', '0009_auto_20160727_1310'),
    ]

    operations = [
        migrations.AddField(
            model_name='program',
            name='test',
            field=models.BooleanField(default=False),
        ),
    ]
