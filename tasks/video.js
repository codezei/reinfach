const { src, dest } = require('gulp');
const { paths } = require('./settings');
const browserSync = require('browser-sync');

function image() {
  return src(paths.src.video)
    .pipe(dest(paths.build.video))
    .pipe(browserSync.reload({ stream: true }));
}

module.exports = image;
