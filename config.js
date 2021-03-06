'use strict';

module.exports = function (paths) {
  var path = require('path');
  var utilities = require('./utilities');

  var dest;
  switch (utilities.env.getEnv()) {
    case 'development':
    case 'test':
    case 'staging': {
      dest = paths.build;
      break;
    }
    case 'production': {
      dest = paths.dist;
      break;
    }
  }

  // Configuration for each task
  var configuration = {
  assets: {
    src: path.join(paths.src, paths.assets, '**/*'),
    imagesFilter: path.join(paths.assets_images, '**/*'),
    imagemin: {optimizationLevel: 5, progressive: true, interlaced: true},
    dest: path.join(dest, paths.assets)
  },
  browserify: {
    app: {
      browserify: {
        cache: {}, packageCache: {}, fullPaths: true,
        entries: ['./' + path.join(paths.src, paths.scripts, paths.scripts_app, paths.scripts_app_entry)],
        debug: true
      },
      output: paths.scripts_app_output,
      dest: dest
    },

    vendors: {
      browserify: {
        cache: {}, packageCache: {}, fullPaths: true,
        entries: ['./' + path.join(paths.src, paths.scripts, paths.scripts_app, paths.scripts_app_vendors)]
      },
      output: paths.scripts_vendors_output,
      dest: dest
    }
  },
  clean: {
    src: [
      path.join(dest, '**/*'),
      path.join(paths.tmp, '**/*')
    ]
  },
  config: {
    src: path.join(paths.src, paths.scripts, paths.scripts_config),
    rename: {
      basename: paths.tmp_config_output
    },
    ngConstant: {
      name: paths.tmp_config_module,
      constants: utilities.config.getConstants(),
      wrap: 'commonjs'
    },
    dest: paths.tmp
  },
  index: {
    src: path.join(paths.src, paths.scripts, paths.scripts_index),
    injectSrc: [
    path.join(dest, paths.scripts_vendors_output_partial + '.js'),
    path.join(dest, paths.scripts_app_output_partial + '.{css,js}')
  ],
    inject: {
      ignorePath: path.join(dest),
      addRootSlash: false
    },
    jade: {},
    dest: dest
  },
  lint: {
    src: path.join(paths.src, '**/*.js')
  },
  serve: {
    browserSync: {
      server: {baseDir: dest, middleware: [require('connect-history-api-fallback')]},
      open: false,
      ghostMode: false,
      port: 3001
    }
  },
  styles: {
    src: path.join(paths.src, paths.styles, paths.styles_main),
    basename: paths.styles_output,
    autoprefixer: {browsers: ['last 2 versions']},
    sass: {
      sourcemap: utilities.env.isDev(),
      style: 'compressed'
    },
    dest: dest
  },
  templates: {
    src: [path.join(paths.src, paths.scripts, '**/**/*.jade'), path.join(paths.src, paths.scripts, '**/**/*.html')],
    jade: {},
    templateCache: {
      filename: paths.tmp_templates_output,
      options: {
        moduleSystem: 'Browserify',
        standalone: true,
        module: paths.tmp_templates_module,
        base: function (file) {
          var customFn = paths.template_name_fn;
          if (typeof (customFn) === 'function') {
            return customFn(file);
          } else {
            return path.basename(file.relative);
          }
        }
      }
    },
    dest: paths.tmp
  },
  watch: {
    lint: path.join(paths.src, paths.scripts, paths.scripts_app, '**/*.js'),
    index: path.join(paths.src, paths.scripts, paths.scripts_index),
    config: path.join(paths.src, paths.scripts, paths.scripts_config),
    templates: [path.join(paths.src, paths.scripts, '**/*.jade'), path.join(paths.src, paths.scripts, '**/**/*.html')],
    styles: path.join(paths.src, paths.styles, '**/*.scss'),
    styles_output: paths.styles_output + '.min.css',
    reload: path.join(dest, '**/*.{js,html}'),
    assets: path.join(paths.src, paths.assets, '**/**/*')
  }
};

  return configuration;
};
