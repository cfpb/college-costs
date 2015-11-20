# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Alias',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('alias', models.TextField()),
                ('is_primary', models.BooleanField(default=False)),
            ],
            options={
                'verbose_name_plural': 'Aliases',
            },
        ),
        migrations.CreateModel(
            name='BAHRate',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('zip5', models.CharField(max_length=5)),
                ('value', models.IntegerField()),
            ],
        ),
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
            options={
                'ordering': ['name'],
            },
        ),
        migrations.CreateModel(
            name='ConstantRate',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=255)),
                ('slug', models.CharField(help_text=b'VARIABLE NAME FOR JS', max_length=255, blank=True)),
                ('value', models.DecimalField(max_digits=6, decimal_places=5)),
                ('note', models.TextField(blank=True)),
                ('updated', models.DateField(auto_now=True)),
            ],
            options={
                'ordering': ['slug'],
            },
        ),
        migrations.CreateModel(
            name='Contact',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('contact', models.CharField(max_length=255)),
                ('name', models.CharField(max_length=255, blank=True)),
            ],
        ),
        migrations.CreateModel(
            name='Disclosure',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=255)),
                ('text', models.TextField(blank=True)),
            ],
        ),
        migrations.CreateModel(
            name='Feedback',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('message', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='Nickname',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('nickname', models.TextField()),
                ('is_female', models.BooleanField(default=False)),
            ],
            options={
                'ordering': ['nickname'],
            },
        ),
        migrations.CreateModel(
            name='Program',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('program_name', models.CharField(max_length=255)),
                ('level', models.CharField(max_length=255, blank=True)),
                ('code', models.CharField(max_length=255, blank=True)),
                ('total_cost', models.IntegerField(null=True, blank=True)),
                ('time_to_complete', models.IntegerField(help_text=b'IN DAYS', null=True, blank=True)),
                ('completion_rate', models.DecimalField(null=True, max_digits=5, decimal_places=2, blank=True)),
                ('default_rate', models.DecimalField(null=True, max_digits=5, decimal_places=2, blank=True)),
                ('job_rate', models.DecimalField(help_text=b'COMPLETERS WHO GET RELATED JOB', null=True, max_digits=5, decimal_places=2, blank=True)),
                ('salary', models.IntegerField(null=True, blank=True)),
                ('program_length', models.IntegerField(help_text=b'IN DAYS', null=True, blank=True)),
                ('program_cost', models.IntegerField(help_text=b'TUITION & FEES', null=True, blank=True)),
                ('housing', models.IntegerField(help_text=b'HOUSING & MEALS', null=True, blank=True)),
                ('books', models.IntegerField(help_text=b'BOOKS & SUPPLIES', null=True, blank=True)),
                ('transportation', models.IntegerField(null=True, blank=True)),
                ('other_costs', models.IntegerField(help_text=b'BOOKS & SUPPLIES', null=True, blank=True)),
            ],
        ),
        migrations.CreateModel(
            name='School',
            fields=[
                ('school_id', models.IntegerField(serialize=False, primary_key=True)),
                ('data_json', models.TextField()),
                ('city', models.CharField(max_length=50)),
                ('state', models.CharField(max_length=2)),
                ('accreditor', models.CharField(max_length=255, blank=True)),
                ('url', models.TextField(blank=True)),
                ('degrees_predominant', models.TextField(blank=True)),
                ('degrees_highest', models.TextField(blank=True)),
                ('operating', models.BooleanField(default=True)),
                ('KBYOSS', models.BooleanField(default=False)),
            ],
        ),
        migrations.CreateModel(
            name='Worksheet',
            fields=[
                ('guid', models.CharField(max_length=64, serialize=False, primary_key=True)),
                ('saved_data', models.TextField()),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('updated', models.DateTimeField(auto_now=True)),
            ],
        ),
        migrations.AddField(
            model_name='program',
            name='institution',
            field=models.ForeignKey(to='paying_for_college.School'),
        ),
        migrations.AddField(
            model_name='nickname',
            name='institution',
            field=models.ForeignKey(to='paying_for_college.School'),
        ),
        migrations.AddField(
            model_name='disclosure',
            name='institution',
            field=models.ForeignKey(blank=True, to='paying_for_college.School', null=True),
        ),
        migrations.AddField(
            model_name='contact',
            name='institution',
            field=models.ForeignKey(to='paying_for_college.School'),
        ),
        migrations.AddField(
            model_name='alias',
            name='institution',
            field=models.ForeignKey(to='paying_for_college.School'),
        ),
    ]
