from django.db import models
import uuid


class ConstantRate(models.Model):
    """Rate values that generally only change annually"""
    name = models.CharField(max_length=255)
    slug = models.CharField(max_length=255,
                            blank=True,
                            help_text="VARIABLE NAME FOR JS")
    value = models.DecimalField(max_digits=6, decimal_places=5)
    note = models.TextField(blank=True)
    updated = models.DateField(auto_now=True)

    def __unicode__(self):
        return u"%s (%s), updated %s" % (self.name, self.slug, self.updated)

    class Meta:
        ordering = ['slug']


class ConstantCap(models.Model):
    """Cap values that generally only change annually"""
    name = models.CharField(max_length=255)
    slug = models.CharField(max_length=255,
                            blank=True,
                            help_text="VARIABLE NAME FOR JS")
    value = models.IntegerField()
    note = models.TextField(blank=True)
    updated = models.DateField(auto_now=True)

    def __unicode__(self):
        return u"%s (%s), updated %s" % (self.name, self.slug, self.updated)

    class Meta:
        ordering = ['name']


# data_json fields:
# ALIAS (not needed)
# AVGMONTHLYPAY
# AVGSTULOANDEBT
# AVGSTULOANDEBTRANK
# BADALIAS (not needed)
# BAH 1356 (no longer needed)
# BOOKS
# CITY (now school.city)
# CONTROL (now school.control)
# DEFAULTRATE
# GRADRATE
# GRADRATERANK
# INDICATORGROUP
# KBYOSS (now school.KBYOSS)
# NETPRICE110K
# NETPRICE3OK
# NETPRICE48K
# NETPRICE75K
# NETPRICEGENERAL
# NETPRICEOK
# OFFERAA
# OFFERBA
# OFFERGRAD
# ONCAMPUSAVAIL
# ONLINE (now school.online)
# OTHEROFFCAMPUS
# OTHERONCAMPUS
# OTHERWFAMILY
# RETENTRATE
# ROOMBRDOFFCAMPUS
# ROOMBRDONCAMPUS
# SCHOOL (now school.primary_alias)
# SCHOOL_ID (now school.pk)
# STATE (now school.state)
# TUITIONGRADINDIS
# TUITIONGRADINS
# TUITIONGRADOSS
# TUITIONUNDERINDIS
# TUITIONUNDERINS
# TUITIONUNDEROSS
# ZIP (now school.zip5)


class School(models.Model):
    """
    Represents a school
    """
    school_id = models.IntegerField(primary_key=True)
    ope6_id = models.IntegerField(blank=True, null=True)
    ope8_id = models.IntegerField(blank=True, null=True)
    data_json = models.TextField(blank=True)
    city = models.CharField(max_length=50, blank=True)
    state = models.CharField(max_length=2, blank=True)
    zip5 = models.CharField(max_length=5, blank=True)
    enrollment = models.IntegerField(blank=True, null=True)
    accreditor = models.CharField(max_length=255, blank=True)
    ownership = models.CharField(max_length=255, blank=True)
    control = models.CharField(max_length=50,
                               blank=True,
                               help_text="'Public', 'Private' or 'For Profit'")
    url = models.TextField(blank=True)
    degrees_predominant = models.TextField(blank=True)
    degrees_highest = models.TextField(blank=True)
    main_campus = models.NullBooleanField()
    online_only = models.NullBooleanField()
    operating = models.BooleanField(default=True)

    KBYOSS = models.BooleanField(default=False)  # shopping-sheet participant

    def __unicode__(self):
        return self.primary_alias + u" (%s)" % self.school_id

    def convert_ope6(self):
        if self.ope6_id:
            digits = len(str(self.ope6_id))
            if digits < 6:
                return ('0' * (6-digits)) + str(self.ope6_id)
            else:
                return str(self.ope6_id)
        else:
            return ''

    def convert_ope8(self):
        if self.ope8_id:
            digits = len(str(self.ope8_id))
            if digits < 8:
                return ('0' * (8-digits)) + str(self.ope8_id)
            else:
                return str(self.ope8_id)
        else:
            return ''

    @property
    def primary_alias(self):
        if len(self.alias_set.values()) != 0:
            return self.alias_set.get(is_primary=True).alias
        else:
            return 'Not Available'


