'use strict'

module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            //定义用于检测的文件
        //  files: ['gruntfile.js', 'server.js', 'app/**/*.js', 'public/phone/**/*.js'],
            files: ['gruntfile.js', 'server.js', 'app/**/*.js'],
            options: {
                laxcomma: true,     // 允许逗号开头的代码风格
                shadow: true,       // 允许变量在任何范围重复定义
                asi: true,          // 无需在每个结尾增加分号
                strict: true,       // 严格模式
                node: true,         // 与node适应
                newcap: false,      // 取消这条限制：大写开头的函数视为类构造函数，必须加new 
                quotmark: true,     // 不允许混合使用单引号和双引号
            }
        },

        // nodemon模块可以代替watch的一些功能。
        nodemon: {
            dev: {
                script: 'server.js',
                options: {
 //                   ignore: ['ui-user/**', 'node_modules/**'],
                    files: '**/*.js',
                    watch: ['ws', 'zjs'],
                }
            },
        }
    });

    grunt.option('force', true);

    //grunt.loadNpmTasks('grunt-contrib-uglify');
    //grunt.loadNpmTasks('grunt-contrib-jshint');
    //grunt.loadNpmTasks('grunt-contrib-watch');
    //grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-nodemon');

    grunt.registerTask('default', ['nodemon']);
};
