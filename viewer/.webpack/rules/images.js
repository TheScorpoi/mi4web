/**
 * This allows us to include web workers in our bundle, and VTK.js
 * web workers in our bundle. While this increases bundle size, it
 * cuts down on the number of includes we need for `script tag` usage.
 */
const images = {
  test: /\.(jpg|png|svg)$/,
  use: {
    loader: 'url-loader',
    options: {
      limit: 25000,
    },
  },
};

module.exports = images;
