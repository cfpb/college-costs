import os
from setuptools import setup, find_packages
from subprocess import call
from setuptools import Command
from distutils.command.build_ext import build_ext as _build_ext
from setuptools.command.bdist_egg import bdist_egg as _bdist_egg
from wheel.bdist_wheel import bdist_wheel as _bdist_wheel


def read_file(filename):
    """Read a file into a string"""
    path = os.path.abspath(os.path.dirname(__file__))
    filepath = os.path.join(path, filename)
    try:
        return open(filepath).read()
    except IOError:
        return ''


class build_frontend(Command):
    """ A command class to run `setup.sh` """
    description = 'build front-end JavaScript and CSS'
    user_options = []

    def initialize_options(self):
        pass

    def finalize_options(self):
        pass

    def run(self):
        print __file__
        call(['./setup.sh'],
             cwd=os.path.dirname(os.path.abspath(__file__)))


class build_ext(_build_ext):
    """ A build_ext subclass that adds build_frontend """
    def run(self):
        self.run_command('build_frontend')
        _build_ext.run(self)


class bdist_egg(_bdist_egg):
    """ A bdist_egg subclass that runs build_frontend """
    def run(self):
        self.run_command('build_frontend')
        _bdist_egg.run(self)


class bdist_wheel(_bdist_wheel):
    """ A bdist_wheel subclass that runs build_frontend """
    def run(self):
        self.run_command('build_frontend')
        _bdist_wheel.run(self)

setup(
    name='college-costs',
    version='2.1.9',
    author='CFPB',
    author_email='tech@cfpb.gov',
    maintainer='cfpb',
    maintainer_email='tech@cfpb.gov',
    packages=find_packages(),
    package_data={'paying_for_college':
                  ['data_sources/ipeds/*cleaned.csv',
                   'fixtures/*.json',
                   'templates/*.txt',
                   'templates/*.html',
                   'static/paying_for_college/disclosures/static/css/*.css',
                   'static/paying_for_college/disclosures/static/css/*.map',
                   'static/paying_for_college/disclosures/static/fonts/*.eot',
                   'static/paying_for_college/disclosures/static/fonts/*.svg',
                   'static/paying_for_college/disclosures/static/fonts/*.woff',
                   'static/paying_for_college/disclosures/static/fonts/*.ttf',
                   'static/paying_for_college/disclosures/static/js/*.htc',
                   'static/paying_for_college/disclosures/static/js/*.js',
                   'static/paying_for_college/disclosures/static/js/*.map',
                   'static/paying_for_college/disclosures/static/img/*.png',
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
    cmdclass={
        'build_frontend': build_frontend,
        'build_ext': build_ext,
        'bdist_egg': bdist_egg,
        'bdist_wheel': bdist_wheel,
    },
)
