// offline config passed to workbox-build.
module.exports = {
  globPatterns: ["**/*.{js,html,css,png,jpg,gif,svg,eot,ttf,woff}"],
  globDirectory: "/app/public",
  swDest: "/app/public/service-worker.js",
},
