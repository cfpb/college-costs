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
        ),
        migrations.CreateModel(
            name='Offer',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('student_id', models.CharField(max_length=255)),
                ('uuid', models.CharField(max_length=100, blank=True)),
                ('scholarships', models.IntegerField(default=0, help_text=b'SCHOLARSHIPS & GRANTS')),
                ('pell_grant', models.PositiveIntegerField(default=0)),
                ('tuition_assistance', models.PositiveIntegerField(default=0)),
                ('gi_bill', models.PositiveIntegerField(default=0)),
                ('work_study', models.PositiveIntegerField(default=0)),
                ('parent_loans', models.PositiveIntegerField(default=0)),
                ('perkins_loans', models.PositiveIntegerField(default=0)),
                ('subsidized_loans', models.PositiveIntegerField(default=0)),
                ('unsubsidized_loans', models.PositiveIntegerField(default=0)),
                ('private_loans', models.PositiveIntegerField(default=0)),
                ('private_loan_interest', models.DecimalField(default=0.0, max_digits=5, decimal_places=2)),
                ('school_loans', models.PositiveIntegerField(default=0)),
                ('school_loan_interest', models.DecimalField(default=0.0, max_digits=5, decimal_places=2)),
                ('plus_loans', models.PositiveIntegerField(default=0)),
                ('timestamp', models.DateTimeField(null=True, blank=True)),
                ('in_state', models.NullBooleanField(help_text=b'ONLY FOR PUBLIC SCHOOLS')),
            ],
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
            name='school',
            field=models.ForeignKey(to='disclosures.School'),
        ),
        migrations.AddField(
            model_name='offer',
            name='school',
            field=models.ForeignKey(to='disclosures.School'),
        ),
        migrations.AddField(
            model_name='nickname',
            name='institution',
            field=models.ForeignKey(to='disclosures.School'),
        ),
        migrations.AddField(
            model_name='alias',
            name='institution',
            field=models.ForeignKey(to='disclosures.School'),
        ),
    ]
