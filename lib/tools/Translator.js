'use strict';

let path = require('path');
let fs = require('fs');
let _ = require('lodash');

class Translator {

  constructor(translationsPath, options) {
    this._options = _.defaults(options || {fallbackLocale: 'en'});
    this._translations = this._loadTranslations(translationsPath);
  }

  _loadTranslations(translationsPath) {
    let translations = {};
    fs.readdirSync(translationsPath).forEach(file => {
      let translation = path.join(translationsPath, file);
      translations[path.basename(file, '.json')] = require(translation);
    });
    return translations;
  }

  translate(locale, key) {
    let translation = _.get(this._translations, `${locale}.${key}`);
    if (!translation) {
      return this._getFallback(locale, key);
    }
    return translation;
  }

  _getFallback(failingLocale, key) {
    if (this._options.fallbackLocale === failingLocale) {
      return key;
    }
    return this.translate(this._options.fallbackLocale, key);
  }
}

module.exports = Translator;
