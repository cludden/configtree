import set from 'lodash.set';

export default function env({ prefix }) {
  if (typeof prefix !== 'string' || !prefix.length) {
    throw new Error('Invalid Options: `prefix` required');
  }
  /**
   * Initialize plugin
   * @param  {Baobab} state
   * @return {Promise}
   */
  function initialize({ state }) {
    return new Promise((resolve) => {
      const initial = Object.keys(process.env).filter(key => key.startsWith(prefix))
      .reduce((memo, key) => {
        const path = key.replace(`${prefix}_`, '').split('__');
        set(memo, path, process.env[key]);
        return memo;
      }, {});
      state.deepMerge(initial);
      resolve();
    });
  }

  return {
    initialize,
  };
}
