#!/usr/bin/env python
from __future__ import absolute_import
from django.contrib import admin
from .models import School, Alias, BAHRate, Feedback, Worksheet


class SchoolAdmin(admin.ModelAdmin):
    list_display = ('primary_alias', 'school_id', 'city', 'state')
    search_fields = ['primary_alias']


class AliasAdmin(admin.ModelAdmin):
    list_display = ('alias', 'institution', 'is_primary')
    search_fields = ['alias']

admin.site.register(School, SchoolAdmin)
admin.site.register(Alias, AliasAdmin)
admin.site.register(BAHRate)
admin.site.register(Feedback)
admin.site.register(Worksheet)
# admin.site.register(Program)
