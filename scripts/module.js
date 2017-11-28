const settings = require("../settings.js");

const fs = require("fs");
const path = require("path");

// Getting new module nam from cli
const moduleName = process.argv.pop();

// Contents for pug file
const pugTemplate = `include ../../markup/grid
include ../../atoms/atoms

mixin ${moduleName}(options)
  if PROD
    style: include:stylus ${moduleName}.styl

  +space(1)
  //~~// ${moduleName} module start \\~~
  //———————————————————————————————————————————————
  +container()
    +col-1()
      .${moduleName} "${moduleName}" module

  //———————————————————————————————————————————————
  //~~\\ ${moduleName} module end   //~~
  +space(1)
`;


// Contents for styl file
const stylusTemplate = `@import "../../styles/themes/schemes/general.styl"
@import "../../styles/mixins.styl"

.${moduleName}
  display block
`;


/** Creates new module directory and files
 * 
 * @param {string} moduleName - new module's name
 */
function createModule(moduleName) {
  const moduleDirectory = path.resolve(__dirname, '../', settings.dir.modules, moduleName);

  if (!fs.existsSync(moduleDirectory)) {

    fs.mkdirSync(moduleDirectory);

    fs.writeFileSync( path.join(moduleDirectory, `${moduleName}.pug` ), pugTemplate    );
    fs.writeFileSync( path.join(moduleDirectory, `${moduleName}.styl`), stylusTemplate );

  } else {
    console.error(`\nModule already exists. Remove module directory and try again"`)
  }
}

createModule(moduleName);
