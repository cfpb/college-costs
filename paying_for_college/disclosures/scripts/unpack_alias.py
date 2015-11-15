from disclosures.models import School, Alias


def unpack_alias(alist, school):
    "create aliases for a list of concatinated aliases"
    for alias in alist:
        new, created = Alias.objects.get_or_create(alias=alias,
                                                   institution=school,
                                                   defaults={'is_primary':
                                                             False})
ALIST = [
    'Penn',
    'U of PA',
    'U-Penn',
    'U of P',
    'Pennsylvania',
    'UPenn',
    'Pennsylvania University',
    'Wharton',
    'Wharton School of Business']
