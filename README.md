[![Build Status](https://travis-ci.org/cfpb/college-costs.png)](https://travis-ci.org/cfpb/college-costs) [![Coverage Status](https://coveralls.io/repos/github/cfpb/college-costs/badge.svg?branch=master)](https://coveralls.io/github/cfpb/college-costs?branch=master)

# Paying for College
Tools to help students make informed financial decisions about college.

## ⚠️ DEPRECATION NOTE ⚠️
This repository is being retired, and its code has been ported to the [cfgov-refresh](https://github.com/cfpb/cfgov-refresh) repo. Code on this site will no longer be maintained, with the exception of our published documentation of [specifications for using the tool](https://cfpb.github.io/college-costs/). 

![](compare_hero.png)

- **Status**:  Beta
- This project is under construction. Please wear a hardhat.

### Setup dependencies
 * [pip](https://pypi.python.org/pypi/pip)
 * [virtualenv](https://virtualenv.pypa.io/en/latest/)
 * [virtualenvwrapper](https://virtualenvwrapper.readthedocs.org/en/latest/)
 * [node](http://nodejs.org/) (version 6)
 * [gulp](https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md)

<!--  * [elasticsearch](https://www.elastic.co/products/elasticsearch) -->

### Code dependencies
- [Django](https://www.djangoproject.com/)
- [requests](http://docs.python-requests.org/en/latest/)
- [Unipath](https://github.com/mikeorr/Unipath)
- [Haystack](http://haystacksearch.org/)
- [Elasticsearch](https://www.elastic.co/products/elasticsearch)

<!-- - [django-haystack](http://haystacksearch.org/) -->

### Testing dependencies
- [mock](https://github.com/testing-cabal/mock)
- [coverage](https://coverage.readthedocs.org/en/latest/)

### Data specifications
- Requirements for submitting data for use in this tool can be found in [our specifications documentation](https://cfpb.github.io/college-costs/).

### Installation
This project is not fully functional, but feel free to give it a spin. Here's how:
- Install the setup dependencies if you don't have them.
- Go to the local directory where you want the project to be created, make a virtual environment, clone this repository (or your own fork of it).
```bash
mkvirtualenv college-costs
git clone https://github.com/cfpb/college-costs.git .
setvirtualenvproject
```
- Set up database assets and front-end resources:
```bash
./standalone_setup.sh
```

- Now you should be able to fire up a local web server:
```bash
./manage.py runserver
```

The college-cost tools should show up at [localhost:8000/paying-for-college2/](http://localhost:8000/paying-for-college2/)

The app is set up to run as a component of CFPB's website, [consumerfinance.gov](https://www.consumerfinance.gov), so if you run it locally, some fonts and font-related icons may not load because of [Cross-Origin Resource Sharing](http://www.w3.org/TR/cors/) policies.

### Search
The app has a simple API for searching schools by name or nickname. The endpoint, to which you can append a querystring, is:

```
/understanding-your-financial-aid-offer/api/search-schools.json
```

An example query is http://localhost:8000/understanding-your-financial-aid-offer/api/search-schools.json?q=harvard.

Elasticsearch needs to be running locally for search to work.

With Elasticsearch running, and with college data loaded into your Django database using
the script above, you can now build a search index using this command:

```
./manage.py update_index -r paying_for_college
```

Now you should get a JSON response when hitting the search API. You can search by school name or nickname, such as:

http://localhost:8000/understanding-your-financial-aid-offer/api/search-schools.json?q=jayhawks

### Running tests

#### Python Tests

Python tests for this project can be run using
[Tox](https://tox.readthedocs.io/en/latest/) with the `tox` command.

#### Javascript Tests
To run JavaScript unit tests:

```bash
npm test
```

To check for security vulnerabilities in Node packages(requires a
[Snyk](https://snyk.io/) login)

```bash
npm run snyk
```

To run functional tests, **you need to make sure that you have version 4.0+ of Node.js**. Install/upgrade it using either `npm` or `brew`.

You'll also need webdriver-manager and protractor:

```bash
npm install -g webdriver-manager protractor
webdriver-manager update --standalone
```

To run the tests:

```bash
# start webdriver in a terminal tab:
webdriver-manager start
# if you're running it on a localhost, in a fresh tab:
python manage.py runserver
# and in a third tab:
protractor test/functional/conf.js
```

##### Load Tests
Before you run load tests, you will first need to download and unzip [JMeter 3.0](http://jmeter.apache.org/download_jmeter.cgi).

In terminal, execute JMeter and run the following command to open JMeter GUI:

```shell
[Path to JMeter Folder]/bin/jmeter.sh -t [Path to this repository]/college-costs/test/load_testing/Offer.jmx -Jserver_url [parent domain to test] -Jthreads [number of users hitting the site, default: 1] -Jrampup [adding 1 user per specified second, default 5]
```

As an example to if I am in a folder where JMeter and this repository were in, and I am testing it locally on port 8000 with 8 users and add 1 user per 3 seconds:

```shell
apache-jmeter-3.0/bin/jmeter.sh -t college-costs/test/load_testing/Offer.jmx -Jserver_url localhost:8000 -Jthreads 8 -Jrampup 3
```

The corresponding `Offer.csv` in `test/load_testing` specified the parameters being used for testing.  The order and name of each column is specified in the JMX file under CSV Offer.

## API Docs

[Documentation](https://cfpb.github.io/college-costs/) for this repository is rendered via GitHub pages. They can be edited in the `docs/` directory, but to view or deploy them, you'll need to install the docs dependencies listed in the `setup.py`:

```
pip install -e '.[docs]'
```

You can then preview your changes locally by running `mkdocs serve` and then reviewing <http://127.0.0.1:8000/>

When your changes are ready, you can submit them as a normal pull request. After that, you can use this command to publish them:

```
mkdocs gh-deploy --clean
```

That pushes the necessary files to the `gh-pages` branch.

### Notes

- The `mkdocs gh-deploy` command will push any edits you've made locally to the `gh-pages` branch of the repository, whether you've committed them or not.
- Mkdocs will create a "site" directory locally when you use either `build`, `serve` or `gh-deploy`. This is used to assemble assets to be pushed to the gh-pages branch, but the `site/` directory itself doesn't need to be under version control. It can be deleted after a deploy.

## Getting involved

If you find a bug or see a way to improve the project, we'd love to hear from you. Add an issue, or fork the project and send us a pull request with your suggested changes.

----

## Open source licensing info
1. [TERMS](TERMS.md)
2. [LICENSE](LICENSE)
3. [CFPB Source Code Policy](https://github.com/cfpb/source-code-policy/)


----

## Credits and references

This project is based on the current [CFPB Paying for College](https://www.consumerfinance.gov/paying-for-college/) suite of tools for students.
