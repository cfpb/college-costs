from django.db import models
import uuid


class School(models.Model):
    """
    Represents a school
    """
    school_id = models.IntegerField(primary_key=True)
    data_json = models.TextField()
    city = models.CharField(max_length=50)
    state = models.CharField(max_length=2)

    def __unicode__(self):
        return self.primary_alias + u"(%s)" % self.school_id

    @property
    def primary_alias(self):
        if len(self.alias_set.values()) != 0:
            return self.alias_set.get(is_primary=True).alias
        else:
            return 'Not Available'


class Program(models.Model):
    """
    An individual course of study at a school
    """
    school = models.ForeignKey(School)
    program_name = models.CharField(max_length=255)
    level = models.CharField(max_length=255, blank=True)
    code = models.CharField(max_length=255, blank=True)
    total_cost = models.IntegerField(blank=True, null=True)
    time_to_complete = models.IntegerField(blank=True,
                                           null=True,
                                           help_text="IN DAYS")
    completion_rate = models.DecimalField(blank=True, null=True, max_digits=5, decimal_places=2)
    default_rate = models.DecimalField(blank=True, null=True, max_digits=5, decimal_places=2)
    job_rate = models.DecimalField(blank=True,
                                   null=True,
                                   max_digits=5,
                                   decimal_places=2,
                                   help_text="COMPLETERS WHO GET RELATED JOB")
    salary = models.IntegerField(blank=True, null=True)
    program_length = models.IntegerField(blank=True,
                                         null=True,
                                         help_text="IN DAYS")
    program_cost = models.IntegerField(blank=True,
                                       null=True,
                                       help_text="TUITION & FEES")
    housing = models.IntegerField(blank=True,
                                  null=True,
                                  help_text="HOUSING & MEALS")
    books = models.IntegerField(blank=True,
                                null=True,
                                help_text="BOOKS & SUPPLIES")
    transportation = models.IntegerField(blank=True, null=True)
    other_costs = models.IntegerField(blank=True,
                                      null=True,
                                      help_text="BOOKS & SUPPLIES")

    def uuid(self):
        if len(self.alias_set.values()) != 0:
            return self.alias_set.get(is_primary=True).alias
        else:
            return 'Not Available'


class Offer(models.Model):
    """
    Financial aid package offered to a prospective student
    """
    school = models.ForeignKey(School)
    student_id = models.CharField(max_length=255)
    uuid = models.CharField(max_length=100, blank=True)
    scholarships = models.IntegerField(default=0,
                                       help_text="SCHOLARSHIPS & GRANTS")
    pell_grant = models.PositiveIntegerField(default=0)
    tuition_assistance = models.PositiveIntegerField(default=0)
    gi_bill = models.PositiveIntegerField(default=0)
    work_study = models.PositiveIntegerField(default=0)
    parent_loans = models.PositiveIntegerField(default=0)
    perkins_loans = models.PositiveIntegerField(default=0)
    subsidized_loans = models.PositiveIntegerField(default=0)
    unsubsidized_loans = models.PositiveIntegerField(default=0)
    unsubsidized_loans = models.PositiveIntegerField(default=0)
    unsubsidized_loans = models.PositiveIntegerField(default=0)
    plus_loans = models.PositiveIntegerField(default=0)
    private_loans = models.PositiveIntegerField(default=0)
    private_loan_interest = models.DecimalField(default=0.0, max_digits=5, decimal_places=2)
    school_loans = models.PositiveIntegerField(default=0)
    school_loan_interest = models.DecimalField(default=0.0, max_digits=5, decimal_places=2)
    plus_loans = models.PositiveIntegerField(default=0)
    plus_loans = models.PositiveIntegerField(default=0)
    plus_loans = models.PositiveIntegerField(default=0)
    plus_loans = models.PositiveIntegerField(default=0)
    plus_loans = models.PositiveIntegerField(default=0)
    plus_loans = models.PositiveIntegerField(default=0)
    timestamp = models.DateTimeField(blank=True, null=True)
    in_state = models.NullBooleanField(help_text="ONLY FOR PUBLIC SCHOOLS")

    def save(self, *args, **kwargs):
        if not self.uuid:
            self.uuid = str(uuid.uuid4())
        super(Offer, self).save(*args, **kwargs)


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


class BAHRate(models.Model):
    """
    Basic Allowance for Housing (BAH) rates are zipcode-specific.
    """
    zip5 = models.CharField(max_length=5)
    value = models.IntegerField()


class Worksheet(models.Model):
    """
    The saved state of a student's comaprison worksheet
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
