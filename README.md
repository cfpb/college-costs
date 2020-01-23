# Paying for College
Documentation for a tool to help students make informed financial decisions about college.

## ⚠️ DEPRECATION NOTE ⚠️
The code for this tool is no longer maintained in this repository and has been ported to the [cfgov-refresh](https://github.com/cfpb/cfgov-refresh) repo.  
The repository is maintained to preserve [our specifications for using the tool](https://cfpb.github.io/college-costs/). 

## API Docs

[The documentation](https://cfpb.github.io/college-costs/) for this repository is rendered via GitHub pages. They can be edited in the `docs/` directory, but to view them locally or deploy them, you'll need to switch to the deprecated master branch and install the docs dependencies listed in `setup.py`:

```
pip install -e '.[docs]'
```

You can then preview your changes locally by running `mkdocs serve` and then reviewing <http://127.0.0.1:8000/>

README changes can be submitted as a pull request. After that, you can use this command to publish them:

```
mkdocs gh-deploy --clean
```

That pushes the necessary files to the `gh-pages` branch, which is now the default branch.

### Notes

- The `mkdocs gh-deploy` command will push any edits you've made locally to the `gh-pages` branch of the repository, whether you've committed them or not.
- Mkdocs will create a "site" directory locally when you use either `build`, `serve` or `gh-deploy`. This is used to assemble assets to be pushed to the gh-pages branch, but the `site/` directory itself doesn't need to be under version control. It can be deleted after a deploy.

----

## Open source licensing info
1. [TERMS](TERMS.md)
2. [LICENSE](LICENSE)
3. [CFPB Source Code Policy](https://github.com/cfpb/source-code-policy/)

----
