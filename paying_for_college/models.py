import datetime
from django.db import models
try:
    from collections import OrderedDict
except:  # pragma: no cover
    from ordereddict import OrderedDict
import uuid
import json
from string import Template
import smtplib

import requests
from django.core.mail import send_mail

REGION_MAP = {'MW': ['IL', 'IN', 'IA', 'KS', 'MI', 'MN',
                     'MO', 'NE', 'ND', 'OH', 'SD', 'WI'],
              'NE': ['CT', 'ME', 'MA', 'NH', 'NJ',
                     'NY', 'PA', 'RI', 'VT'],
              'SO': ['AL', 'AR', 'DE', 'DC', 'FL', 'GA', 'KY', 'LA', 'MD',
                     'MS', 'NC', 'OK', 'SC', 'TN', 'TX', 'VA', 'WV'],
              'WE': ['AK', 'AZ', 'CA', 'CO', 'HI', 'ID', 'MT', 'NV', 'NM',
                     'OR', 'UT', 'WA', 'WY']
              }

CONTROL_MAP = {'1': 'Public',
               '2': 'Private',
               '3': 'For-profit'}

REGION_NAMES = {'MW': 'Midwest',
                'NE': "Northeast",
                'SO': 'South',
                'WE': 'West'}

HIGHEST_DEGREES = {  # highest-awarded values from Ed API and our CSV spec
    '0': "Non-degree-granting",
    '1': 'Certificate',
    '2': "Associate degree",
    '3': "Bachelor's degree",
    '4': "Graduate degree"
    }

LEVELS = {  # Dept. of Ed classification of post-secondary degree levels
    '1': "Program of less than 1 academic year",
    '2': "Program of at least 1 but less than 2 academic years",
    '3': "Associate's degree",
    '4': "Program of at least 2 but less than 4 academic years",
    '5': "Bachelor's degree",
    '6': "Post-baccalaureate certificate",
    '7': "Master's degree",
    '8': "Post-master's certificate",
    '17': "Doctor's degree-research/scholarship",
    '18': "Doctor's degree-professional practice",
    '19': "Doctor's degree-other"
}

NOTIFICATION_TEMPLATE = Template("""Disclosure notification for offer ID $oid\n\
    timestamp: $time\n\
    errors: $errors\n\
If errors are "none," the disclosure is confirmed.\
""")


def get_region(school):
    """return a school's region based on state"""
    for region in REGION_MAP:
        if school.state in REGION_MAP[region]:
            return region
    return ''


def make_even(value):
    """Makes sure a value, such as program_length, is even"""
    if not value or value % 2 == 0:
        return value
    else:
        return value + 1


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
        ordering = ['slug']


# original data_json fields:
# ALIAS -- not needed, DELETE
# AVGMONTHLYPAY
# AVGSTULOANDEBT
# AVGSTULOANDEBTRANK -- not needed, DELETE
# BADALIAS -- not needed, DELETE
# BAH 1356 -- not needed, DELETE
# BOOKS
# CITY (now school.city)
# CONTROL (now school.control)
# DEFAULTRATE
# GRADRATE -- now school.grad_rate
# GRADRATERANK -- not needed, DELETE
# INDICATORGROUP
# KBYOSS (now school.KBYOSS) -- not needed, DELETE
# MEDIANDEBTCOMPLETER # new in 2015
# NETPRICE110K -- not needed, DELETE
# NETPRICE3OK -- not needed, DELETE
# NETPRICE48K -- not needed, DELETE
# NETPRICE75K -- not needed, DELETE
# NETPRICEGENERAL -- not needed, DELETE
# NETPRICEOK -- not needed, DELETE
# OFFERAA
# OFFERBA
# OFFERGRAD
# ONCAMPUSAVAIL
# ONLINE (now school.online)
# OTHEROFFCAMPUS
# OTHERONCAMPUS
# OTHERWFAMILY
# RETENTRATE -- not needed, DELETE
# RETENTRATELT4 # new in 2015 -- not needed, DELETE
# REPAY3YR # new in 2015
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


class Contact(models.Model):
    """school endpoint or email to which we send confirmations"""
    contact = models.CharField(max_length=255, help_text="EMAIL", blank=True)
    endpoint = models.CharField(max_length=255, blank=True)
    name = models.CharField(max_length=255, blank=True)
    internal_note = models.TextField(blank=True)

    def __unicode__(self):
        return u", ".join([bit for bit in [self.contact,
                                           self.endpoint] if bit])


