const fs = require("fs");
const pages = require("./src/data/pages.json");

const site = "https://online-tutoring-seo-site.vercel.app";

const urls = [site, site + "/privacy"].concat(
  pages.map(function (page) {
    return site + "/" + page.slug;
  })
);

let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

urls.forEach(function (url) {
  const priority = url === site ? "1.0" : "0.8";
  xml += "  <url>";
  xml += "<loc>" + url + "</loc>";
  xml += "<changefreq>weekly</changefreq>";
  xml += "<priority>" + priority + "</priority>";
  xml += "</url>\n";
});

xml += "</urlset>\n";

fs.writeFileSync("public/sitemap.xml", xml, "utf8");

console.log("sitemap created " + urls.length);
