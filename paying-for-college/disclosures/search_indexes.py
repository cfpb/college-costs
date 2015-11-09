from haystack import indexes
from disclosures.models import School


class SchoolIndex(indexes.SearchIndex, indexes.Indexable):
    text = indexes.CharField(document=True, use_template=True)
    school_id = indexes.IntegerField(model_attr='school_id')
    city = indexes.CharField(model_attr='city')
    state = indexes.CharField(model_attr='state')
    autocomplete = indexes.EdgeNgramField()

    def get_model(self):
        return School

    def index_queryset(self, using=None):
        return self.get_model().objects.all()

    def prepare_autocomplete(self, obj):
        alias_strings = [a.alias for a in obj.alias_set.all()]
        nickname_strings = [n.nickname for n in obj.nickname_set.all()]
        auto_strings = alias_strings + nickname_strings
        return ' '.join(auto_strings)