class School(models.Model):
    """
    Represents a school
    """
    SETTLEMENT_CHOICES = (
        ('edmc', 'Education Management Corporation'),
        ('', 'Non-settlement')
        )
    school_id = models.IntegerField(primary_key=True)
    ope6_id = models.IntegerField(blank=True, null=True)
    ope8_id = models.IntegerField(blank=True, null=True)
    settlement_school = models.CharField(max_length=100,
                                         blank=True,
                                         choices=SETTLEMENT_CHOICES,
                                         default='')
    contact = models.ForeignKey(Contact, blank=True, null=True)
    data_json = models.TextField(blank=True)
    city = models.CharField(max_length=50, blank=True)
    state = models.CharField(max_length=2, blank=True)
    zip5 = models.CharField(max_length=5, blank=True)
    enrollment = models.IntegerField(blank=True, null=True)
    accreditor = models.CharField(max_length=255, blank=True)
    ownership = models.CharField(max_length=255, blank=True)
    control = models.CharField(max_length=50,
                               blank=True,
                               help_text="'Public', 'Private' or 'For-profit'")
    url = models.TextField(blank=True)
    degrees_predominant = models.TextField(blank=True)
    degrees_highest = models.TextField(blank=True)
    main_campus = models.NullBooleanField()
    online_only = models.NullBooleanField()
    operating = models.BooleanField(default=True)
    under_investigation = models.BooleanField(default=False,
                                              help_text=("Heightened Cash "
                                                         "Monitoring 2"))
    KBYOSS = models.BooleanField(default=False)  # shopping-sheet participant

    grad_rate_4yr = models.DecimalField(max_digits=5,
                                        decimal_places=3,
                                        blank=True, null=True)
    grad_rate_lt4 = models.DecimalField(max_digits=5,
                                        decimal_places=3,
                                        blank=True, null=True)
    grad_rate = models.DecimalField(max_digits=5,
                                    decimal_places=3,
                                    blank=True, null=True,
                                    help_text="A 2-YEAR POOLED VALUE")
    repay_3yr = models.DecimalField(max_digits=13,
                                    decimal_places=10,
                                    blank=True, null=True,
                                    help_text=("GRADS WITH A DECLINING BALANCE"
                                               " AFTER 3 YRS"))
    default_rate = models.DecimalField(max_digits=5,
                                       decimal_places=3,
                                       blank=True, null=True,
                                       help_text="LOAN DEFAULT RATE AT 3 YRS")
    median_total_debt = models.DecimalField(max_digits=7,
                                            decimal_places=1,
                                            blank=True, null=True,
                                            help_text="MEDIAN STUDENT DEBT")
    median_monthly_debt = models.DecimalField(max_digits=14,
                                              decimal_places=9,
                                              blank=True, null=True,
                                              help_text=("MEDIAN STUDENT "
                                                         "MONTHLY DEBT"))
    median_annual_pay = models.IntegerField(blank=True,
                                            null=True,
                                            help_text=("MEDIAN PAY "
                                                       "10 YRS AFTER ENTRY"))
    avg_net_price = models.IntegerField(blank=True,
                                        null=True,
                                        help_text="OVERALL AVERAGE")
    tuition_out_of_state = models.IntegerField(blank=True,
                                               null=True)
    tuition_in_state = models.IntegerField(blank=True,
                                           null=True)
    offers_perkins = models.BooleanField(default=False)

    def as_json(self):
        """delivers pertinent data points as json"""
        region = get_region(self)
        ordered_out = OrderedDict()
        jdata = json.loads(self.data_json)
        dict_out = {
            'books': jdata['BOOKS'],
            'city': self.city,
            'control': self.control,
            'defaultRate': "{0}".format(self.default_rate),
            'gradRate': "{0}".format(self.grad_rate),
            'highestDegree': self.get_highest_degree(),
            'medianAnnualPay': self.median_annual_pay,
            'medianMonthlyDebt': "{0}".format(self.median_monthly_debt),
            'medianTotalDebt': "{0}".format(self.median_total_debt),
            'nicknames': ", ".join([nick.nickname for nick
                                    in self.nickname_set.all()]),
            'offersPerkins': self.offers_perkins,
            'onCampusAvail': jdata['ONCAMPUSAVAIL'],
            'online': self.online_only,
            'otherOffCampus': jdata['OTHEROFFCAMPUS'],
            'otherOnCampus': jdata['OTHERONCAMPUS'],
            'otherWFamily': jdata['OTHERWFAMILY'],
            'predominantDegree': self.get_predominant_degree(),
            'region': region,
            'repay3yr': "{0}".format(self.repay_3yr),
            'roomBrdOffCampus': jdata['ROOMBRDOFFCAMPUS'],
            'roomBrdOnCampus': jdata['ROOMBRDONCAMPUS'],
            'school': self.primary_alias,
            'schoolID': self.pk,
            'settlementSchool': self.settlement_school,
            'state': self.state,
            'tuitionGradInDis': jdata['TUITIONGRADINDIS'],
            'tuitionGradInS': jdata['TUITIONGRADINS'],
            'tuitionGradOss': jdata['TUITIONGRADOSS'],
            'tuitionUnderInDis': jdata['TUITIONUNDERINDIS'],
            'tuitionUnderInS': self.tuition_in_state,
            'tuitionUnderOoss': self.tuition_out_of_state,
            'url': self.url,
            'zip5': self.zip5,
        }
        for key in sorted(dict_out.keys()):
            ordered_out[key] = dict_out[key]
        return json.dumps(ordered_out)

    def __unicode__(self):
        return self.primary_alias + u" (%s)" % self.school_id

    def get_predominant_degree(self):
        predominant = ''
        if (self.degrees_predominant and
           self.degrees_predominant in HIGHEST_DEGREES):
            predominant = HIGHEST_DEGREES[self.degrees_predominant]
        return predominant

    def get_highest_degree(self):
        highest = ''
        if (self.degrees_highest and
           self.degrees_highest in HIGHEST_DEGREES):
            highest = HIGHEST_DEGREES[self.degrees_highest]
        return highest

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

    @property
    def nicknames(self):
        return ", ".join([nick.nickname for nick in self.nickname_set.all()])


