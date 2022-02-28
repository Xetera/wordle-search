/** @type {import('gatsby').GatsbyConfig} */
module.exports = {
  plugins: [
    "gatsby-plugin-mantine",
    {
      resolve: "gatsby-plugin-google-gtag",
      options: {
        trackingIds: ["G-ERF5C6PPSD"],
        gtagConfig: {
          anonymize: true,
        },
        pluginConfig: {
          respectDNT: true,
        },
      },
    },
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-sitemap",
  ],
};
