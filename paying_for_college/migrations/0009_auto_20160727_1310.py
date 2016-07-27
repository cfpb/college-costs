# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('paying_for_college', '0008_auto_20160727_1242'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='notification',
            name='email',
        ),
        migrations.AddField(
            model_name='notification',
            name='emails',
            field=models.TextField(help_text=b'COMMA-SEPARATED STRING OF EMAILS', blank=True),
        ),
    ]
