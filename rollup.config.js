import babel from 'rollup-plugin-babel';

const babelOptions = {
  babelrc: false,
  presets: [['es2015', { modules: false, loose: true }], 'stage-2'],
  plugins: ['external-helpers']
}

export default {
  plugins: [babel(babelOptions)]
};
