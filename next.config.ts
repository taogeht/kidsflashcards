import type { NextConfig } from 'next'

const config: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true
  },
  basePath: '/flashcards',
  assetPrefix: '/flashcards/',
  trailingSlash: true,
}

export default config