class Disclosure(models.Model):
    """Legally required wording for aspects of a school's aid disclosure"""
    name = models.CharField(max_length=255)
    institution = models.ForeignKey(School, blank=True, null=True)
    text = models.TextField(blank=True)

    def __unicode__(self):
        return self.name + u" (%s)" % unicode(self.institution)


class Contact(models.Model):
    """school email account to which we send confirmations"""
    institution = models.ForeignKey(School)
    contact = models.CharField(max_length=255)
    name = models.CharField(max_length=255, blank=True)

    def __unicode__(self):
        return self.contact + u" (%s)" % unicode(self.institution)


class Program(models.Model):
    """
    Cost and outcome info for an individual course of study at a school
    """
    institution = models.ForeignKey(School)
    program_name = models.CharField(max_length=255)
    accreditor = models.CharField(max_length=255, blank=True)
    level = models.CharField(max_length=255, blank=True)
    program_code = models.CharField(max_length=255, blank=True)
    campus = models.CharField(max_length=255, blank=True)
    cip_code = models.CharField(max_length=255, blank=True)
    soc_codes = models.CharField(max_length=255, blank=True)
    total_cost = models.IntegerField(blank=True, null=True,
                                     help_text="COMPUTED")
    time_to_complete = models.IntegerField(blank=True,
                                           null=True,
                                           help_text="IN MONTHS")
    completion_rate = models.DecimalField(blank=True,
                                          null=True,
                                          max_digits=5,
                                          decimal_places=2)
    titleiv_debt = models.IntegerField(blank=True, null=True)
    private_debt = models.IntegerField(blank=True, null=True)
    institutional_debt = models.IntegerField(blank=True, null=True)
    mean_student_loan_completers = models.IntegerField(blank=True,
                                                         null=True,
                                                         help_text="TITLEIV_DEBT + PRIVATE_DEBT + INSTITUTIONAL_DEBT")
    median_student_loan_completers = models.IntegerField(blank=True,
                                                         null=True,
                                                         help_text="TITLEIV_DEBT + PRIVATE_DEBT + INSTITUTIONAL_DEBT")
    default_rate = models.DecimalField(blank=True,
                                       null=True,
                                       max_digits=5,
                                       decimal_places=2)
    salary = models.IntegerField(blank=True, null=True)
    program_length = models.IntegerField(blank=True,
                                         null=True,
                                         help_text="IN MONTHS")
    tuition = models.IntegerField(blank=True,
                                       null=True)
    fees = models.IntegerField(blank=True,
                                       null=True)
    housing = models.IntegerField(blank=True,
                                  null=True,
                                  help_text="HOUSING & MEALS")
    books = models.IntegerField(blank=True,
                                null=True,
                                help_text="BOOKS & SUPPLIES")
    transportation = models.IntegerField(blank=True, null=True)
    other_costs = models.IntegerField(blank=True,
                                      null=True)
    job_rate = models.DecimalField(blank=True,
                                   null=True,
                                   max_digits=5,
                                   decimal_places=2,
                                   help_text="COMPLETERS WHO GET RELATED JOB")
    job_note = models.TextField(blank=True,
                                      help_text="EXPLANATION FROM SCHOOL")

    def __unicode__(self):
        return u"%s (%s)" % (self.program_name, unicode(self.institution))

