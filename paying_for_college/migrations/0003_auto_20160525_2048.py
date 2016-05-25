# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('paying_for_college', '0002_school_settlement_school'),
    ]

    operations = [
        migrations.AddField(
            model_name='school',
            name='offers_perkins',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='school',
            name='control',
            field=models.CharField(help_text=b"'Public', 'Private' or 'For-profit'", max_length=50, blank=True),
        ),
    ]
