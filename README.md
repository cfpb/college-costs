# Paying for College
Tools to help students make informed financial decisions about college.

![](compare_hero.png)

- **Status**:  Alpha
- This project is under construction Please wear a hardhat.

### Setup dependencies
 * [pip](https://pypi.python.org/pypi/pip)
 * [virtualenv](https://virtualenv.pypa.io/en/latest/)
 * [virtualenvwrapper](https://virtualenvwrapper.readthedocs.org/en/latest/)
 * [Node](http://nodejs.org/)
 * [Grunt](http://gruntjs.com/)

### Code dependencies
- [Django](https://www.djangoproject.com/)
- [requests](http://docs.python-requests.org/en/latest/)
- [Unipath](https://github.com/mikeorr/Unipath)

### Testing dependencies
- [selenium](https://selenium-python.readthedocs.org/installation.html)
- [behave](http://pythonhosted.org/behave/)
- [PyHamcrest](https://pyhamcrest.readthedocs.org/en/V1.8.2/)

### Installation
This project is not fully functional, but feel free to give it a spin. Here's how:
- Install the setup dependencies.
- Go to the local directory where you want the project to be created, make a virtual environment, clone this repository (or your own fork of it) and install requirements and settings.
```bash
mkvirtualenv college-costs
git clone https://github.com/cfpb/college-costs.git .
setvirtualenvproject
pip install -r requirements/base.txt
```
- Set up front-end resources and database assets with the setup script:
```bash
./setup.sh
```
- Move to the `paying-for-college` directory and fire up a local server:
```bash
cd paying-for-college
python manage.py runserver
```

The only working piece at present is the page for comparing aid offers, which should show up at [http://127.0.0.1:8000/disclosures/compare-financial-aid-and-college-cost/](http://127.0.0.1:8000/disclosures/compare-financial-aid-and-college-cost/)

<!-- INCLUDE IN setup.sh
- Build the front-end requirements and the JavaScript files.

```bash
npm install
grunt Build
```

## Configuration

If the software is configurable, describe it in detail, either here or in other documentation to which you link.

## Usage

Show users how to use the software. 
Be specific. 
Use appropriate formatting when showing code snippets.

## How to test the software

If the software includes automated tests, detail how to run those tests. -->

## Getting involved

If you find a bug or see a way to improve the project, we'd love to hear from you. Add an issue, or fork the project and send us a pull request with your suggested changes.

----

## Open source licensing info
1. [TERMS](TERMS.md)
2. [LICENSE](LICENSE)
3. [CFPB Source Code Policy](https://github.com/cfpb/source-code-policy/)


----

## Credits and references

1. Projects that inspired you
2. Related projects
3. Books, papers, talks, or other sources that have meaniginful impact or influence on this project 
