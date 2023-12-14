const { src, dest, series } = require('gulp');
var del = require('del'); // 需要安装6版本的del模块 npm install --save-dev del@6

// 清除django项目下的watermark的静态文件
function cleanStatic() {
    return del([
        'D:/test/django_site/watermark/static/watermark/_next/**/*'
    ], { force: true });
}

// 清除django项目下的watermark模板文件
function cleanTemplates() {
    return del([
        'D:/test/django_site/watermark/templates/watermark/**/*'
    ], { force: true });
}

// 复制out目录下的_next文件夹到django项目watermark应用静态文件夹里
function copyStatic() {
    return src('D:/test/watermark/out/_next/**/*')
        .pipe(dest('D:/test/django_site/watermark/static/watermark/_next/'));
}

// 复制out目录下的文件到django项目watermark应用的模板文件夹里
function copyTemplates() {
    return src('D:/test/watermark/out/*.*')
        .pipe(dest('D:/test/django_site/watermark/templates/watermark/'))
}

function defaultTask(cb) {
    // place code for your default task here
    cb();
}
 
exports.cleanStatic = cleanStatic; 
exports.cleanTemplates = cleanTemplates; 
exports.copyStatic = copyStatic;
exports.copyTemplates = copyTemplates;
exports.cleanAndCopy = series(cleanStatic, cleanTemplates, copyStatic, copyTemplates);
exports.default = defaultTask;