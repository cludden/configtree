import { expect } from 'chai';
import { describe, it } from 'mocha';
import sinon from 'sinon';

import Config, { env } from '../lib/index';

describe('[env]', function () {
  it('constructor should throw with no prefix', function () {
    expect(env.bind(null, {})).to.throw(Error);
  });

  it('should load configuration from the environment', function () {
    const config = new Config();
    const prefix = 'CWEIAHELKJQOIECHAKSJASDLFJK';
    const plugin = env({ prefix });
    const spy = sinon.spy(plugin, 'initialize');
    config.use(plugin);
    process.env[`${prefix}_foo`] = 'bar';
    process.env[`${prefix}_nested__foo`] = 'blah';
    return config.initialize()
    .then(() => {
      sinon.assert.calledOnce(spy);
      expect(config.get()).to.deep.equal({
        foo: 'bar',
        nested: {
          foo: 'blah',
        },
      });
    })
    .finally(() => {
      spy.restore();
      delete process.env[`${prefix}_foo`];
      delete process.env[`${prefix}_nested__foo`];
    });
  });
});
