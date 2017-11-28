module.exports = {

  // Email adresses for testing
  adresses: [
    "caspian.seagull@gmail.com",
    // "yasyukyura@gmail.com"
  ],



  // Path setings
  dir: {
    base:      "./build",

    source:    "./source",
    modules:   "./source/modules",

    markup:    "./source/markup",
    templates: "./source/templates",

    styles:    "./source/styles",
    themes:    "./source/styles/themes",
  },



  // Settings for nodemailer
  nodemailer: {
    transporter: {
      service: "gmail",

      auth: {
        user: "caspian.seagull@gmail.com",
        pass: "RDanielOlivo"
      }
    }
  },



  // Html settings
  html: {
    templates: "./build/html/",
  },


  // Mailchimp settings
  mailchimp: {
    templates: "./build/mailchimp/",
  },


  // Shopify settings
  shopify: {
    templates: "./build/shopify/",
  },


  // Shopify settings
  assets: "./source/assets/",



  // Settings for gulp plugins
  gulp: {

    // gulp-inline-css
    inlineCss: {
      applyStyleTags:       true,
      removeStyleTags:      true,
      applyLinkTags:        true,
      removeLinkTags:       true,
      applyWidthAttributes: true,
      applyTableAttributes: true,
      preserveMediaQueries: true,
      removeHtmlSelectors:  false,
    },


    inlineCssShopify: {
      applyStyleTags:       true,
      removeStyleTags:      false,
      applyLinkTags:        true,
      removeLinkTags:       false,
      applyWidthAttributes: true,
      applyTableAttributes: true,
      preserveMediaQueries: true,
      removeHtmlSelectors:  false,
    },


    // gulp-html-beautify
    htmlBeautify: {
      indent_size:           2,
      indent_level:          0,
      indent_char:           " ",
      indent_with_tabs:      false,
      eol:                   "\n",
      preserve_newlines:     true,
      end_with_newline:      false,
      max_preserve_newlines: 10,
      wrap_attributes:       "auto",
      wrap_attributes_indent_size: 2,
    },
    

    // browser-sync
    browserSync: {
      port: 3000,
      open: "external",
      server: {
        baseDir: "./build",
        directory: true,
      }
    }

  }
  
};