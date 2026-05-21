const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Prevent Next from using the parent folder's empty lockfile as the workspace root
  outputFileTracingRoot: path.join(__dirname),
}

module.exports = nextConfig
