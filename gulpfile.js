var syntax        = 'scss';     /*Для scss*/

var gulp         = require('gulp'),
    sass         = require('gulp-sass'),
    browserSync  = require('browser-sync'),
    concat       = require('gulp-concat'),
    uglify       = require('gulp-uglifyjs'), /*хз зачем подключали*/
    cssnano      = require('gulp-cssnano'),
    rename       = require('gulp-rename'),
    del          = require('del'),
    imagemin     = require('gulp-imagemin'),
    pngquant     = require('imagemin-pngquant'), /*c гемором установился*/
    cache        = require('gulp-cache'),
    notify       = require("gulp-notify"),       /*для scss*/
    autoprefixer = require('gulp-autoprefixer');

gulp.task('sass', function () {
    return gulp.src('app/'+syntax+'/**/*.'+syntax+'')
        .pipe(sass({ outputStyle: 'expanded' }).on("error", notify.onError()))
        .pipe(autoprefixer (['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true}))
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({stream: true}))
});

gulp.task('scripts', function () {
    return gulp.src([
       'app/libs/jquery/dist/jquery.min.js',
        'app/libs/magnific-popup/dist/jquery.magnific-popup.min.js',
    ])
    .pipe(concat('libs.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('app/js'));
});

gulp.task('css-libs', ['sass'], function () {
    return gulp.src('app/css/libs.css')
        .pipe(cssnano())
        .pipe(rename({suffix:'.min'}))
        .pipe(gulp.dest('app/css'));
});

gulp.task('css', ['sass'], function () {
    return gulp.src('app/css/*.css')
        .pipe(cssnano())                        /*Запускать перед build*/
        .pipe(rename({suffix:'.min'}))
        .pipe(gulp.dest('app/css'));
});

gulp.task('browser-sync', function () {
    browserSync({
        server: {
            baseDir: 'app'
        },
        notify: false
    })
});

gulp.task('clean', function () {
    return del.sync('dist');              /*удаление папки dist*/
});

gulp.task('img',function () {
    return gulp.src('app/img/**/*')
        .pipe(cache(imagemin({
            inerlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            une: [pngquant()]
        })))
        .pipe(gulp.dest('dist/img'));
});

gulp.task('watch',['browser-sync', 'css-libs', 'scripts'], function () {
    gulp.watch('app/'+syntax+'/**/*.'+syntax+'', ['sass']);
    gulp.watch('app/*.html', browserSync.reload);
    gulp.watch('app/js/**/*.js', browserSync.reload);
});

gulp.task('build', ['clean', 'img', 'sass', 'scripts'], function () {

    var buildCss = gulp.src([
        /*'app/css/main.css',
        'app/css/libs.min.css',*/
        'app/css/*.min.css'
    ])
        .pipe(gulp.dest('dist/css'));

    var buildFonts = gulp.src('app/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'));

    var buildJs = gulp.src('app/js/**/*')
        .pipe(gulp.dest('dist/js'));

    var buildhtml = gulp.src('app/*.html')
        .pipe(gulp.dest('dist'));
});

gulp.task('clear', function () {
    return cache.clearAll();       /*Если будут проблемы с изображениями, нужно почистить кеш*/
});

gulp.task('default', ['watch']);