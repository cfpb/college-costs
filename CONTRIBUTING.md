# Guidance on how to contribute

> All contributions to this project will be released under the CC0 public domain
> dedication. By submitting a pull request or filing a bug, issue, or 
> feature request, you are agreeing to comply with this waiver of copyright interest.
> Details can be found in our [TERMS](TERMS.md) and [LICENCE](LICENSE).


There are two primary ways to help: 
 - Using the issue tracker, and 
 - Changing the code-base.


## Using the issue tracker

Use the issue tracker to suggest feature requests, report bugs, and ask questions. 
This is also a great way to connect with the developers of the project as well
as others who are interested in this solution.  

Use the issue tracker to find ways to contribute. Find a bug or a feature, mention in
the issue that you will take on that effort, then follow the _Changing the code-base_ 
guidance below.


## Changing the code-base

Generally speaking, you should fork this repository, make changes in your
own fork, and then submit a pull-request. All new code should have associated unit
tests that validate implemented features and the presence or lack of defects. 
Additionally, the code should follow any stylistic and architectural guidelines 
prescribed by the project. In the absence of such guidelines, mimic the styles
and patterns in the existing code-base.

## Browser support

We configure [Autoprefixer](#autoprefixer) to support the following list of browsers.

- Latest 2 releases of all browsers including:
    - Chrome
    - Firefox
    - Safari
    - Internet Explorer
    - Edge
    - Opera
    - iOS Safari
    - Opera Mini
    - Android Browser
    - BlackBerry Browser
    - Opera Mobile
    - Chrome for Android
    - Firefox for Android
    - Samsung Internet
- Internet Explorer 9
- Internet Explorer 8

http://browserl.ist/?q=last+2+versions%2C+Explorer+%3E%3D+8

What this means to the end-user is we've added a level of backward
compatability for modern features as much as possible. This doesn't
necessarily mean feature parity. Where it's impossible or impractical to
implement a modern feature, we fallback to standard practices for that browser.

### Browser Testing

For manual testing, we realistically test this project locally or in a virtual
environment with the following list of browsers:

- Chrome
- Firefox
- Safari
- Internet Explorer 8, 9, 10, and 11
- Edge
- iOS Safari
- Chrome for Android

### Autoprefixer

Autoprefixer parses our CSS and adds vendor prefixes to rules where necessary
using reported feature support by [Can I Use](https://caniuse.com/). For more
information visit the [Autoprefixer documentation site]
(https://autoprefixer.github.io/).

### Known feature differences

- JavaScript: Unlike the main consumerfinance.gov project, this project does
  serve interactive scripting to IE 8, but only for the comparison tool, not
  for the header or footer scripting.
- Icons: We currently use icon fonts to deliver scalable icons. Browsers that
  do not support icon fonts unfortunately do not receive backups but we try to
  always pair icons with text.
