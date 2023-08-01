/**
 * @type {import('next').NextConfig}
 */
// const withPWA = require('next-pwa')({
//   dest: 'public'
  
// })

module.exports = {
  webpack(nextConfig) {
	nextConfig.module.rules.push({
			loader: '@svgr/webpack',
			options: {
				prettier: false,
				svgo: true,
				svgoConfig: {
					name: 'removeViewBox',
					active:false
				},
				titleProp: true,
			},
			test: /\.svg$/,
		});

		return nextConfig;
	},
}