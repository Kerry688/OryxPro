import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    // Handle MongoDB modules that use Node.js specific modules
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        child_process: false,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        util: false,
        url: false,
        assert: false,
        http: false,
        https: false,
        os: false,
        path: false,
        zlib: false,
        dns: false,
        querystring: false,
        buffer: false,
        events: false,
        punycode: false,
        readline: false,
        cluster: false,
        dgram: false,
        perf_hooks: false,
        vm: false,
        worker_threads: false,
        module: false,
        console: false,
        process: false,
        timers: false,
        constants: false,
        domain: false,
        inspector: false,
        repl: false,
        string_decoder: false,
        sys: false,
        tty: false,
        v8: false,
        wasi: false,
      };
      
      // Completely exclude MongoDB from client-side bundling
      config.externals = config.externals || [];
      if (Array.isArray(config.externals)) {
        config.externals.push('mongodb');
        config.externals.push('mongodb/lib/client-side-encryption');
        config.externals.push('mongodb/lib/encryption');
        config.externals.push('mongodb/lib/bson');
        config.externals.push('mongodb/lib/connection_string');
        config.externals.push('mongodb/lib/operations');
        config.externals.push('mongodb/lib/cmap');
        config.externals.push('mongodb/lib/sdam');
        config.externals.push('mongodb/lib/topology');
        config.externals.push('mongodb/lib/read_preference');
        config.externals.push('mongodb/lib/write_concern');
        config.externals.push('mongodb/lib/read_concern');
        config.externals.push('mongodb/lib/error');
        config.externals.push('mongodb/lib/utils');
        config.externals.push('mongodb/lib/logger');
        config.externals.push('mongodb/lib/logger/logger');
        config.externals.push('mongodb/lib/logger/mongo_logger');
        config.externals.push('mongodb/lib/logger/parse_envelope');
        config.externals.push('mongodb/lib/logger/redact');
        config.externals.push('mongodb/lib/logger/severity');
        config.externals.push('mongodb/lib/logger/transformable_logger');
        config.externals.push('mongodb/lib/logger/transformable_logger/transformable_logger');
        config.externals.push('mongodb/lib/logger/transformable_logger/transformable_logger/transformable_logger');
      } else {
        config.externals = [
          config.externals,
          'mongodb',
          'mongodb/lib/client-side-encryption',
          'mongodb/lib/encryption',
          'mongodb/lib/bson',
          'mongodb/lib/connection_string',
          'mongodb/lib/operations',
          'mongodb/lib/cmap',
          'mongodb/lib/sdam',
          'mongodb/lib/topology',
          'mongodb/lib/read_preference',
          'mongodb/lib/write_concern',
          'mongodb/lib/read_concern',
          'mongodb/lib/error',
          'mongodb/lib/utils',
          'mongodb/lib/logger',
          'mongodb/lib/logger/logger',
          'mongodb/lib/logger/mongo_logger',
          'mongodb/lib/logger/parse_envelope',
          'mongodb/lib/logger/redact',
          'mongodb/lib/logger/severity',
          'mongodb/lib/logger/transformable_logger',
          'mongodb/lib/logger/transformable_logger/transformable_logger',
          'mongodb/lib/logger/transformable_logger/transformable_logger/transformable_logger'
        ];
      }
    }
    
    // Add specific rules to prevent MongoDB from being bundled
    config.module = config.module || {};
    config.module.rules = config.module.rules || [];
    
    // Add rule to ignore MongoDB modules on client side
    config.module.rules.push({
      test: /node_modules\/mongodb/,
      use: 'null-loader'
    });
    
    return config;
  },
};

export default nextConfig;
