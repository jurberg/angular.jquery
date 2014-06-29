module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      all: ['Gruntfile.js', 'src/*.js', 'src/**/*.js', 'spec/**/*.js']
    },
    jasmine: {
      src: [
        'src/module.js',
        'src/**/*.js'
      ],
      options: {
        specs: 'spec/**/*.spec.js',
        vendor: [
          'lib/jquery-1.8.3.js',
          'lib/jquery-ui.js',
          'lib/angular.js',
          'lib/angular-mocks.js'
        ]
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.repository.url %> <%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: [
            'src/module.js',
            'src/jqdialog/jqdialog.js'
        ],
        dest: 'dist/angular.jquery.min.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('test', ['jshint', 'jasmine']);
  grunt.registerTask('default', ['jshint', 'jasmine', 'uglify']);

};
