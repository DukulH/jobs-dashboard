/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export -> produces an `out/` folder of plain HTML/CSS/JS
  // that GitHub Pages (or any static host) can serve directly.
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // If you deploy to GitHub Pages at https://<user>.github.io/<repo>/
  // (i.e. NOT a custom domain and NOT a "<user>.github.io" repo itself),
  // uncomment the two lines below and replace <repo> with your repo name.
  basePath: "/jobs-dashboard",
  assetPrefix: "/jobs-dashboard/",
};

module.exports = nextConfig;
