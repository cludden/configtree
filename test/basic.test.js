import Baobab from 'baobab';
import { expect } from 'chai';
import { describe, it } from 'mocha';

import Config from '../lib/index';

describe('[basic]', function () {
  it('constructor should work with no options', function () {
    const config = new Config();
    expect(config).to.have.property('_plugins').that.is.an('array').with.lengthOf(0);
    expect(config).to.have.property('validate').that.is.a('function');
    expect(config).to.have.property('_state').that.is.an.instanceof(Baobab);
    expect(config).to.have.property('_initialized', false);
  });

  it('constructor should work with options', function () {
    const validate = initial => initial;
    const config = new Config({ validate });
    expect(config).to.have.property('validate', validate);
  });
});
