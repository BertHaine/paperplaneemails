# Email templates (v1.0.0)
GreatSimple email templates build system

__Supported services:__
* Html templates with inline styles
* Mailchimp templates with mergetags and editable styles

## Tools
* Gulp
* Pug
* Stylus
* Browser-sync
* Nodemailer

## Setup
```bash
npm install -g gulp && npm install
```

## Commands
__Build all templates and run local server__
```bash
$ npm start
```

__Build all templates and get result archive__
```bash
$ npm run build
```
  
__Send emails__
```bash
$ npm run nodemailer
```
> Email adresses listed in settings.js file
