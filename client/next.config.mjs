import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    webpack: (config) => {
        config.externals = [...config.externals, { canvas: "canvas" }]; // required to make Konva & react-konva work
        return config;
    },
    experimental: {
        esmExternals: "loose",
    },
    // output: 'standalone',
    images: {
        domains: ['localhost'], // เพิ่ม localhost ใน domains
    },
};

export default withNextIntl(nextConfig);