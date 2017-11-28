/** Imports and constants */
//——————————————————————————————————————————————————————————————————————————
// settings from package.json
const settings = require("./settings.js");

// Node utils
const fs   = require("fs");
const path = require("path");

// Gulp && gulp tools
const gulp     = require("gulp");
const gulpif   = require('gulp-if');
const tap      = require("gulp-tap");
const zip      = require("gulp-zip");
const newer    = require("gulp-newer");
const rename   = require("gulp-rename");
const plumber  = require("gulp-plumber");
const sequence = require('gulp-sequence');

// Pre- & Post-processing tools
const pug       = require("gulp-pug");
const stylus    = require("gulp-stylus");
const cssconcat = require("gulp-concat-css");
const cssinline = require("gulp-inline-css");
const beauty    = require('gulp-html-beautify');

// Local server
const browserSync = require("browser-sync").create();

// Absolute paths to source files
const Templates = path.resolve(settings.dir.templates, "*.pug");
const pugFiles  = path.resolve(settings.dir.source, "**/*.pug");
const stylFiles = path.resolve(settings.dir.source, "**/*.styl");

// NODE ENV definition
const NODE_ENV = process.env.NODE_ENV || "development";
//——————————————————————————————————————————————————————————————————————————













/** Rendering templates */
//——————————————————————————————————————————————————————————————————————————
/** Callback for pug tasks
 * 
 * This value will be accesible as 'EmailService' global variable
 * in pug templates to render its parts separately for every service
 * @param {string} ESType - name of email service.
 * 
 * @attribute {string} html      - for plain html templates (or leave undefined)
 * @attribute {string} mailchimp - for MailChimp templates with mergetags
 * @attribute {string} shopify   - for Shopify's 'liquid' templates
 * @attribute {string} sendgrid  - for SendGrid template language
 */
const pugRender = ESType => {

  const isMailchimp = ESType === "mailchimp";

  // Setup separate destination directory for every type of template
  const destDirectory = path.resolve(settings.dir.base, ESType);

  // Options for pug with beautifier and global name of rendered email service
  let Tags = require("./source/data/tags.js")[ESType];

  // Default options for Pug
  let pugOpts = {
    pretty: true,
    data: {
      Tags,        // Placeholders for different EDS'
      ESType,      // html as default
      TplName: "", // Will be replaced with gulp-tap for every file,
      PROD: NODE_ENV === "production"
    }
  };

  let inlineCondition = NODE_ENV==="production" && ESType !== "mailchimp";

  // Render pug templates
  gulp.src(Templates)
    .pipe( plumber() )

    // Pass name of template file without extension as global variable "TplName"
    .pipe( tap(file => {pugOpts.data.TplName = path.basename(file.path, ".pug")}) )

    // Rendering templates
    .pipe( pug(pugOpts) )
    .pipe( cssinline(isMailchimp ? settings.gulp.inlineCssShopify : settings.gulp.inlineCss) )
    .pipe( beauty(settings.gulp.htmlBeautify) )

    // Write every template into separate directory (to store css and/or assets for mailchimp)
    .pipe( rename(path => {path.dirname += `/${path.basename}`}) )

    // Saving html template
    .pipe( gulp.dest(destDirectory) );

}


// Simple html
gulp.task("pug:html",      () => pugRender("html")      );

// MailChimp version
gulp.task("pug:mailchimp", () => pugRender("mailchimp") );


// All templates render (parallel). You can exclude tasks for EDS you don't need
gulp.task("pug", ["pug:html", "pug:mailchimp"]);
//——————————————————————————————————————————————————————————————————————————





gulp.task("stylus", () => {
  gulp.src(["source/styles/themes/theme-general.styl", "source/modules/**/*.styl"])
    .pipe(stylus())
    .pipe(cssconcat("styles.css"))
    .pipe(gulp.dest("./build/"));
})
  

gulp.task("mc-styles", () => {
  gulp.src([
    "source/**/mc-typography.css",
    "source/**/mc-colors.css",
    "source/**/mc-header.css",
    "source/**/mc-digest-title.css",
    "source/**/mc-person.css",
    "source/**/mc-section.css",
    "source/**/mc-buttonlink.css",
    "source/**/mc-topic.css",
    "source/**/mc-bigbutton.css",
    "source/**/mc-charts.css",
    "source/**/mc-footer.css",
  ])
  .pipe(cssconcat("mc-styles.css"))
  .pipe(gulp.dest("./build/"));
})
  






/** Zipping */
//——————————————————————————————————————————————————————————————————————————
// Create zip archives for mailchimp
gulp.task("zip:mailchimp", () => {

  const templatesDir = settings.mailchimp.templates
  const archivesDir  = path.resolve(templatesDir, "zip");
  
  fs.readdir(templatesDir, (err, dirs) => {
    if (err) console.error(err);

    // Going through array of templates
    dirs.forEach( templateName => {

      let templateFiles = path.resolve(templatesDir, templateName, '*');

      gulp.src(templateFiles)
        .pipe( zip(`${templateName}.zip`) )
        .pipe( gulp.dest(archivesDir) );

    });

  });

});

gulp.task("zip", ["zip:mailchimp"], () => {
  gulp.src("./build/**/*")
    .pipe( zip(`Email-Templates__(build-${ require("./package.json").version }).zip`) )
    .pipe( gulp.dest("./") );
});
//——————————————————————————————————————————————————————————————————————————










/** Serving */
//——————————————————————————————————————————————————————————————————————————
// Local server testing
gulp.task("pug-watch", ["pug"], (done) => {
    browserSync.reload();
    done();
});

gulp.task("server", () => {
  browserSync.init(settings.gulp.browserSync);
});

gulp.task("watch", () => {

  if (NODE_ENV === "production") {
    gulp.watch([stylFiles, pugFiles], ["pug"]);
  } else {
    gulp.watch([stylFiles], ["stylus"]);
    gulp.watch([pugFiles],  ["pug"]   );
  }
  
})
//——————————————————————————————————————————————————————————————————————————










/** Commands */
//——————————————————————————————————————————————————————————————————————————
// Build
if (NODE_ENV === "production") {
  gulp.task("build", ["pug", "mc-styles"]);
} else {
  gulp.task("build", ["pug", "stylus"]);
}

// Default task
gulp.task("default", ["build"]);
//——————————————————————————————————————————————————————————————————————————