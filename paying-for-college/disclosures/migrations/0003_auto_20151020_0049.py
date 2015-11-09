# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('disclosures', '0002_contact'),
    ]

    operations = [
        migrations.AddField(
            model_name='school',
            name='accreditor',
            field=models.CharField(max_length=255, blank=True),
        ),
        migrations.AddField(
            model_name='school',
            name='degrees_highest',
            field=models.TextField(blank=True),
        ),
        migrations.AddField(
            model_name='school',
            name='degrees_predominant',
            field=models.TextField(blank=True),
        ),
        migrations.AddField(
            model_name='school',
            name='operating',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='school',
            name='url',
            field=models.TextField(blank=True),
        ),
    ]
