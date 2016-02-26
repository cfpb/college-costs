import os
from setuptools import setup
# from setuptools import find_packages
# from subprocess import call
# from setuptools import Command
# from distutils.command.build_ext import build_ext as _build_ext
# from setuptools.command.bdist_egg import bdist_egg as _bdist_egg


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
    version='2.0.1',
    author='CFPB',
    author_email='tech@cfpb.gov',
    maintainer='cfpb',
    maintainer_email='tech@cfpb.gov',
    packages=['paying_for_college'],
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
)
