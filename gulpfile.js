const {src, dest, series, watch} = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const sourcemaps = require("gulp-sourcemaps");
const concat = require("gulp-concat");
const htmlmin = require("gulp-htmlmin");
const autoprefixer = require("gulp-autoprefixer");
const cleanCSS = require("gulp-clean-css");
const image = require("gulp-image");
const uglify = require("gulp-uglify-es").default;
const babel = require("gulp-babel");
const notify = require("gulp-notify");
const del = require("del");
const browserSync = require("browser-sync").create();

function clean() {
  return del(["dist"]);
}

function cleanDev() {
  return del(["distDev"]);
}

function buildStyles() {
  return src("src/styles/*.scss")
  .pipe(sass({outputStyle: "compressed"}).on("error", sass.logError))
  .pipe(cleanCSS({
    level: 2
  }))
  .pipe(autoprefixer({
    cascade: false
  }))
  .pipe(dest("dist/styles"));
}

function buildStylesDev() {
  return src("src/styles/*.scss")
  .pipe(sourcemaps.init())
  .pipe(sass().on("error", sass.logError))
  .pipe(cleanCSS({
    level: 2
  }))
  .pipe(autoprefixer({
    cascade: false
  }))
  .pipe(sourcemaps.write())
  .pipe(dest("distDev/styles"))
  .pipe(browserSync.stream());
}

function buildScripts() {
  return src("src/scripts/**/*.js")
  .pipe(concat("script.js"))
  .pipe(babel({
    presets: ["@babel/env"]
  }))
  .pipe(uglify({
    toplevel: true
  }).on("error", notify.onError()))
  .pipe(dest("dist/scripts"));
}

function buildScriptsDev() {
  return src("src/scripts/**/*.js")
  .pipe(sourcemaps.init())
  .pipe(concat("script.js"))
  .pipe(babel({
    presets: ["@babel/env"]
  }))
  .pipe(sourcemaps.write())
  .pipe(dest("distDev/scripts"))
  .pipe(browserSync.stream());
}

function buildLayout() {
  return src("src/layout/**/*.html", {
    ignore: ["src/layout/index.html"]
  })
  .pipe(htmlmin({
    collapseWhitespace: true
  }))
  .pipe(dest("dist/pages"));
}

function buildLayoutDev() {
  return src("src/layout/**/*.html", {
    ignore: ["src/layout/index.html"]
  })
  .pipe(htmlmin({
    collapseWhitespace: true
  }))
  .pipe(dest("distDev/pages"))
  .pipe(browserSync.stream());
}

function buildIndexHTML() {
  return src("src/layout/index.html")
  .pipe(htmlmin({
    collapseWhitespace: true
  }))
  .pipe(dest("dist"));
}

function buildIndexHTMLDev() {
  return src("src/layout/index.html")
  .pipe(htmlmin({
    collapseWhitespace: true
  }))
  .pipe(dest("distDev"))
  .pipe(browserSync.stream());
}

function buildImages() {
  return src([
    "src/images/**/*.jpg",
    "src/images/**/*.png",
    "src/images/**/*.jpeg",
    "src/images/**/*.svg"
  ])
  .pipe(image())
  .pipe(dest("dist/images"));
}

function buildImagesDev() {
  return src([
    "src/images/**/*.jpg",
    "src/images/**/*.png",
    "src/images/**/*.jpeg",
    "src/images/**/*.svg"
  ])
  .pipe(image())
  .pipe(dest("distDev/images"))
  .pipe(browserSync.stream());
}

function buildForeignStyles() {
  return src("sources/styles/**/*.css")
  .pipe(dest("dist/styles"));
}

function buildForeignStylesDev() {
  return src("sources/styles/**/*.css")
  .pipe(dest("distDev/styles"))
  .pipe(browserSync.stream());
}

function serverInitDev() {
  browserSync.init({
    server: {
      baseDir: "distDev"
    }
  });
}

watch("src/layout/index.html", buildIndexHTMLDev);
watch("src/layout/**/*.html", {
  ignored: "src/layout/index.html"
}, buildLayoutDev);
watch("src/styles/**/*.scss", buildStylesDev);
watch("src/scripts/**/*.js", buildScriptsDev);
watch([
  "src/images/**/*.png",
  "src/images/**/*.jpg",
  "src/images/**/*.jpeg",
  "src/images/**/*.svg"
], buildImagesDev);
watch("sources/styles/**/*.css", buildForeignStylesDev);

exports.clean = clean;
exports.cleanDev = cleanDev;
exports.buildStyles = buildStyles;
exports.buildStylesDev = buildStylesDev;
exports.buildScripts = buildScripts;
exports.buildScriptsDev = buildScriptsDev;
exports.buildLayout = series(buildLayout, buildIndexHTML);
exports.buildLayoutDev = series(buildLayoutDev, buildIndexHTMLDev);
exports.buildImages = buildImages;
exports.buildImagesDev = buildImagesDev;
exports.buildForeignStyles = buildForeignStyles;
exports.buildForeignStylesDev = buildForeignStylesDev;
exports.default = series(cleanDev, buildImagesDev, buildLayoutDev, buildIndexHTMLDev, buildForeignStylesDev, buildStylesDev, buildScriptsDev, serverInitDev);
exports.buildProd = series(clean, buildImages, buildLayout, buildIndexHTML, buildForeignStyles, buildStyles, buildScripts);