class Notification(models.Model):
    """record of a disclosure verification"""
    institution = models.ForeignKey(School)
    oid = models.CharField(max_length=40)
    timestamp = models.DateTimeField()
    errors = models.CharField(max_length=255)
    email = models.CharField(max_length=255, blank=True)
    sent = models.BooleanField(default=False)
    log = models.TextField(blank=True)

    def __unicode__(self):
        return "{0} {1} ({2})".format(self.oid,
                                      self.institution.primary_alias,
                                      self.institution.pk)

    def notify_school(self):
        school = self.institution
        if not school.settlement_school:
            nonmsg = "No notification required; {} is not a settlement school"
            return nonmsg.format(school.primary_alias)
        payload = {
            'oid':    self.oid,
            'time':   self.timestamp.isoformat(),
            'errors': self.errors
        }
        now = datetime.datetime.now()
        no_contact_msg = ("School notification failed: "
                          "No endpoint or email info {}".format(now))
        # we prefer to use endpount notification, so use it first if existing
        if school.contact:
            if school.contact.endpoint:
                endpoint = school.contact.endpoint
                if type(endpoint) == unicode:
                    endpoint = endpoint.encode('utf-8')
                try:
                    resp = requests.post(endpoint, data=payload, timeout=10)
                except requests.exceptions.ConnectionError as e:
                    exmsg = ("Error: connection error at school "
                             "{} {}\n".format(now, e))
                    self.log = self.log + exmsg
                    self.save()
                    return exmsg
                except requests.exceptions.Timeout:
                    exmsg = ("Error: connection with school "
                             "timed out {}\n".format(now))
                    self.log = self.log + exmsg
                    self.save()
                    return exmsg
                except requests.exceptions.RequestException as e:
                    exmsg = ("Error: request error at school: "
                             "{} {}\n".format(now, e))
                    self.log = self.log + exmsg
                    self.save()
                    return exmsg
                else:
                    if resp.ok:
                        self.sent = True
                        self.log = ("School notified "
                                    "via endpoint {}".format(now))
                        self.save()
                        return self.log
                    else:
                        msg = ("Send attempted: {}\nURL: {}\n"
                               "response reason: {}\nstatus_code: {}\n"
                               "content: {}\n\n".format(now,
                                                        endpoint,
                                                        resp.reason,
                                                        resp.status_code,
                                                        resp.content))
                        self.log = self.log + msg
                        self.save()
                        return "Notification failed: {}".format(msg)
            elif school.contact.contact:
                try:
                    send_mail("CFPB disclosure notification",
                              NOTIFICATION_TEMPLATE.substitute(payload),
                              "no-reply@cfpb.gov",
                              [school.contact.contact],
                              fail_silently=False)
                    self.sent = True
                    self.email = school.contact.contact
                    self.log = ("School notified via email "
                                "at {}".format(self.email))
                    self.save()
                    return self.log
                except smtplib.SMTPException as e:
                    email_fail_msg = ("School email notification "
                                      "failed on {}\n"
                                      "Error: {}".format(now, e))
                    self.log = self.log + email_fail_msg
                    self.save()
                    return email_fail_msg
            else:
                self.log = self.log + no_contact_msg
                self.save()
                return no_contact_msg
        else:
            self.log = self.log + no_contact_msg
            self.save()
            return no_contact_msg


