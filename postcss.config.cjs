// postcss.config.cjs
const prod = process.env.NODE_ENV === 'production'

module.exports = {
  plugins: [
    require('postcss-nesting'),
    require('postcss-preset-env')({
      stage: 3,
      features: {
        'nesting-rules': true,
        'custom-media-queries': true, // Enable custom media queries
      },
      importFrom: ['src/styles/custom-media.css'], // Import custom media queries
    }),
    ...(prod ? [require('cssnano')()] : []),
  ],
}
