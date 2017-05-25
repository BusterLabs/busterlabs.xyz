const path = require('path');
const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const browserify = require('browserify');
const watchify = require('watchify');
const babelify = require('babelify');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const transform = require('vinyl-transform');
const sass = require('gulp-sass');
const mqpacker = require('css-mqpacker');
const csswring = require('csswring');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');


const src = {
    js: [
        path.resolve(__dirname, 'src/js/home/index.js'),
    ],
    scss: [
        path.resolve(__dirname, 'src/scss/home/main.scss'),
    ],
};

const dist = {
    js: path.resolve(__dirname, 'js/'),
    scss: path.resolve(__dirname, 'css/'),
};

gulp.task('watch', () => {
    var bundlers = {};
    src.js.forEach((entryPath) => {
        const name = entryPath.split('js/').pop().split('/')[0];
        bundlers[name] = watchify(browserify({
            entries: entryPath,
            cache: {},
            packageCache: {},
            paths: ['./node_modules','./src/js/'],
            plugin: [watchify]
        }).transform(babelify));
    })

    const rebundle = (pathname) => {
        const name = pathname.split('js/').pop().split('/')[0];
        console.log(`## Building js: ${name}`);
        bundlers[name].bundle()
            .on('error', (err) => {
                console.error(`ERROR: ${err.toString()}`);
            })
            .pipe(source(`${name}.js`))
            .pipe(buffer())
            .pipe(sourcemaps.init({
                loadMaps: true
            }))
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(dist.js));
    }

    Object.keys(bundlers).forEach((bundlerName) => {
        var bundler = bundlers[bundlerName];
        bundler.on('update', () => rebundle(bundlerName));
        rebundle(bundlerName)
    })

    gulp.watch(src.scss)
        .on('change', (evt) => {
            const name = evt.path.split('scss/').pop().split('/')[0];
            console.log(`## Building CSS: ${name}`);
            return gulp.src(evt.path)
                .pipe(sass())
                .pipe(rename(`${name}.css`))
                .pipe(gulp.dest(dist.scss));
        });
});

gulp.task('build_js', () => {
    return src.js.forEach((entryPath) => {
        const name = entryPath.split('js/').pop().split('/')[0];
        console.log(`## Building JS: ${name}`);
        return browserify({
                entries: entryPath,
                transform: ['babelify'],
                extensions: ['.js'],
                paths: ['./node_modules','./src/js/'],
                debug: false,
                ignoreMissing: true,
            }).bundle()
            .pipe(source(`${name}.js`))
            .pipe(buffer())
            .pipe(uglify())
            .pipe(gulp.dest(dist.js));
    })
});

gulp.task('build_css', function() {
    const processors = [
        autoprefixer({
            browsers: ['> 5%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1']
        }),
        mqpacker,
        csswring({
            removeAllComments: true
        })
    ];
    return src.scss.forEach((entryPath) => {
        const name = entryPath.split('scss/').pop().split('/')[0];
        console.log(`## Building CSS: ${name}`);
        return gulp.src(entryPath)
            .pipe(sass({
                errLogToConsole: true,
                sourceComments: false,
            }))
            .pipe(postcss(processors))
            .pipe(rename(`${name}.css`))
            .pipe(gulp.dest(dist.scss));
    })
});

gulp.task('build', ['build_css', 'build_js']);

gulp.task('default', ['watch']);
