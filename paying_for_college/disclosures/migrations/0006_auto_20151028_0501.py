# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('disclosures', '0005_auto_20151028_0116'),
    ]

    operations = [
        migrations.RenameField(
            model_name='program',
            old_name='school',
            new_name='institution',
        ),
    ]
