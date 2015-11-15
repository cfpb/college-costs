# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('disclosures', '0007_constant'),
    ]

    operations = [
        migrations.AlterField(
            model_name='constant',
            name='value',
            field=models.DecimalField(max_digits=6, decimal_places=5),
        ),
    ]