# class Offer(models.Model):
#     """
#     Financial aid package offered to a prospective student
#     """
#     school = models.ForeignKey(School)
#     program = models.ForeignKey(Program)
#     student_id = models.CharField(max_length=255)
#     uuid = models.CharField(max_length=100, blank=True)
#     # COST OF ATTENDANCE
#     tuition = models.PositiveIntegerField(default=0,
#                                           help_text="TUITION & FEES")  # tui
#     housing = models.PositiveIntegerField(default=0,
#                                           help_text="HOUSING & MEALS")  # hou
#     books = models.PositiveIntegerField(default=0,
#                                         help_text="BOOKS & SUPPLIES")  # bks
#     other = models.PositiveIntegerField(default=0,
#                                         help_text="OTHER EXPENSES")  # oth
#     # MONEY FOR SCHOOL
#     scholarships = models.IntegerField(default=0,
#                                        help_text="SCHOLARSHIPS & GRANTS")
#     pell_grant = models.PositiveIntegerField(default=0)
#     tuition_assist = models.PositiveIntegerField(default=0,
#                                                  help_text='SCHOLARSHIPS')
#     mil_assist = models.PositiveIntegerField(default=0,
#                                              help_text='MILITARY ASSISTANCE')
#     gi_bill = models.PositiveIntegerField(default=0)
#     you_pay = models.PositiveIntegerField(default=0)
#     family_pay = models.PositiveIntegerField(default=0)
#     work_study = models.PositiveIntegerField(default=0)
#     parent_loans = models.PositiveIntegerField(default=0)
#     perkins_loans = models.PositiveIntegerField(default=0)
#     subsidized_loans = models.PositiveIntegerField(default=0)
#     unsubsidized_loans = models.PositiveIntegerField(default=0)
#     plus_loans = models.PositiveIntegerField(default=0)
#     private_loans = models.PositiveIntegerField(default=0)
#     private_loan_interest = models.DecimalField(default=0.0,
#                                                 max_digits=5,
#                                                 decimal_places=2)
#     school_loans = models.PositiveIntegerField(default=0)
#     school_loan_interest = models.DecimalField(default=0.0,
#                                                max_digits=5,
#                                                decimal_places=2)
#     timestamp = models.DateTimeField(blank=True, null=True)
#     in_state = models.NullBooleanField(help_text="ONLY FOR PUBLIC SCHOOLS")

#     def save(self, *args, **kwargs):
#         if not self.uuid:
#             self.uuid = str(uuid.uuid4())
#         super(Offer, self).save(*args, **kwargs)


class Alias(models.Model):
    """
    One of potentially several names for a school
    """
    institution = models.ForeignKey(School)
    alias = models.TextField()
    is_primary = models.BooleanField(default=False)

    def __unicode__(self):
        return u"%s (alias for %s)" % (self.alias, unicode(self.institution))

    class Meta:
        verbose_name_plural = "Aliases"


class Nickname(models.Model):
    """
    One of potentially several nicknames for a school
    """
    institution = models.ForeignKey(School)
    nickname = models.TextField()
    is_female = models.BooleanField(default=False)

    def __unicode__(self):
        return u"%s (nickname for %s)" % (self.nickname,
                                          unicode(self.institution))

    class Meta:
        ordering = ['nickname']


class BAHRate(models.Model):
    """
    Basic Allowance for Housing (BAH) rates are zipcode-specific.
    Used in GI Bill data and may go away.
    """
    zip5 = models.CharField(max_length=5)
    value = models.IntegerField()


class Worksheet(models.Model):
    """
    The saved state of a student's comaprison worksheet.
    This is likely to go away.
    """
    guid = models.CharField(max_length=64, primary_key=True)
    saved_data = models.TextField()
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)


class Feedback(models.Model):
    """
    User-submitted feedback
    """
    created = models.DateTimeField(auto_now_add=True)
    message = models.TextField()


def print_vals(obj, val_list=False, val_dict=False, noprint=False):
    """inspect a Django db object"""
    keylist = sorted([key for key in obj._meta.get_all_field_names()],
                     key=lambda s: s.lower())
    if val_list:
        for key in keylist:
            try:
                obj.__getattribute__(key)
            except:
                del keylist[keylist.index(key)]
        return [obj.__getattribute__(key) for key in keylist]
    elif val_dict:
        return obj.__dict__
    else:
        msg = ""
        try:
            msg += "%s values for %s:\n" % (obj._meta.object_name, obj)
        except:  # pragma: no cover
            pass
        for key in keylist:
            try:
                msg += "%s: %s\n" % (key, obj.__getattribute__(key))
            except:  # pragma: no cover
                pass
        if noprint is False:
            print msg
        else:
            return msg
