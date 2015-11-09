# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('disclosures', '0004_school_kbyoss'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='offer',
            name='school',
        ),
        migrations.DeleteModel(
            name='Offer',
        ),
    ]
