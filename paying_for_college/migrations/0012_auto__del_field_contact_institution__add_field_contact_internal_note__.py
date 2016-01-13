# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Deleting field 'Contact.institution'
        db.delete_column(u'paying_for_college_contact', 'institution_id')

        # Adding field 'Contact.internal_note'
        db.add_column(u'paying_for_college_contact', 'internal_note',
                      self.gf('django.db.models.fields.TextField')(default='', blank=True),
                      keep_default=False)

        # Adding field 'School.contact'
        db.add_column(u'paying_for_college_school', 'contact',
                      self.gf('django.db.models.fields.related.ForeignKey')(to=orm['paying_for_college.Contact'], null=True, blank=True),
                      keep_default=False)


    def backwards(self, orm):
        # Adding field 'Contact.institution'
        db.add_column(u'paying_for_college_contact', 'institution',
                      self.gf('django.db.models.fields.related.ForeignKey')(default=5, to=orm['paying_for_college.School']),
                      keep_default=False)

        # Deleting field 'Contact.internal_note'
        db.delete_column(u'paying_for_college_contact', 'internal_note')

        # Deleting field 'School.contact'
        db.delete_column(u'paying_for_college_school', 'contact_id')


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
            'Meta': {'ordering': "['slug']", 'object_name': 'ConstantCap'},
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
            'internal_note': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '255', 'blank': 'True'})
        },
        u'paying_for_college.disclosure': {
            'Meta': {'object_name': 'Disclosure'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'institution': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['paying_for_college.School']", 'null': 'True', 'blank': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            'text': ('django.db.models.fields.TextField', [], {'blank': 'True'})
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
            'accreditor': ('django.db.models.fields.CharField', [], {'max_length': '255', 'blank': 'True'}),
            'books': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'campus': ('django.db.models.fields.CharField', [], {'max_length': '255', 'blank': 'True'}),
            'cip_code': ('django.db.models.fields.CharField', [], {'max_length': '255', 'blank': 'True'}),
            'completion_rate': ('django.db.models.fields.DecimalField', [], {'null': 'True', 'max_digits': '5', 'decimal_places': '2', 'blank': 'True'}),
            'default_rate': ('django.db.models.fields.DecimalField', [], {'null': 'True', 'max_digits': '5', 'decimal_places': '2', 'blank': 'True'}),
            'fees': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'housing': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'institution': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['paying_for_college.School']"}),
            'institutional_debt': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'job_note': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            'job_rate': ('django.db.models.fields.DecimalField', [], {'null': 'True', 'max_digits': '5', 'decimal_places': '2', 'blank': 'True'}),
            'level': ('django.db.models.fields.CharField', [], {'max_length': '255', 'blank': 'True'}),
            'mean_student_loan_completers': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'median_student_loan_completers': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'other_costs': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'private_debt': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'program_code': ('django.db.models.fields.CharField', [], {'max_length': '255', 'blank': 'True'}),
            'program_length': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'program_name': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            'salary': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'soc_codes': ('django.db.models.fields.CharField', [], {'max_length': '255', 'blank': 'True'}),
            'time_to_complete': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'titleiv_debt': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'total_cost': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'transportation': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'tuition': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'})
        },
        u'paying_for_college.school': {
            'KBYOSS': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'Meta': {'object_name': 'School'},
            'accreditor': ('django.db.models.fields.CharField', [], {'max_length': '255', 'blank': 'True'}),
            'city': ('django.db.models.fields.CharField', [], {'max_length': '50', 'blank': 'True'}),
            'contact': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['paying_for_college.Contact']", 'null': 'True', 'blank': 'True'}),
            'control': ('django.db.models.fields.CharField', [], {'max_length': '50', 'blank': 'True'}),
            'data_json': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            'default_rate': ('django.db.models.fields.DecimalField', [], {'null': 'True', 'max_digits': '4', 'decimal_places': '3', 'blank': 'True'}),
            'degrees_highest': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            'degrees_predominant': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            'enrollment': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'grad_rate': ('django.db.models.fields.DecimalField', [], {'null': 'True', 'max_digits': '4', 'decimal_places': '2', 'blank': 'True'}),
            'grad_rate_4yr': ('django.db.models.fields.DecimalField', [], {'null': 'True', 'max_digits': '4', 'decimal_places': '2', 'blank': 'True'}),
            'grad_rate_lt4': ('django.db.models.fields.DecimalField', [], {'null': 'True', 'max_digits': '4', 'decimal_places': '2', 'blank': 'True'}),
            'main_campus': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'median_annual_pay': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'median_monthly_debt': ('django.db.models.fields.DecimalField', [], {'null': 'True', 'max_digits': '14', 'decimal_places': '9', 'blank': 'True'}),
            'median_total_debt': ('django.db.models.fields.DecimalField', [], {'null': 'True', 'max_digits': '7', 'decimal_places': '1', 'blank': 'True'}),
            'online_only': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'ope6_id': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'ope8_id': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'operating': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'ownership': ('django.db.models.fields.CharField', [], {'max_length': '255', 'blank': 'True'}),
            'repay_3yr': ('django.db.models.fields.DecimalField', [], {'null': 'True', 'max_digits': '13', 'decimal_places': '10', 'blank': 'True'}),
            'school_id': ('django.db.models.fields.IntegerField', [], {'primary_key': 'True'}),
            'state': ('django.db.models.fields.CharField', [], {'max_length': '2', 'blank': 'True'}),
            'url': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            'zip5': ('django.db.models.fields.CharField', [], {'max_length': '5', 'blank': 'True'})
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