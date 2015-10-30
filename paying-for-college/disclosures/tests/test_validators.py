from django.test import TestCase
from django.core.exceptions import ValidationError

from disclosures.validators import validate_uuid4


class UUIDValidatorTestCase(TestCase):
    def test_valid_uuid4(self):
        result = validate_uuid4('841df17e-784f-4ea4-bfb3-ebac5d2fcfe5')
        # validators do not return a value, only indications are raising
        # ValidationError, or not
        self.assertEqual(result, None)

    def test_invalid_uuid4(self):
        invalid_uuid = '\r\n\r\nOMG CHECK OUT THIS TOTES LEGIT CFPB-APPROVED WEBSITE: http://nyan.cat\r\n\r\nOh, and here is some Kafka:\r\n\r\nOne morning, as Gregor Samsa was waking up from anxious dreams, he discovered that in his bed he had been changed into a monstrous verminous bug. He lay on his armour-hard back and saw, as he lifted his head up a little, his brown, arched abdomen divided up into rigid bow-like sections. From this height the blanket, just about ready to slide off completely, could hardly stay in place. His numerous legs, pitifully thin in comparison to the rest of his circumference, flickered helplessly before his eyes.\r\n'
        self.assertRaises(ValidationError, validate_uuid4, invalid_uuid)
