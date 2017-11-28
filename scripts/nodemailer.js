// Load global settings
const settings = require("../settings.js"); 

// Load an array with adresses for testing
const adresses = settings.adresses;

// Load dependencies
const fs   = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

// Create nodemailer transporter instance
const transporter = nodemailer.createTransport(settings.nodemailer.transporter);


/** Send message to adresses
 * 
 * @param {string} fileSource     - path to template file
 * @param {string} messageContent - html-content of a template
 * 
 * @returns {function} log - log result into console
 */
const sendMessage = (fileSource, messageContent) => {

    const mailOptions = {
        from: `'GreatSimple templates tester' <${settings.nodemailer.transporter.auth.user}>`,
        subject: 'Checking template ' + fileSource,
        to: adresses.join(", "),
        html: messageContent
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }

        console.log(`Message sent: ${info.response}`);
    });
}


/** Read templates files and send them to test adresses
 * 
 * @param {string} templatesDir - directory with ready-to-use templates
 */
const Mailer = templatesDir => {
    fs.readdir(templatesDir, (err, files) => {
        
        // Error check
        if (err) {
            console.error(err); return;
        }

        // Going through array of templates
        files.forEach( file => {

            // Construct full path to template file
            let fileSource = path.resolve(__dirname, templatesDir, file, file + ".html");

            console.log(fileSource);

            // Read file and run 'sendMessage' function
            fs.readFile(fileSource, 'utf-8', (err, content) => {

                // Error check
                if (err) {
                    console.error(err); return;
                }

                // If file readed, sending it content as html email
                sendMessage(file, content);
            });
        });
    });
}


Mailer( path.resolve(settings.dir.base, "html") );