const settings = require('../settings.js');

const fs          = require('fs');
const path        = require('path');
const cheerio     = require('cheerio');
const cssbeautify = require('cssbeautify');

moveStyle( path.resolve(__dirname, "../", settings.mailchimp.templates), true)
moveStyle( path.resolve(__dirname, "../", settings.html.templates)      )

function moveStyle(templatesDir, isMailchimp) {

  fs.readdir(templatesDir, (err, templates) => {
    templates.forEach( templateName => {
      const template = path.resolve(templatesDir, templateName, templateName + ".html");
      fs.readFile(template, (err, templateContent) => {

        const templateHtml = templateContent.toString();
        const allStyles = getStyleTagsContent(templateHtml);

        const cssContent = cssbeautify(allStyles, {
          indent: '  ',
          autosemicolon: true
        });

        const $ = cheerio.load(templateHtml);

        $("style").remove();

        $("head").append(`<style>${cssContent}</style>`);

        const htmlFileName = path.resolve(templatesDir, templateName, `${templateName}.html`);

        if (isMailchimp) {
          let mcCssContent = fs.readFileSync( path.resolve(__dirname, '../build/mc-styles.css') )
          $('body').append(`\t<style> ${mcCssContent} </style>\n`);
        }

        $('html').append(`
          <style type="text/css">
            body, table, td {
              font-family: Arial, Helvetica, sans-serif !important;
            }
          </style>
        `);

        fs.writeFileSync(htmlFileName, $.html());
      });

    });
  });
}


function getStyleTagsContent(templateHtml) {
  const $ = cheerio.load(templateHtml);
  const styleTags = [].slice.call( $('style') );
  let cssContent = '';

  for (i in styleTags) {

    if (styleTags[i].children && styleTags[i].children[0]) {
      cssContent += styleTags[i].children[0].data;
    }

  }
  return cssContent;
}