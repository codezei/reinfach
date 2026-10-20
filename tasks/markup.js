// const { src, dest } = require('gulp');
// const { paths, dev } = require('./settings');
// const browserSync = require('browser-sync');
// const plumber = require('gulp-plumber');
// const pug = require('gulp-pug');
// const condition = require('gulp-if');
// const pretty = require('gulp-pretty-html');

// const prettySettings = {
//   indent_size: 2,
//   indent_char: ' '
// };

// function markup() {
//   return src(`${paths.src.templates}/*.pug`)
//     .pipe(plumber())
//     .pipe(pug())
//     .pipe(condition(dev(), pretty(prettySettings)))
//     .pipe(dest(paths.build.markup))
//     .pipe(browserSync.reload({ stream: true }));
// }

// module.exports = markup;


// const { src, dest } = require('gulp');
// const { paths, dev } = require('./settings');
// const browserSync = require('browser-sync');
// const plumber = require('gulp-plumber');
// const pug = require('gulp-pug');
// const condition = require('gulp-if');
// const pretty = require('gulp-pretty-html');
// const rename = require('gulp-rename');

// const prettySettings = {
//     indent_size: 2,
//     indent_char: ' '
// };

// function markup() {
//     return src(`${paths.src.templates}/pages/*.pug`)
//         .pipe(plumber())
//         .pipe(pug())
//         .pipe(condition(dev(), pretty(prettySettings)))
//         .pipe(rename(function (path) {
//             if (path.basename !== 'index' && path.basename !== '404') {
//                 path.dirname = path.basename;
//                 path.basename = 'index';
//             }
//         }))
//         .pipe(dest(paths.build.markup))
//         .pipe(browserSync.reload({ stream: true }));
// }

// module.exports = markup;
const { src, dest } = require('gulp');
const { paths, dev } = require('./settings');
const browserSync = require('browser-sync');
const plumber = require('gulp-plumber');
const pug = require('gulp-pug');
const condition = require('gulp-if');
const pretty = require('gulp-pretty-html');
const rename = require('gulp-rename');

const prettySettings = {
    indent_size: 2,
    indent_char: ' '
};

function markup() {
    return src(`${paths.src.templates}/pages/*.pug`)
        .pipe(plumber())
        .pipe(pug())
        .pipe(condition(dev(), pretty(prettySettings)))
        .pipe(rename(function (path) {
            if (path.basename !== 'index' && path.basename !== '404') {
                if (path.basename.includes('--')) {
                    path.dirname = path.basename.split('--').join('/');
                } else {
                    path.dirname = path.basename;
                }
                path.basename = 'index';
            }
        }))
        .pipe(dest(paths.build.markup))
        .pipe(browserSync.reload({ stream: true }));
}

module.exports = markup;
