const { src, dest } = require('gulp');
const { paths } = require('./settings');

function copyRootFiles() {
    return src(
        [
            'src/*.*',
            'src/.htaccess'
        ],
        {
            allowEmpty: true,
            nodir: true
        }
    )
        .pipe(dest(paths.build.main));
}

module.exports = copyRootFiles;
