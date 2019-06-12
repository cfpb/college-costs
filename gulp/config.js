const pkgjson = require( '../package.json' );
const globAll = require( 'glob-all' );

/**
 * Set up file paths
 */
const loc = {
  src:  './src/disclosures',
  dist: './paying_for_college/static/paying_for_college/disclosures',
  modules: './node_modules',
  test: './test'
};

module.exports = {
  pkg: pkgjson,
  banner:
      '/*!\n' +
      ' *  <%= pkg.name %> - v<%= pkg.version %>\n' +
      ' *  <%= pkg.homepage %>\n' +
      ' *  Licensed <%= pkg.license %> by Consumer Financial Protection Bureau' +
      ' */',
  lint: {
    src: [
      loc.src + '/js/**/*.js',
      '!' + loc.src + '/js/utils/nemo.js',
      '!' + loc.src + '/js/libs/google-cloud-print.js',
      '!' + loc.src + '/js/libs/sticky-kit.js'
    ],
    gulp: [
      'gulpfile.js',
      'gulp/**/*.js'
    ]
  },
  test: {
    src:   loc.src + '/static/js/**/*.js',
    tests: loc.test
  },
  clean: {
    dest: loc.dist
  },
  styles: {
    cwd:      loc.src + '/css',
    src:      '/main.less',
    dest:     loc.dist + '/static/css',
    settings: {
      paths:  globAll.sync( [
        loc.modules + '/cf-*/**'
      ] ),
      compress: true
    }
  },
  scripts: {
    entrypoint: loc.src + '/js/index.js',
    src: [
      loc.modules + '/jquery/dist/jquery.js',
      loc.modules + '/jquery.easing/js/jquery.easing.js',
      loc.modules + '/capital-framework/**/*.js',
      '!' + loc.modules + '/capital-framework/**/*.min.js',
      loc.src + '/js/**/*.js'
    ],
    dest: loc.dist + '/static/js/',
    name: 'main.js'
  },
  browserify: {
    paths: {
      scripts: 'src/disclosures/js/index.js',
      dest: 'dist/scripts/'
    }
  },
  images: {
    src:  loc.src + '/img/**',
    dest: loc.dist + '/static/img'
  },
  templates: {
    src: './paying_for_college/templates/**'
  },
  copy: {
    files: {
      src: [
        loc.src + '/**/*.html',
        loc.src + '/**/*.pdf',
        loc.src + '/_*/**/*',
        '!' + loc.modules + '/**/*.html'
      ],
      dest: loc.dist
    },
    libjs: {
      src: loc.modules + '/sticky-kit/dist/sticky-kit.js',
      dest: 'src/disclosures/js/libs/'
    },
    vendorjs: {
      src: [
        loc.modules + '/html5shiv/dist/html5shiv-printshiv.min.js'
      ],
      dest: loc.dist + '/static/js/'
    }
  }
};
