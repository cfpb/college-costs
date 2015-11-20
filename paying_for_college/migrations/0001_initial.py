# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'ConstantRate'
        db.create_table(u'paying_for_college_constantrate', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=255)),
            ('slug', self.gf('django.db.models.fields.CharField')(max_length=255, blank=True)),
            ('value', self.gf('django.db.models.fields.DecimalField')(max_digits=6, decimal_places=5)),
            ('note', self.gf('django.db.models.fields.TextField')(blank=True)),
            ('updated', self.gf('django.db.models.fields.DateField')(auto_now=True, blank=True)),
        ))
        db.send_create_signal(u'paying_for_college', ['ConstantRate'])

        # Adding model 'ConstantCap'
        db.create_table(u'paying_for_college_constantcap', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=255)),
            ('slug', self.gf('django.db.models.fields.CharField')(max_length=255, blank=True)),
            ('value', self.gf('django.db.models.fields.IntegerField')()),
            ('note', self.gf('django.db.models.fields.TextField')(blank=True)),
            ('updated', self.gf('django.db.models.fields.DateField')(auto_now=True, blank=True)),
        ))
        db.send_create_signal(u'paying_for_college', ['ConstantCap'])

        # Adding model 'School'
        db.create_table(u'paying_for_college_school', (
            ('school_id', self.gf('django.db.models.fields.IntegerField')(primary_key=True)),
            ('data_json', self.gf('django.db.models.fields.TextField')()),
            ('city', self.gf('django.db.models.fields.CharField')(max_length=50)),
            ('state', self.gf('django.db.models.fields.CharField')(max_length=2)),
            ('accreditor', self.gf('django.db.models.fields.CharField')(max_length=255, blank=True)),
            ('url', self.gf('django.db.models.fields.TextField')(blank=True)),
            ('degrees_predominant', self.gf('django.db.models.fields.TextField')(blank=True)),
            ('degrees_highest', self.gf('django.db.models.fields.TextField')(blank=True)),
            ('operating', self.gf('django.db.models.fields.BooleanField')(default=True)),
            ('KBYOSS', self.gf('django.db.models.fields.BooleanField')(default=False)),
        ))
        db.send_create_signal(u'paying_for_college', ['School'])

        # Adding model 'Contact'
        db.create_table(u'paying_for_college_contact', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('institution', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['paying_for_college.School'])),
            ('contact', self.gf('django.db.models.fields.CharField')(max_length=255)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=255, blank=True)),
        ))
        db.send_create_signal(u'paying_for_college', ['Contact'])

        # Adding model 'Program'
        db.create_table(u'paying_for_college_program', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('institution', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['paying_for_college.School'])),
            ('program_name', self.gf('django.db.models.fields.CharField')(max_length=255)),
            ('level', self.gf('django.db.models.fields.CharField')(max_length=255, blank=True)),
            ('code', self.gf('django.db.models.fields.CharField')(max_length=255, blank=True)),
            ('total_cost', self.gf('django.db.models.fields.IntegerField')(null=True, blank=True)),
            ('time_to_complete', self.gf('django.db.models.fields.IntegerField')(null=True, blank=True)),
            ('completion_rate', self.gf('django.db.models.fields.DecimalField')(null=True, max_digits=5, decimal_places=2, blank=True)),
            ('default_rate', self.gf('django.db.models.fields.DecimalField')(null=True, max_digits=5, decimal_places=2, blank=True)),
            ('job_rate', self.gf('django.db.models.fields.DecimalField')(null=True, max_digits=5, decimal_places=2, blank=True)),
            ('salary', self.gf('django.db.models.fields.IntegerField')(null=True, blank=True)),
            ('program_length', self.gf('django.db.models.fields.IntegerField')(null=True, blank=True)),
            ('program_cost', self.gf('django.db.models.fields.IntegerField')(null=True, blank=True)),
            ('housing', self.gf('django.db.models.fields.IntegerField')(null=True, blank=True)),
            ('books', self.gf('django.db.models.fields.IntegerField')(null=True, blank=True)),
            ('transportation', self.gf('django.db.models.fields.IntegerField')(null=True, blank=True)),
            ('other_costs', self.gf('django.db.models.fields.IntegerField')(null=True, blank=True)),
        ))
        db.send_create_signal(u'paying_for_college', ['Program'])

        # Adding model 'Alias'
        db.create_table(u'paying_for_college_alias', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('institution', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['paying_for_college.School'])),
            ('alias', self.gf('django.db.models.fields.TextField')()),
            ('is_primary', self.gf('django.db.models.fields.BooleanField')(default=False)),
        ))
        db.send_create_signal(u'paying_for_college', ['Alias'])

        # Adding model 'Nickname'
        db.create_table(u'paying_for_college_nickname', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('institution', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['paying_for_college.School'])),
            ('nickname', self.gf('django.db.models.fields.TextField')()),
            ('is_female', self.gf('django.db.models.fields.BooleanField')(default=False)),
        ))
        db.send_create_signal(u'paying_for_college', ['Nickname'])

        # Adding model 'BAHRate'
        db.create_table(u'paying_for_college_bahrate', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('zip5', self.gf('django.db.models.fields.CharField')(max_length=5)),
            ('value', self.gf('django.db.models.fields.IntegerField')()),
        ))
        db.send_create_signal(u'paying_for_college', ['BAHRate'])

        # Adding model 'Worksheet'
        db.create_table(u'paying_for_college_worksheet', (
            ('guid', self.gf('django.db.models.fields.CharField')(max_length=64, primary_key=True)),
            ('saved_data', self.gf('django.db.models.fields.TextField')()),
            ('created', self.gf('django.db.models.fields.DateTimeField')(auto_now_add=True, blank=True)),
            ('updated', self.gf('django.db.models.fields.DateTimeField')(auto_now=True, blank=True)),
        ))
        db.send_create_signal(u'paying_for_college', ['Worksheet'])

        # Adding model 'Feedback'
        db.create_table(u'paying_for_college_feedback', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('created', self.gf('django.db.models.fields.DateTimeField')(auto_now_add=True, blank=True)),
            ('message', self.gf('django.db.models.fields.TextField')()),
        ))
        db.send_create_signal(u'paying_for_college', ['Feedback'])


    def backwards(self, orm):
        # Deleting model 'ConstantRate'
        db.delete_table(u'paying_for_college_constantrate')

        # Deleting model 'ConstantCap'
        db.delete_table(u'paying_for_college_constantcap')

        # Deleting model 'School'
        db.delete_table(u'paying_for_college_school')

        # Deleting model 'Contact'
        db.delete_table(u'paying_for_college_contact')

        # Deleting model 'Program'
        db.delete_table(u'paying_for_college_program')

        # Deleting model 'Alias'
        db.delete_table(u'paying_for_college_alias')

        # Deleting model 'Nickname'
        db.delete_table(u'paying_for_college_nickname')

        # Deleting model 'BAHRate'
        db.delete_table(u'paying_for_college_bahrate')

        # Deleting model 'Worksheet'
        db.delete_table(u'paying_for_college_worksheet')

        # Deleting model 'Feedback'
        db.delete_table(u'paying_for_college_feedback')


    models = {
        u'paying_for_college.alias': {
            'Meta': {'object_name': 'Alias'},
            'alias': ('django.db.models.fields.TextField', [], {}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'institution': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['paying_for_college.School']"}),
            'is_primary': ('django.db.models.fields.BooleanField', [], {'default': 'False'})
        },
        u'paying_for_college.bahrate': {
            'Meta': {'object_name': 'BAHRate'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'value': ('django.db.models.fields.IntegerField', [], {}),
            'zip5': ('django.db.models.fields.CharField', [], {'max_length': '5'})
        },
        u'paying_for_college.constantcap': {
            'Meta': {'ordering': "['name']", 'object_name': 'ConstantCap'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            'note': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            'slug': ('django.db.models.fields.CharField', [], {'max_length': '255', 'blank': 'True'}),
            'updated': ('django.db.models.fields.DateField', [], {'auto_now': 'True', 'blank': 'True'}),
            'value': ('django.db.models.fields.IntegerField', [], {})
        },
        u'paying_for_college.constantrate': {
            'Meta': {'ordering': "['slug']", 'object_name': 'ConstantRate'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            'note': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            'slug': ('django.db.models.fields.CharField', [], {'max_length': '255', 'blank': 'True'}),
            'updated': ('django.db.models.fields.DateField', [], {'auto_now': 'True', 'blank': 'True'}),
            'value': ('django.db.models.fields.DecimalField', [], {'max_digits': '6', 'decimal_places': '5'})
        },
        u'paying_for_college.contact': {
            'Meta': {'object_name': 'Contact'},
            'contact': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'institution': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['paying_for_college.School']"}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '255', 'blank': 'True'})
        },
        u'paying_for_college.feedback': {
            'Meta': {'object_name': 'Feedback'},
            'created': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'message': ('django.db.models.fields.TextField', [], {})
        },
        u'paying_for_college.nickname': {
            'Meta': {'ordering': "['nickname']", 'object_name': 'Nickname'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'institution': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['paying_for_college.School']"}),
            'is_female': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'nickname': ('django.db.models.fields.TextField', [], {})
        },
        u'paying_for_college.program': {
            'Meta': {'object_name': 'Program'},
            'books': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'code': ('django.db.models.fields.CharField', [], {'max_length': '255', 'blank': 'True'}),
            'completion_rate': ('django.db.models.fields.DecimalField', [], {'null': 'True', 'max_digits': '5', 'decimal_places': '2', 'blank': 'True'}),
            'default_rate': ('django.db.models.fields.DecimalField', [], {'null': 'True', 'max_digits': '5', 'decimal_places': '2', 'blank': 'True'}),
            'housing': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'institution': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['paying_for_college.School']"}),
            'job_rate': ('django.db.models.fields.DecimalField', [], {'null': 'True', 'max_digits': '5', 'decimal_places': '2', 'blank': 'True'}),
            'level': ('django.db.models.fields.CharField', [], {'max_length': '255', 'blank': 'True'}),
            'other_costs': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'program_cost': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'program_length': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'program_name': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            'salary': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'time_to_complete': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'total_cost': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'transportation': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'})
        },
        u'paying_for_college.school': {
            'KBYOSS': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'Meta': {'object_name': 'School'},
            'accreditor': ('django.db.models.fields.CharField', [], {'max_length': '255', 'blank': 'True'}),
            'city': ('django.db.models.fields.CharField', [], {'max_length': '50'}),
            'data_json': ('django.db.models.fields.TextField', [], {}),
            'degrees_highest': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            'degrees_predominant': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            'operating': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'school_id': ('django.db.models.fields.IntegerField', [], {'primary_key': 'True'}),
            'state': ('django.db.models.fields.CharField', [], {'max_length': '2'}),
            'url': ('django.db.models.fields.TextField', [], {'blank': 'True'})
        },
        u'paying_for_college.worksheet': {
            'Meta': {'object_name': 'Worksheet'},
            'created': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'guid': ('django.db.models.fields.CharField', [], {'max_length': '64', 'primary_key': 'True'}),
            'saved_data': ('django.db.models.fields.TextField', [], {}),
            'updated': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'blank': 'True'})
        }
    }

    complete_apps = ['paying_for_college']