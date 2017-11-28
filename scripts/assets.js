const settings = require("../settings.js");

const fs   = require("fs");
const ncp  = require("ncp");
const path = require("path");

const assetsDirectory = path.resolve(__dirname, "../", settings.assets);

// copyAssets(assetsDirectory, "html",      "./");
copyAssets(assetsDirectory, "mailchimp", "./");

function copyAssets(Assets, type, imgDest) {
  imgDest = imgDest || "";

  const templatesDir = path.resolve(settings[type].templates);

  fs.readdir(templatesDir, (err, templates) => {

    templates.forEach(
      templateName =>
        ncp(Assets, path.join(templatesDir, templateName, imgDest), err => {
          if (err) return console.error(err);
        })
    );

  });
}