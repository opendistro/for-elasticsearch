# Open Distro for Elasticsearch website

This repository contains the source code for https://opendistro.github.io/for-elasticsearch/.


## License

This code is licensed under the Apache 2.0 License.


## Build

1. Navigate to the repository root.

1. Install [Ruby](https://www.ruby-lang.org/en/) if you don't already have it. We recommend [RVM](https://rvm.io/), but use whatever method you prefer:

   ```
   curl -sSL https://get.rvm.io | bash -s stable
   rvm install 2.6
   ruby -v
   ```

1. Install [Jekyll](https://jekyllrb.com/) if you don't already have it:

   ```
   gem install bundler jekyll
   ```

1. Install dependencies:

   `bundle install`

1. Build:

   `bundle exec jekyll serve`

1.  Browse to http://127.0.0.1:4000/for-elasticsearch/

For documentation on using Jekyll, visit https://jekyllrb.com/docs/.


## Attribution

[Debian package logo](https://commons.wikimedia.org/wiki/File:Application-x-deb.svg) is used without modification under the [Creative Commons Attribution-ShareAlike 3.0 Unported License](https://creativecommons.org/licenses/by-sa/3.0/).

[TAR icon](http://www.softicons.com/system-icons/hycons-icon-theme-by-gomez-hyuuga) is used without modification under the [Creative Commons Attribution-ShareAlike 2.5 Generic License](https://creativecommons.org/licenses/by-sa/2.5/).

[Windows icon](http://www.softicons.com/application-icons/circle-icons-by-martz90) is used without modification under the [Creative Commons Attribution-NoDerivs 3.0 Unported License](https://creativecommons.org/licenses/by-nd/3.0/).

[Zip icon](http://www.softicons.com/system-icons/imageboard-filetype-icons-by-lopagof) is used without modification under the [Creative Commons Attribution-ShareAlike 3.0 Unported License](https://creativecommons.org/licenses/by-sa/3.0/).

[ODBC icon](http://www.softicons.com/folder-icons/isuite-revoked-icons-by-prax-08) is used without modification under the [Creative Commons Attribution-ShareAlike 3.0 Unported License](https://creativecommons.org/licenses/by-sa/3.0/).