/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'vercel.app'],
  },
  webpack(config) {
    // Los tests que viven dentro de la tienda (tests-internos/*.html) se
    // empaquetan como texto en el servidor; así nunca quedan en una carpeta
    // pública y solo salen por /t/<intento>, después de pagar.
    config.module.rules.push({ test: /\.html$/, type: 'asset/source' })
    return config
  },
}

module.exports = nextConfig
