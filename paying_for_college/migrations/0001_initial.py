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
                'ordering': ['slug'],
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
                ('contact', models.CharField(help_text=b'EMAIL', max_length=255, blank=True)),
                ('endpoint', models.CharField(max_length=255, blank=True)),
                ('name', models.CharField(max_length=255, blank=True)),
                ('internal_note', models.TextField(blank=True)),
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
            name='Notification',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('oid', models.CharField(max_length=40)),
                ('timestamp', models.DateTimeField()),
                ('errors', models.CharField(max_length=255)),
                ('email', models.CharField(max_length=255, blank=True)),
            ],
        ),
        migrations.CreateModel(
            name='Program',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('program_name', models.CharField(max_length=255)),
                ('accreditor', models.CharField(max_length=255, blank=True)),
                ('level', models.CharField(max_length=255, blank=True)),
                ('program_code', models.CharField(max_length=255, blank=True)),
                ('campus', models.CharField(max_length=255, blank=True)),
                ('cip_code', models.CharField(max_length=255, blank=True)),
                ('soc_codes', models.CharField(max_length=255, blank=True)),
                ('total_cost', models.IntegerField(help_text=b'COMPUTED', null=True, blank=True)),
                ('time_to_complete', models.IntegerField(help_text=b'IN MONTHS', null=True, blank=True)),
                ('completion_rate', models.DecimalField(null=True, max_digits=5, decimal_places=2, blank=True)),
                ('titleiv_debt', models.IntegerField(null=True, blank=True)),
                ('private_debt', models.IntegerField(null=True, blank=True)),
                ('institutional_debt', models.IntegerField(null=True, blank=True)),
                ('mean_student_loan_completers', models.IntegerField(help_text=b'TITLEIV_DEBT + PRIVATE_DEBT + INSTITUTIONAL_DEBT', null=True, blank=True)),
                ('median_student_loan_completers', models.IntegerField(help_text=b'TITLEIV_DEBT + PRIVATE_DEBT + INSTITUTIONAL_DEBT', null=True, blank=True)),
                ('default_rate', models.DecimalField(null=True, max_digits=5, decimal_places=2, blank=True)),
                ('salary', models.IntegerField(help_text=b'MEDIAN SALARY', null=True, blank=True)),
                ('program_length', models.IntegerField(help_text=b'IN MONTHS', null=True, blank=True)),
                ('tuition', models.IntegerField(null=True, blank=True)),
                ('fees', models.IntegerField(null=True, blank=True)),
                ('housing', models.IntegerField(help_text=b'HOUSING & MEALS', null=True, blank=True)),
                ('books', models.IntegerField(help_text=b'BOOKS & SUPPLIES', null=True, blank=True)),
                ('transportation', models.IntegerField(null=True, blank=True)),
                ('other_costs', models.IntegerField(null=True, blank=True)),
                ('job_rate', models.DecimalField(help_text=b'COMPLETERS WHO GET RELATED JOB', null=True, max_digits=5, decimal_places=2, blank=True)),
                ('job_note', models.TextField(help_text=b'EXPLANATION FROM SCHOOL', blank=True)),
            ],
        ),
        migrations.CreateModel(
            name='School',
            fields=[
                ('school_id', models.IntegerField(serialize=False, primary_key=True)),
                ('ope6_id', models.IntegerField(null=True, blank=True)),
                ('ope8_id', models.IntegerField(null=True, blank=True)),
                ('data_json', models.TextField(blank=True)),
                ('city', models.CharField(max_length=50, blank=True)),
                ('state', models.CharField(max_length=2, blank=True)),
                ('zip5', models.CharField(max_length=5, blank=True)),
                ('enrollment', models.IntegerField(null=True, blank=True)),
                ('accreditor', models.CharField(max_length=255, blank=True)),
                ('ownership', models.CharField(max_length=255, blank=True)),
                ('control', models.CharField(help_text=b"'Public', 'Private' or 'For Profit'", max_length=50, blank=True)),
                ('url', models.TextField(blank=True)),
                ('degrees_predominant', models.TextField(blank=True)),
                ('degrees_highest', models.TextField(blank=True)),
                ('main_campus', models.NullBooleanField()),
                ('online_only', models.NullBooleanField()),
                ('operating', models.BooleanField(default=True)),
                ('under_investigation', models.BooleanField(default=False, help_text=b'Heightened Cash Monitoring 2')),
                ('KBYOSS', models.BooleanField(default=False)),
                ('grad_rate_4yr', models.DecimalField(null=True, max_digits=5, decimal_places=3, blank=True)),
                ('grad_rate_lt4', models.DecimalField(null=True, max_digits=5, decimal_places=3, blank=True)),
                ('grad_rate', models.DecimalField(help_text=b'A 2-YEAR POOLED VALUE', null=True, max_digits=5, decimal_places=3, blank=True)),
                ('repay_3yr', models.DecimalField(help_text=b'GRADS WITH A DECLINING BALANCE AFTER 3 YRS', null=True, max_digits=13, decimal_places=10, blank=True)),
                ('default_rate', models.DecimalField(help_text=b'LOAN DEFAULT RATE AT 3 YRS', null=True, max_digits=5, decimal_places=3, blank=True)),
                ('median_total_debt', models.DecimalField(help_text=b'MEDIAN STUDENT DEBT', null=True, max_digits=7, decimal_places=1, blank=True)),
                ('median_monthly_debt', models.DecimalField(help_text=b'MEDIAN STUDENT MONTHLY DEBT', null=True, max_digits=14, decimal_places=9, blank=True)),
                ('median_annual_pay', models.IntegerField(help_text=b'MEDIAN PAY 10 YRS AFTER ENTRY', null=True, blank=True)),
                ('avg_net_price', models.IntegerField(help_text=b'OVERALL AVERAGE', null=True, blank=True)),
                ('tuition_out_of_state', models.IntegerField(null=True, blank=True)),
                ('tuition_in_state', models.IntegerField(null=True, blank=True)),
                ('offers_perkins', models.BooleanField(default=False)),
                ('contact', models.ForeignKey(blank=True, to='paying_for_college.Contact', null=True)),
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
            model_name='notification',
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
            model_name='alias',
            name='institution',
            field=models.ForeignKey(to='paying_for_college.School'),
        ),
    ]
