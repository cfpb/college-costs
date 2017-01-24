# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('paying_for_college', '0011_remove_choices_from_settlement_school_field'),
    ]

    operations = [
        migrations.AddField(
            model_name='feedback',
            name='url',
            field=models.TextField(null=True, blank=True),
        ),
    ]
