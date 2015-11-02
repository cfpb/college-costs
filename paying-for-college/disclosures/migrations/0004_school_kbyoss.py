# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('disclosures', '0003_auto_20151020_0049'),
    ]

    operations = [
        migrations.AddField(
            model_name='school',
            name='KBYOSS',
            field=models.BooleanField(default=False),
        ),
    ]
