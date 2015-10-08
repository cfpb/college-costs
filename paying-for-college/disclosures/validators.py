from uuid import UUID

from django.core.exceptions import ValidationError

def validate_uuid4(value):
    try: 
       valid_uuid = UUID(value,version=4) 
    except ValueError:
        raise ValidationError('%s is not a valid uuid4' % value)
