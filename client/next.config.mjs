import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
    // output: 'standalone',
    webpack: (config) => {
        config.externals = [...config.externals, { canvas: "canvas" }]; // required to make Konva & react-konva work
        return config;
    },
    experimental: {
        esmExternals: "loose",
    },
    images: {
        domains: ['http://dekdee2.informatics.buu.ac.th/'], 
    },
};

export default withNextIntl(nextConfig);