# Create your views here.
import os
import json
import uuid
try:
    from collections import OrderedDict
except:  # pragma: no cover
    from ordereddict import OrderedDict

from django.middleware import csrf
from django.core.urlresolvers import reverse
from django.views.generic import View, TemplateView
from django.shortcuts import get_object_or_404, render_to_response
from django.core import serializers
from django.core.exceptions import ObjectDoesNotExist
from django.core.mail import send_mail
from django.template import RequestContext
from django.template.loader import get_template
from django.http import HttpResponse, HttpResponseBadRequest
from django.conf import settings

from haystack.query import SearchQuerySet

from models import School, Worksheet, Feedback
from models import Program, ConstantCap, ConstantRate
# from models import BAHRate
from forms import FeedbackForm, EmailForm
BASEDIR = os.path.dirname(__file__)

try:
    STANDALONE = settings.STANDALONE
except:  # pragma: no cover
    STANDALONE = False

if STANDALONE:
    BASE_TEMPLATE = "standalone/base_update.html"
else:  # pragma: no cover
    BASE_TEMPLATE = "front/base_update.html"

URL_ROOT = 'paying-for-college2'


class BaseTemplateView(TemplateView):

    def get_context_data(self, **kwargs):
        context = super(BaseTemplateView, self).get_context_data(**kwargs)
        context['base_template'] = BASE_TEMPLATE
        context['url_root'] = URL_ROOT
        return context


class LandingView(TemplateView):
    template_name = "landing.html"

    def get_context_data(self, **kwargs):
        context = super(LandingView, self).get_context_data(**kwargs)
        context['base_template'] = BASE_TEMPLATE
        context['url_root'] = URL_ROOT
        return context


class FeedbackView(TemplateView):
    template_name = "feedback.html"

    @property
    def form(self):
        if self.request.method == 'GET':
            return FeedbackForm()

        elif self.request.method == 'POST':
            return FeedbackForm(self.request.POST)

    def get_context_data(self):
        cdict = dict(form=self.form)
        cdict['base_template'] = BASE_TEMPLATE
        cdict['url_root'] = URL_ROOT
        return cdict

    def post(self, request):
        form = self.form
        if form.is_valid():
            feedback = Feedback(message=form.cleaned_data['message'])
            feedback.save()
            return render_to_response("feedback_thanks.html",
                                      locals(),
                                      context_instance=RequestContext(request))
        else:
            return HttpResponseBadRequest("Invalid form")


class BuildComparisonView(View):

    def get(self, request):
        return render_to_response('worksheet.html',
                                  {'data_js': "0",
                                   'base_template': BASE_TEMPLATE,
                                   'url_root': URL_ROOT},
                                  context_instance=RequestContext(request))

    # def post(self, request):
    #     """extract id's and in-state information"""
    #     index = 1
    #     schools = {}
    #     data = {
    #         "global": {
    #             "aaprgmlength": 2,
    #             "yrincollege": 1,
    #             "gradprgmlength": 2,
    #             "familyincome": 48,
    #             "vet": False,
    #             "serving": "no",
    #             "tier": 100,
    #             "program": request.POST.get('school-program', 'ba')
    #             },
    #         "schools": {}
    #     }

    #     for school_id in [value for key, value
    #                       in request.POST.iteritems()
    #                       if key.endswith('-unitid')] + [100000, 100001]:
    #         if school_id:
    #             institution = School.objects.get(pk=int(school_id))
    #             in_state = request.POST.get('school-state-%s' % index, 'in')
    #             field_dict = serializers.serialize(
    #                 "python", [institution])[0]['fields']
    #             field_dict["institutionname"] = unicode(
    #                 institution.primary_alias)
    #             field_dict['instate'] = True if in_state == 'in' else False
    #             field_dict['color'] = False
    #             field_dict['fouryruniv'] = field_dict['four_year']
    #             field_dict.update({"color": False,
    #                                "oncampus": True,
    #                                "tuitionfees": 0,
    #                                "roombrd": 0,
    #                                "books": 0,
    #                                "personal": 0,

    #                                "pell": 0,
    #                                "scholar": 0,
    #                                "tuitionassist": 0,
    #                                "gibill": 0,
    #                                "perkins": 0,
    #                                "staffsubsidized": 0,
    #                                "staffunsubsidized": 0,
    #                                "gradplus": 0,

    #                                "savings": 0,
    #                                "family": 0,
    #                                "state529plan": 0,
    #                                "workstudy": 0,

    #                                "privateloan": 0,
    #                                "institutionalloan": 0,
    #                                "parentplus": 0,
    #                                "homeequity": 0,
    #                                "order": index - 1})

    #             csrf.get_token(request)
    #             data['schools'][str(school_id)] = field_dict
    #             index += 1

    #     data_js = json.dumps(data)
    #     csrf.get_token(request)
    #     return render_to_response('worksheet.html',
    #                               locals(),
    #                               context_instance=RequestContext(request))


