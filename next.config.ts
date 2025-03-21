/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // ⚠️ Advertencia: Esto ignora errores de TypeScript durante el build
    ignoreBuildErrors: true,
  },
  eslint: {
    // ⚠️ Advertencia: Esto ignora errores de ESLint durante el build
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig