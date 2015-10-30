#!/usr/bin/env python
from __future__ import absolute_import
from django.contrib import admin
from .models import School, Program, Alias, Nickname, Contact
from .models import BAHRate, Feedback, Worksheet


class SchoolAdmin(admin.ModelAdmin):
    list_display = ('primary_alias', 'school_id', 'city', 'state', 'KBYOSS')
    search_fields = ['school_id', 'city']


class AliasAdmin(admin.ModelAdmin):
    list_display = ('alias', 'institution', 'is_primary')
    search_fields = ['alias']


class NicknameAdmin(admin.ModelAdmin):
    list_display = ('nickname', 'institution', 'is_female')
    search_fields = ['nickname']

admin.site.register(School, SchoolAdmin)
admin.site.register(Alias, AliasAdmin)
admin.site.register(BAHRate)
admin.site.register(Feedback)
admin.site.register(Worksheet)
admin.site.register(Contact)
admin.site.register(Nickname, NicknameAdmin)
admin.site.register(Program)
