import Bluebird from 'bluebird';
import Baobab from 'baobab';

export { default as env } from './plugins/env';

/**
 * Read and merge config from json configuration files at the specified directory.
 * @param  {Object} args
 * @param  {String} args.dir
 * @param  {Function} args.validate - promisified validation function that should
 * resolve to the validated configuration
 * @return {Config} config
 */
export default class Config {
  constructor(opts = {}) {
    const { validate } = opts;
    this.validate = typeof validate === 'function' ? validate : initialState => initialState;
    this._state = new Baobab({});
    this._initialized = false;
    this._plugins = [];
  }

  /**
   * Retrieve a branch of the tree
   * @param  {String[]} path
   * @return {*}
   */
  get(...path) {
    return this._state.get(...path);
  }

  /**
   * Load initial configuration and validate it
   * @return {Bluebird} bluebird
   */
  initialize() {
    if (!this._plugins.length) {
      return Promise.reject(new Error('No Plugins Registered'));
    }
    return Bluebird.all(this._plugins.map(plugin => plugin.initialize({ state: this._state })))
    .then(() => {
      const initialState = this._state.get();
      return this._validate(initialState);
    })
    .then((validated) => {
      this._state.set([], validated);
    });
  }

  /**
   * Retreive a cursor from the config tree
   * @param  {String[]} path
   * @return {Cursor} cursor
   */
  select(...path) {
    return this.config.select(...path);
  }

  /**
   * [use description]
   * @param  {[type]} plugins [description]
   * @return [type]           [description]
   */
  use(...plugins) {
    this._plugins = this._plugins.concat(plugins);
    if (this._initialized) {
      this.initialize();
    }
  }

  /**
   * Promisified wrapper around the user defined validation function
   * @param  {Object} initialState - config object
   * @return {Bluebird} bluebird
   * @private
   */
  _validate(initialState) {
    return Bluebird.try(() => this.validate(initialState));
  }
}
