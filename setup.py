import os
from setuptools import setup, find_packages


setup_requires = [
    'cfgov-setup==1.2',
    'setuptools-git-version==1.0.3',
]


install_requires = [
    'Django>=1.11,<1.12',
    'django-haystack>=2.7,<2.9',
    'djangorestframework>=3.6,<3.9',
    'elasticsearch>=2.4.1,<3',
    'PyYAML==3.13',
    'requests>=2.18,<3',
    'Unipath>=1.1,<2',
]


docs_extras = [
    'mkDOCter==1.0.5',
    'mkdocs==0.17.5',
]


testing_extras = [
    'coverage>=4.5.1,<5',
    'dj-database-url>=0.4.2,<1',
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
                   'static/paying_for_college/disclosures/static/icons/*.svg',
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
