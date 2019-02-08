
# Open Distro Website

Open distro wbesite

To start development

* Make sure Ruby and Gem is install
* `bundle install`
* `bundle exec jekyll serve` <- this will start the server.

Structure
```
├── 404.html
├── Gemfile
├── Gemfile.lock
├── README.md
├── _config.yml
├── _data # All static content should be placed here and not in _config file
│   ├── communities
│   ├── es_community.yml
│   └── pages
├── _includes # Create Common components here and use it into layout
│   ├── communities
│   ├── footer.html
│   ├── full-width-content.html
│   ├── head.html
│   ├── header.html
│   ├── hero.html
│   └── text-content.html
├── _layouts # Page layouts
│   ├── default.html
│   ├── features.html
│   └── home.html
├── _sass
│   ├── _bootstrap_customization.scss # overrides any bootstrap CSS.
│   ├── _syntax-highlighting.scss
│   ├── _variables.scss
│   ├── bootstrap #Row bootstrap no need to touch
│   └── bootstrap-4-jekyll # This and any websitesite theme specific scss here.
├── about.md #Pages
├── assets
│   ├── javascript
│   ├── main.scss
│   └── media
├── contribute.md
├── deploy.md
├── features.md
└── index.md
```

For any more documentations please visit https://jekyllrb.com/
