const { src, dest } = require('gulp');
const { paths, dev } = require('./settings');
const plumber = require('gulp-plumber');
const condition = require('gulp-if');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('autoprefixer');
const csso = require('gulp-csso');
const rename = require('gulp-rename');
const browserSync = require('browser-sync');
const postcss = require('gulp-postcss');
const mqpacker = require('css-mqpacker');

const renameSettings = {
    suffix: '.min'
};

const processors = [
    autoprefixer({
        cascade: false
    }),
    mqpacker({
        sort: function (a, b) {
            a = a.replace(/\D/g, "");
            b = b.replace(/\D/g, "");
            return a - b;
        }
    })
];

function compileStyles() {
    return src([
        `${paths.src.styles}/main.scss`,
        `${paths.src.styles}/libs/*.scss`
    ], { base: paths.src.styles })
        .pipe(plumber())
        .pipe(condition(dev(), sourcemaps.init()))
        .pipe(sass({ includePaths: ['node_modules/'] }).on('error', sass.logError))
        .pipe(postcss(processors))
        .pipe(csso())
        .pipe(condition(dev(), sourcemaps.write()))
        .pipe(rename(renameSettings))
        .pipe(dest(paths.build.styles))
        .pipe(browserSync.reload({ stream: true }));
}

module.exports = compileStyles;
