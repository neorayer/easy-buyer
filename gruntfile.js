'use strict'

module.exports = function(grunt) {

    grunt.initConfig({
        concurrent: {
            dev: {
                tasks: ['nodemon'],
                options: {
                    logConcurrentOutput: true,
                }
            }
        },
        nodemon: {
            dev: {
                script: 'server.js',
                options: {
                    watch: ['ws', 'zjs', 'gruntfile.js', 'server.js'],
                    delay: 300,
                },
            },
        },
    });

    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-concurrent');

    grunt.registerTask('default', ['concurrent']);
};
