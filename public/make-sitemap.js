const fs = require("fs");
const pages = require("./src/data/pages.json");

const site = "https://online-tutoring-seo-site.vercel.app";

const urls = [
  site,
  `${site}/privacy`,
  ...pages.map((page) => `${site}/${page.slug}`),
];

const xml =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls
    .map((url) => {
      const priority = url === site ? "1.0" : "0.8";
      return `  <url><loc>${url}</loc><changefreq>weekly</changefreq><priority>${priority}</priority></url>`;
    })
    .join("\n") +
  `\n</urlset>\n`;

fs.writeFileSync("public/sitemap.xml", xml, "utf8");

console.log(`sitemap created ${urls.length}`);
