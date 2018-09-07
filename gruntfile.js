// Wrapper 函数，注入 grunt 对象
module.exports = function(grunt){
    // 初始化配置
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        // Concat 任务
        concat: {
            // 合并foo任务
            foo: {
                // 对象形式，key是输出文件，value是源文件数组
                files: {
                    'dest/bundle.js': ['grunt-and-gulp-example/add.js', 'grunt-and-gulp-example/main.js']
                }
                // 数组方式，需要声明src，dest属性
                // files: [
                //     {src: ['grunt-and-gulp-example/add.js', 'grunt-and-gulp-example/main.js'], dest: 'dest/bundle.js'}
                //     {src: ['grunt-and-gulp-example/add.js', 'grunt-and-gulp-example/main.js'], dest: 'dest/boundle/'}
                // ]
            },
        },
        // Uglify 任务
        uglify: {
            // build: {
            //     src: 'dest/bundle.js',
            //     dest: 'dest/bundle.min.js'
            // },
            options: {
                // 不混淆
                mangle: false,
                report: "gzip",
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */'
            },
            // 子任务 bundle
            bundle: {
                files: {
                    'dest/bundle.min.js': ['grunt-and-gulp-example/add.js', 'grunt-and-gulp-example/main.js']
                }
            }
        },
        // 挂载default任务
    });
    // 加载任务
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    // 自定义任务
    // grunt.registerTask('default', ['concat', 'uglify']);
    grunt.registerTask('default', ['uglify']);
}