class SchoolRepresentation(View):

    def get_school(self, school_id):
        return get_object_or_404(School, pk=school_id)

    def get(self, request, school_id, **kwargs):
        school = self.get_school(school_id)
        return HttpResponse(school.data_json, content_type='application/json')


class ProgramRepresentation(View):

    def get_program(self, program_code):
        return get_object_or_404(Program, program_code=program_code)

    def get(self, request, program_code, **kwargs):
        program = self.get_program(program_code)
        return HttpResponse(program.dump_json(),
                            content_type='application/json')


class ConstantsRepresentation(View):

    def get_constants(self):
        constants = OrderedDict()
        for ccap in ConstantCap.objects.order_by('slug'):
            constants[ccap.slug] = ccap.value
        for crate in ConstantRate.objects.order_by('slug'):
            constants[crate.slug] = "{0}".format(crate.value)
        return json.dumps(constants)

    def get(self, request):
        return HttpResponse(self.get_constants(),
                            content_type='application/json')


class EmailLink(View):
    def post(self, request):
        form = EmailForm(request.POST)
        if form.is_valid():

            worksheet_guid = form.cleaned_data['id']
            worksheet = Worksheet.objects.get(guid=worksheet_guid)
            recipient = form.cleaned_data['email']
            subject = "Your Personalized College Financial Aid Information"
            body_template = get_template('email_body.txt')
            body = body_template.render(RequestContext(request,
                                        dict(guid=worksheet.guid)))

            send_mail(subject, body, 'no-reply@cfpb.gov', [recipient],
                      fail_silently=False)
        document = {'status': 'ok'}
        return HttpResponse(json.dumps(document),
                            content_type='application/javascript')


class CreateWorksheetView(View):
    def post(self, request):
        worksheet_guid = str(uuid.uuid4())
        worksheet = Worksheet(guid=worksheet_guid,
                              saved_data=json.dumps({'id': worksheet_guid})
                              )
        worksheet.save()
        response = HttpResponse(worksheet.saved_data, status=201)
        return response


# TODO: JSON should only allow a whitelist of keys through.
# TODO: Validator should also enforce field value types
class DataStorageView(View):
    def post(self, request, guid):
        worksheet = Worksheet.objects.get(
            guid=guid,
        )
        if request.body:
            worksheet.saved_data = request.body
            worksheet.save()

        return HttpResponse(worksheet.saved_data)


# def bah_lookup_api(request):
#     zip5 = request.GET.get('zip5')
#     try:
#         rate = BAHRate.objects.filter(zip5=zip5).get()
#         document = {'rate': rate.value}
#         document_as_json = json.dumps(document)
#     except:
#         document_as_json = json.dumps({})
#     return HttpResponse(document_as_json,
#                         content_type='application/javascript')


def school_search_api(request):
    sqs = SearchQuerySet().models(School)
    sqs = sqs.autocomplete(autocomplete=request.GET.get('q', ''))

    document = [{'schoolname': school.text,
                 'id': school.school_id,
                 'city': school.city,
                 'state': school.state,
                 'url': reverse('disclosures:school-json',
                                args=[school.school_id])}
                for school in sqs]
    json_doc = json.dumps(document)

    return HttpResponse(json_doc, content_type='application/json')
