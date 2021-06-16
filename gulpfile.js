const { src, dest, watch, series, parallel } = require('gulp');
const scss = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const browsersync = require('browser-sync').create();
const group_media = require('gulp-group-css-media-queries');
const fileInclude = require('gulp-file-include');
const uglify = require('gulp-uglify-es').default;
const babel = require('gulp-babel');
const del = require('del');
const ttf2woff = require('gulp-ttf2woff');
const ttf2woff2 = require('gulp-ttf2woff2');
const imagemin = require("gulp-imagemin");
const webp = require('gulp-webp');
const webphtml = require('gulp-webp-html');
const webpcss = require('gulp-webpcss');
const fonter = require('gulp-fonter');
const cssmin = require('gulp-cssmin');
let fs = require('fs');


function browserSync() {
	browsersync.init({
		server: {
			baseDir: 'dist/'
		},
		port: 3000,
		notify: false
	});
}


function html() {
	return src(['app/**/*.html', '!app/**/_*.html'])
		.pipe(fileInclude())
		.pipe(webphtml())
		.pipe(dest('dist/'))
		.pipe(browsersync.stream())
}


function styles() {
	return src('app/scss/style.scss')
		.pipe(scss({
			outputStyle: 'expanded'
		}))
		.pipe(group_media())
		.pipe(autoprefixer({
			overrideBrowserslist: ['last 5 version'],
			cascade: false,
			grid: true
		}))
		.pipe(webpcss())
		.pipe(dest('dist/css/'))
		.pipe(scss({
			outputStyle: 'compressed'
		}))
		.pipe(concat('style.min.css'))
		.pipe(dest('dist/css/'))
		.pipe(browsersync.stream())
}

function scripts() {
	return src('app/js/script.js')
		.pipe(fileInclude())
		.pipe(babel({
			presets: ['@babel/env']
		}))
		.pipe(dest('dist/js/'))
		.pipe(uglify())
		.pipe(concat('script.min.js'))
		.pipe(dest('dist/js/'))
		.pipe(browsersync.stream())
}

function stylesLibs() {
	return src([
		'node_modules/normalize.css/normalize.css',
		'node_modules/@fancyapps/fancybox/dist/jquery.fancybox.css',
		'node_modules/slick-carousel/slick/slick.css',
	])
		.pipe(autoprefixer({
			overrideBrowserslist: ['last 5 version'],
			cascade: false,
			grid: true
		}))
		.pipe(concat('libs.min.css'))
		.pipe(cssmin())
		.pipe(dest('dist/css/'))
		.pipe(browsersync.stream())
}

function scriptsLibs() {
	return src([
		'node_modules/jquery/dist/jquery.js',
		'node_modules/@fancyapps/fancybox/dist/jquery.fancybox.js',
		'node_modules/slick-carousel/slick/slick.js',
	])
		.pipe(uglify())
		.pipe(concat('libs.min.js'))
		.pipe(dest('dist/js/'))
		.pipe(browsersync.stream())
}

function images() {
	return src('app/img/**/*.{jpg,png,svg,gif,ico,webp}')
		.pipe(webp({
			quality: 70
		}))
		.pipe(dest('dist/img/'))
		.pipe(src('app/img/**/*.{jpg,png,svg,gif,ico,webp}'))
		.pipe(
			imagemin({
				progressive: true,
				svgoPlugins: [{ removeViewBox: false }],
				interlaced: true,
				optimizationLevel: 3 // 0 to 7
			})
		)
		.pipe(dest('dist/img/'))
		.pipe(browsersync.stream())
}

function watching() {
	watch(['app/scss/**/*.scss'], styles);
	watch(['app/**/*.html'], html);
	watch(['app/js/**/*.js'], scripts);
	watch(['app/img/**/*.{jpg,png,svg,gif,ico,webp}'], images);
}

function clear() {
	return del('dist/');
}

function fonts() {
	src('app/fonts/*.ttf')
		.pipe(ttf2woff())
		.pipe(dest('dist/fonts/'));
	return src('app/fonts/*.ttf')
		.pipe(ttf2woff2())
		.pipe(dest('dist/fonts/'));
};

function otf2ttf() {
	return src(['app/fonts/*.otf'])
		.pipe(fonter({
			formats: ['ttf']
		}))
		.pipe(dest('app/fonts/'))
}

function fontsStyle(params) {
	let file_content = fs.readFileSync('app/scss/_fonts.scss');
	if (file_content == '') {
		fs.writeFile('app/scss/_fonts.scss', '', cb);
		return fs.readdir('dist/fonts/', function (err, items) {
			if (items) {
				let c_fontname;
				for (var i = 0; i < items.length; i++) {
					let fontname = items[i].split('.');
					fontname = fontname[0];
					if (c_fontname != fontname) {
						fs.appendFile('app/scss/_fonts.scss', '@include font("' + fontname + '", "' + fontname + '", "400", "normal");\r\n', cb);
					}
					c_fontname = fontname;
				}
			}
		})
	}
}

function cb() {

}

exports.fontsStyle = fontsStyle;
exports.fonts = fonts;
exports.otf2ttf = otf2ttf;
exports.images = images;
exports.html = html;
exports.styles = styles;
exports.stylesLibs = stylesLibs;
exports.scripts = scripts;
exports.scriptsLibs = scriptsLibs;
exports.watching = watching;
exports.browserSync = browserSync;
exports.clear = clear;


exports.default = series(clear, stylesLibs, scriptsLibs, styles, html, scripts, images, fonts, parallel(watching, browserSync));