class Disclosure(models.Model):
    """Legally required wording for aspects of a school's aid disclosure"""
    name = models.CharField(max_length=255)
    institution = models.ForeignKey(School, blank=True, null=True)
    text = models.TextField(blank=True)

    def __unicode__(self):
        return self.name + u" (%s)" % unicode(self.institution)


class Program(models.Model):
    """
    Cost and outcome info for an individual course of study at a school
    """
    DEBT_NOTE = "TITLEIV_DEBT + PRIVATE_DEBT + INSTITUTIONAL_DEBT"
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
    completion_cohort = models.IntegerField(blank=True,
                                            null=True,
                                            help_text="COMPLETION COHORT")
    completers = models.IntegerField(blank=True,
                                     null=True,
                                     help_text="COMPLETERS OF THE PROGRAM")
    titleiv_debt = models.IntegerField(blank=True, null=True)
    private_debt = models.IntegerField(blank=True, null=True)
    institutional_debt = models.IntegerField(blank=True, null=True)
    mean_student_loan_completers = models.IntegerField(blank=True,
                                                       null=True,
                                                       help_text=DEBT_NOTE)
    median_student_loan_completers = models.IntegerField(blank=True,
                                                         null=True,
                                                         help_text=DEBT_NOTE)
    default_rate = models.DecimalField(blank=True,
                                       null=True,
                                       max_digits=5,
                                       decimal_places=2)
    salary = models.IntegerField(blank=True, null=True,
                                 help_text='MEDIAN SALARY')
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

    def get_level(self):
        level = ''
        if self.level and str(self.level) in HIGHEST_DEGREES:
            level = HIGHEST_DEGREES[str(self.level)]
        return level

    def as_json(self):
        ordered_out = OrderedDict()
        dict_out = {
            'accreditor': self.accreditor,
            'books': self.books,
            'campus': self.campus,
            'cipCode': self.cip_code,
            'completionRate': "{0}".format(self.completion_rate),
            'completionCohort': self.completion_cohort,
            'completers': self.completers,
            'defaultRate': "{0}".format(self.default_rate),
            'fees': self.fees,
            'housing': self.housing,
            'institution': self.institution.primary_alias,
            'institutionalDebt': self.institutional_debt,
            'jobNote': self.job_note,
            'jobRate': "{0}".format(self.job_rate),
            'level': self.get_level(),
            'medianStudentLoanCompleters': self.median_student_loan_completers,
            'meanStudentLoanCompleters': self.mean_student_loan_completers,
            'privateDebt': self.private_debt,
            'programCode': self.program_code,
            'programLength': make_even(self.program_length),
            'programName': self.program_name,
            'salary': self.salary,
            'schoolID': self.institution.school_id,
            'socCodes': self.soc_codes,
            'timeToComplete': self.time_to_complete,
            'titleIVDebt': self.titleiv_debt,
            'totalCost': self.total_cost,
            'transportation': self.transportation,
            'tuition': self.tuition,
        }
        for key in sorted(dict_out.keys()):
            ordered_out[key] = dict_out[key]

        return json.dumps(ordered_out)

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
        newlist = []
        for key in keylist:
            try:
                print "%s: %s" % (key, obj.__getattribute__(key))
            except:
                pass
            else:
                newlist.append(key)
        return [obj.__getattribute__(key) for key in newlist]
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
