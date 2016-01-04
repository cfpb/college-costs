from uuid import UUID
import json

from django.core.exceptions import ValidationError

WHITELIST_KEYS = {
    'alias': 'string',
    'avgmonthlypay': 'float',
    'avgstuloandebt': 'integer',
    'avgstuloandebtrank': 'integer',
    'badalias': 'string',
    'bah': 'integer',
    'books': 'integer',
    'borrowingtotal': 'integer',
    'city': 'string',
    'control': 'string',
    'defaultrate': 'float',
    'family': 'integer',
    'federaltotal': 'integer',
    'firstyrcostattend': 'integer',
    'firstyrnetcost': 'integer',
    'gap': 'integer',
    'gibill': 'integer',
    'gibillbs': 'integer',
    'gibillinstatetuition': 'integer',
    'gibillla': 'integer',
    'gibilltf': 'integer',
    'gradplus': 'integer',
    'gradplus_max': 'integer',
    'gradplusgrad': 'integer',
    'gradpluswithfee': 'integer',
    'gradrate': 'float',
    'gradraterank': 'integer',
    'grantstotal': 'integer',
    'homeequity': 'integer',
    'homeequitygrad': 'integer',
    'indicatorgroup': 'integer',
    'instate': 'boolean',
    'institutionalloan': 'integer',
    'institutionalloan_max': 'integer',
    'institutionalloangrad': 'integer',
    'institutionalloanrate': 'float',
    'kbyoss': 'yes-no',
    'loandebt1yr': 'integer',
    'loanlifetime': 'integer',
    'loanmonthly': 'integer',
    'loanmonthlyparent': 'integer',
    'moneyforcollege': 'integer',
    'netprice': 'integer',
    'netprice110k': 'integer',
    'netprice3ok': 'integer',
    'netprice48k': 'integer',
    'netprice75k': 'integer',
    'netpricegeneral': 'integer',
    'netpriceok': 'integer',
    'offeraa': 'yes-no',
    'offerba': 'yes-no',
    'offergrad': 'yes-no',
    'oncampusavail': 'yes-no',
    'online': 'yes-no',
    'otherexpenses': 'integer',
    'otheroffcampus': 'integer',
    'otheroncampus': 'integer',
    'otherwfamily': 'integer',
    'overborrowing': 'integer',
    'parentplus': 'integer',
    'parentplusgrad': 'integer',
    'parentpluswithfee': 'integer',
    'pell': 'integer',
    'pell_max': 'integer',
    'perkins': 'integer',
    'perkins_max': 'integer',
    'perkinsgrad': 'integer',
    'personal': 'integer',
    'prgmlength': 'integer',
    'privateloan': 'integer',
    'privateloan_max': 'integer',
    'privateloangrad': 'integer',
    'privateloanrate': 'float',
    'privatetotal': 'integer',
    'program': 'string',
    'remainingcost': 'integer',
    'repaymentterm': 'integer',
    'retentrate': 'float',
    'riskofdefault': 'string',
    'roombrd': 'integer',
    'roombrdoffcampus': 'integer',
    'roombrdoncampus': 'integer',
    'salaryexpected25yrs': 'float',
    'salarymonthly': 'float',
    'salaryneeded': 'integer',
    'savings': 'integer',
    'savingstotal': 'integer',
    'scholar': 'integer',
    'school': 'string',
    'school_id': 'integer',
    'staffsubsidized': 'integer',
    'staffsubsidized_max': 'integer',
    'staffsubsidizedgrad': 'integer',
    'staffsubsidizedwithfee': 'integer',
    'staffunsubsidized': 'integer',
    'staffunsubsidized_max': 'integer',
    'staffunsubsidizeddep_max': 'integer',
    'staffunsubsidizedgrad': 'integer',
    'staffunsubsidizedindep_max': 'integer',
    'staffunsubsidizedwithfee': 'integer',
    'state': 'string',
    'state529plan': 'integer',
    'tfinstate': 'integer',
    'totaldebtgrad': 'integer',
    'totalgrantsandsavings': 'integer',
    'totaloutofpocket': 'integer',
    'transportation': 'integer',
    'tuitionassist': 'integer',
    'tuitionassist_max': 'integer',
    'tuitionfees': 'integer',
    'tuitiongradindis': 'integer',
    'tuitiongradins': 'integer',
    'tuitiongradoss': 'integer',
    'tuitionunderindis': 'integer',
    'tuitionunderins': 'integer',
    'tuitionundeross': 'integer',
    'undergrad': 'boolean',
    'unsubsidizedrate': 'float',
    'workstudy': 'integer',
    'yrincollege': 'integer',
    'zip': 'string'
}


def clean_integer(value):
    if value:
        try:
            checked = int(value)
        except:
            return 0
        else:
            return checked
    else:
        return 0


def clean_float(value):
    if value:
        try:
            checked = float(value)
        except:
            return 0
        else:
            return checked
    else:
        return 0


def clean_string(value):
    if value:
        try:
            checked = value.replace('<', '').replace('>', '')[:2000]
        except:
            return ''
        else:
            return checked
    else:
        return ''


def clean_boolean(value):
    if hasattr(value, "lower") and value.lower() in ('false', '0'):
        return False
    if hasattr(value, "lower") and value.lower() in ('true', '1'):
        return True
    else:
        return ''


def clean_yes_no(value):
    if hasattr(value, "lower") and value.lower().strip() == 'no':
        return 'No'
    if hasattr(value, "lower") and value.lower().strip() == 'yes':
        return 'Yes'
    else:
        return ''


def validate_uuid4(value):
    try:
        valid_uuid = UUID(value, version=4)
    except ValueError:
            raise ValidationError('%s is not a valid uuid4' % value)


def validate_worksheet(worksheet_json):
    """
    check worksheet data to accept only whitelisted keys,
    enforce data types and clean strings.
    """
    try:
        data = json.loads(worksheet_json)
        for schoolkey in data:
            school = data[schoolkey]
            for key in school.keys():
                if key not in WHITELIST_KEYS:
                    del(school[key])
            for key in school.keys():
                if WHITELIST_KEYS[key] == 'integer':
                    school[key] = clean_integer(school[key])
                if WHITELIST_KEYS[key] == 'string':
                    school[key] = clean_string(school[key])
                if WHITELIST_KEYS[key] == 'boolean':
                    school[key] = clean_boolean(school[key])
                elif WHITELIST_KEYS[key] == 'yes-no':
                    school[key] = clean_yes_no(school[key])
                elif WHITELIST_KEYS[key] == 'float':
                    school[key] = clean_float(school[key])
    except ValueError:
        # raise ValidationError("Worksheet data is invalid json")
        raise ValidationError("Invalid json")
    else:
        return json.dumps(data)
