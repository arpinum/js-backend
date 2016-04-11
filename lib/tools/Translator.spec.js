'use strict';

let path = require('path');
let Translator = require('./Translator');

describe('The translator', () => {

  let translator;

  beforeEach(() => {
    translator = new Translator(path.join(__dirname, '../test/translatorTests'));
  });

  it('should translate for the right locale', () => {
    translator.translate('en', 'key').should.equal('value');
    translator.translate('fr', 'key').should.equal('valeur');
  });

  it('should translate a deep key for the right locale', () => {
    translator.translate('en', 'other.key').should.equal('other value');
    translator.translate('fr', 'other.key').should.equal('autre valeur');
  });

  it('should use fallback locale if key cannot be found for specified locale', () => {
    let options = {fallbackLocale: 'fr'};
    translator = new Translator(path.join(__dirname, '../test/translatorTests'), options);

    translator.translate('en', 'onlyFr').should.equal('seulement en français');
  });

  it('should return key if translation cannot be found', () => {
    translator.translate('en', 'notExisting').should.equal('notExisting');
    translator.translate('fr', 'not.existing').should.equal('not.existing');
    translator.translate('it', 'notExisting').should.equal('notExisting');
  });
});
