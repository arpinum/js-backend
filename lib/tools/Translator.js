'use strict';

let path = require('path');
let _ = require('lodash');
let glob = require('glob');

class Translator {

  constructor(translationsPath, options) {
    this._options = _.defaults(options || {fallbackLocale: 'en'});
    this._translations = this._loadTranslations(translationsPath);
  }

  _loadTranslations(translationsPath) {
    let files = glob.sync(path.join(translationsPath, '**/*.json'));
    return _.reduce(files, (result, file) => {
      let locale = path.basename(path.dirname(file));
      result[locale] = _.merge(result[locale], require(file));
      return result;
    }, {});
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
