/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: true,
    },
    // reactStrictMode: true,
    // api: {
    //     bodyParser: false,
    //     externalResolvers: true,
    //     basePath: '/app/api',
    // }
}

module.exports = nextConfig

// module.exports = withPlugins([
//     withOffline,
//     [withReactSvg, {
//       // config for reactSvgPlugin
//     }]
//   ], nextConfig)

