# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('disclosures', '0008_auto_20151114_0751'),
    ]

    operations = [
        migrations.CreateModel(
            name='ConstantCap',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=255)),
                ('slug', models.CharField(help_text=b'VARIABLE NAME FOR JS', max_length=255, blank=True)),
                ('value', models.IntegerField()),
                ('note', models.TextField(blank=True)),
                ('updated', models.DateField(auto_now=True)),
            ],
        ),
        migrations.RenameModel(
            old_name='Constant',
            new_name='ConstantRate',
        ),
    ]
