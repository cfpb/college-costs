import json
import time
import datetime

import requests

from disclosures.models import School, Alias, Nickname
from .api_exploration import *

NODE = 'http://127.0.0.1:9200/'


def create_school_index(node=NODE):
    """create the index for schools"""
    data = {
        "settings": {
            "number_of_shards": 3,
            "number_of_replicas": 1
        },
        "mappings": {
            "school": {
                "properties": {
                    "primary_alias": {"type": "string", "boost": 4},
                    "aliases": {"type": "string",
                                "null_value": "na",
                                "boost": 3},
                    "nicknames": {"type": "string",
                                  "null_value": "na",
                                  "boost": 2},
                    "school_id": {"type": "integer"},
                    "state": {"type": "string"}
                }
            }
        }
    }
    response = requests.put("%sschool_index" % node,
                            data=json.dumps(data))
    print response.text


def delete_index(name, node=NODE):
    """delete an index"""
    resp = requests.delete("%s%s" % (node, name))
    print resp.text


def clear_indices(node=NODE):
    """delete all indices"""
    resp = requests.delete("%s_all" % node)
    print resp.text


def load_schools(node=NODE):
    """load schools to elasticsearch index"""
    data = ''
    for skul in School.objects.all():
        data += '{"index": {"_id": "%s"}}\n' % skul.pk
        data += json.dumps({
            "primary_alias": skul.primary_alias,
            "school_id": skul.school_id,
            "aliases": " ,".join([alias.alias for alias
                                 in skul.alias_set.filter(is_primary=False)]),
            "nicknames": " ,".join([nick.nickname for nick
                                    in skul.nickname_set.all()]),
            "state": skul.state
        })+'\n'
    resp = requests.put('%s/school_index/school/_bulk' % node,
                        data=data)
    print resp.reason
    return resp.json()


def rebuild_school_index(node=NODE):
    """clear indices and rebuild schools index"""
    start = datetime.datetime.now()
    print "clearing indices ..."
    clear_indices()
    print "creating new school_index ..."
    create_school_index()
    print "loading schools into index ..."
    load_schools()
    print "indexes torn down and rebuilt in %s" % (datetime.datetime.now() -
                                                   start)


def search(query, node=NODE, size=20):
    """search index for query term"""
    data = {
        "query": {
            "query_string": {"query": query}
            }
        }
    resp = requests.post('%sschool_index/school/_search?size=%s' % (node,
                                                                    size),
                         data=json.dumps(data))
    if resp.ok:
        results = resp.json()
        for hit in results['hits']['hits']:
            school = hit['_source']
            print "%s (%s) %s" % (school['primary_alias'],
                                  school['school_id'],
                                  school['state'])
        return results
    else:
        print resp.reason
        return ''


def check_indices(node=NODE):
    """return list of indices and their health"""
    resp = requests.get("%s_cat/indices?v" % node).text.split('\n')
    for line in resp:
        print line


def refresh_index(name, node=NODE):
    """refresh an index to pick up any pending changes"""
    resp = requests.post("%s%s/_refresh" % (node, name))
    print resp.text


def get_index_info(name, node=NODE):
    """return index metadata"""
    resp = requests.get("%s%s/?pretty" % (node, name))
    print resp.text
    return resp.json()


def print_vals(obj, val_list=False, val_dict=False):
    """inspect a db object"""
    keylist = sorted([key for key in obj._meta.get_all_field_names()],
                     key=lambda s: s.lower())
    try:
        print "%s values for %s:\n" % (obj._meta.object_name, obj)
    except:
        pass
    if val_list:
        return [obj.__getattribute__(key) for key in keylist]
    elif val_dict:
        return obj.__dict__
    else:
        for key in keylist:
            try:
                print "%s: %s" % (key, obj.__getattribute__(key))
            except:
                pass

# FIELDS = {'master_13.10001': '10001|13|||',
#           'hfSelectedIds': '10001|13|||,10016|13|||,10021|13|||,10011|13|||,10096|13|||,10106|13|||,10101|13|||,10111|13|||,10071|13|||,10186|13|||,10206|13|||,15401|13|||,70711|13|||,70726|13|||,70746|13|||,70731|13|||,70736|13|||,70741|13|||,70966|13|||,70981|13|||,70986|13|||,70991|13|||,70996|13|||,71001|13|||,11951|13|||,11966|13|||,11981|13|||,12011|13|||,12041|13|||,12026|13|||,12071|13|||,12056|13|||',
#           'master_13.10016': '10016|13|||',
#           'master_13.10021': '10021|13|||',
#           'master_13.10011': '10011|13|||',
#           'master_13.10096': '10096|13|||',
#           'master_13.10106': '10106|13|||',
#           'master_13.10101': '10101|13|||',
#           'master_13.10111': '10111|13|||',
#           'master_13.10071': '10071|13|||',
#           'master_13.10186': '10186|13|||',
#           'master_13.10206': '10206|13|||',
#           'master_13.15401': '15401|13|||',
#           'master_13.70711': '70711|13|||',
#           'master_13.70726': '70726|13|||',
#           'master_13.70746': '70746|13|||',
#           'master_13.70731': '70731|13|||',
#           'master_13.70736': '70736|13|||',
#           'master_13.70741': '70741|13|||',
#           'master_13.70966': '70966|13|||',
#           'master_13.70981': '70981|13|||',
#           'master_13.70986': '70986|13|||',
#           'master_13.70991': '70991|13|||',
#           'master_13.70996': '70996|13|||',
#           'master_13.71001': '71001|13|||',
#           'master_13.11951': '11951|13|||',
#           'master_13.11966': '11966|13|||',
#           'master_13.11981': '11981|13|||',
#           'master_13.12011': '12011|13|||',
#           'master_13.12041': '12041|13|||',
#           'master_13.12026': '12026|13|||',
#           'master_13.12071': '12071|13|||',
#           'master_13.12056': '12056|13|||'}


# from disclosures.scripts.ES_utils import *
