# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('paying_for_college', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='disclosure',
            name='text',
            field=models.TextField(blank=True),
        ),
    ]
