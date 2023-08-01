/**
 * @type {import('next').NextConfig}
 */
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching: [
    {
	urlPattern: /^\/api\//,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-data-cache',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 60 * 60 // 1 hour
        },
      },
    },
  ],
  publicExcludes: ['!robots.txt', '!sitemap.xml']
  
})

module.exports = withPWA({
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
})