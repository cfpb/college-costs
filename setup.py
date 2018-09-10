import os
from setuptools import setup, find_packages


setup_requires=[
    'cfgov-setup==1.2',
    'setuptools-git-version==1.0.3',
]


install_requires = [
    'Django>=1.8,<1.12',
    'django-haystack==2.7.0',
    'djangorestframework==3.6.4',
    'elasticsearch==2.4.1',
    'PyYAML==3.11',
    'python-dateutil==2.2',
    'requests==2.7.0',
    'Unipath==1.1',
]


docs_extras = [
    'Markdown==2.3.1',
    'PyYAML==3.10',
    'backports-abc==0.4',
    'certifi==2016.8.2',
    'click==3.3',
    'django-livereload==1.2',
    'livereload==2.3.2',
    'mkDOCter==1.0.3',
    'mkdocs==0.15.3',
    'mkdocs-bootstrap==0.1.1',
    'mkdocs-bootswatch==0.1.0',
    'singledispatch==3.4.0.3',
    'six==1.9.0',
    'tornado==4.1',
]


testing_extras = [
    'coverage==4.2',
    'dj-database-url==0.4.2',
    'mock==2.0.0',
]


def read_file(filename):
    """Read a file into a string"""
    path = os.path.abspath(os.path.dirname(__file__))
    filepath = os.path.join(path, filename)
    try:
        return open(filepath).read()
    except IOError:
        return ''


setup(
    name='college-costs',
    version_format='{tag}.dev{commitcount}+{gitsha}',
    author='CFPB',
    author_email='tech@cfpb.gov',
    maintainer='cfpb',
    maintainer_email='tech@cfpb.gov',
    packages=find_packages(),
    package_data={'paying_for_college':
                  ['data_sources/ipeds/*cleaned.csv',
                   'data_sources/ipeds/test.txt.zip',
                   'fixtures/*.json',
                   'templates/*.txt',
                   'templates/*.html',
                   'static/paying_for_college/feedback/css/*.css',
                   'static/paying_for_college/feedback/js/*.js',
                   'static/paying_for_college/feedback/images/*.png',
                   'static/paying_for_college/disclosures/static/css/*.css',
                   'static/paying_for_college/disclosures/static/css/*.map',
                   'static/paying_for_college/disclosures/static/fonts/*.eot',
                   'static/paying_for_college/disclosures/static/fonts/*.svg',
                   'static/paying_for_college/disclosures/static/fonts/*.woff',
                   'static/paying_for_college/disclosures/static/fonts/*.ttf',
                   'static/paying_for_college/disclosures/static/js/*.htc',
                   'static/paying_for_college/disclosures/static/js/*.js',
                   'static/paying_for_college/disclosures/static/js/*.map',
                   'static/paying_for_college/disclosures/static/img/*.png'
                   ],
                  },
    include_package_data=True,
    description=u'College cost tools',
    classifiers=[
        'Topic :: Internet :: WWW/HTTP',
        'Intended Audience :: Developers',
        'Programming Language :: Python',
        'Programming Language :: Python :: 2.6',
        'Programming Language :: Python :: 2.7',
        'Framework :: Django',
        'Development Status :: 4 - Beta',
        'Operating System :: OS Independent',
    ],
    long_description=read_file('README.md'),
    zip_safe=False,
    setup_requires=setup_requires,
    install_requires=install_requires,
    frontend_build_script='setup.sh',
    extras_require={
        'docs': docs_extras,
        'testing': testing_extras,
    }
)
