const settings = require('../settings.js');

const fs          = require('fs');
const path        = require('path');
const cheerio     = require('cheerio');
const cssbeautify = require('cssbeautify');

extractCss( "mailchimp", path.resolve(__dirname, "../", settings.mailchimp.templates) );
// extractCss( "html",      path.resolve(__dirname, "../", settings.html.templates)      );


/** Extract styles from <style> tag and write to separate css file
 * 
 * @param {string} templatesDir - absolute path to directory with template folders, containig .html file 
 */
function extractCss(Type, templatesDir) {
  fs.readdir(templatesDir, (err, templates) => {

    templates.forEach( templateName => {

      // Path to template's html file
      const template = path.resolve(templatesDir, templateName, templateName + ".html");

      fs.readFile(template, (err, templateContent) => {
        if (err) console.error(err);

        const templateHtml = templateContent.toString();

        // Generate css file
        createCss(templateHtml, templateName, templatesDir);

        // Overwrite html file
        createHtml(templateHtml, templateName, templatesDir, Type);

      });

    });

  });
}


/** Get css from style tags
 * 
 * @param {string} templateHtml - template's html content
 * 
 * @return {string} cssContent - string with css styles
 */
function getStyleTagsContent(templateHtml) {

  // Create Cheerio instance
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


/** Creates new css file from style tags in html string
 * 
 * @param {string} templateHTML - template's html content
 * @param {string} templateName - template's name
 * @param {string} destination  - path where to save new css file
 */
function createCss(templateHtml, templateName, destination) {
  
  // Get css content from style tags
  const StyleTagsContent = getStyleTagsContent(templateHtml);

  // Get new css absolute path
  const cssFileName = path.resolve(destination, templateName, `${templateName}.css`);

  // Beautify css (fix indents and comments)
  const cssContent = cssbeautify(StyleTagsContent, {
    indent: '  ',
    autosemicolon: true
  });

  // Create new css file
  fs.writeFileSync(cssFileName, cssContent);

}


/** Creates new html without style tags
 * 
 * @param {string} templateHTML - template's html content
 * @param {string} templateName - template's name
 * @param {string} destination  - path where to save new css file
 */
function createHtml(templateHtml, templateName, destination, Type) {

  // Create Cheerio instance from template's html
  const $ = cheerio.load(templateHtml);

  // Get new html absolute path
  const htmlFileName = path.resolve(destination, templateName, `${templateName}.html`);

  // Remove style tags
  // $('style').remove();

  // if (Type === "mailchimp") {
  //   let mcCssContent = fs.readFileSync( path.resolve(__dirname, '../build/mc-styles.css') )
  //   $('body').append(`\t<style> ${mcCssContent} </style>\n`);
  //   fs.writeFileSync(htmlFileName, $.html());
  // }
}