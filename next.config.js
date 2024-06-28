const path = require("path");
const loaderUtils = require("loader-utils");

const hashOnlyIdent = (context, _, exportName) =>
   loaderUtils
      .getHashDigest(
         Buffer.from(
            `filePath:${path
               .relative(context.rootContext, context.resourcePath)
               .replace(/\\+/g, "/")}#className:${exportName}`,
         ),
         "md4",
         "base64",
         6,
      )
      .replace(/[^a-zA-Z0-9-_]/g, "_")
      .replace(/^(-?\d|--)/, "_$1");

/** @type {import('next').NextConfig} */
const nextConfig = {
   reactStrictMode: true,
   webpack(config, { dev }) {
      const rules = config.module.rules
         .find((rule) => typeof rule.oneOf === "object")
         .oneOf.filter((rule) => Array.isArray(rule.use));

      if (!dev)
         rules.forEach((rule) => {
            rule.use.forEach((moduleLoader) => {
               if (
                  moduleLoader.options?.modules &&
                  moduleLoader.loader?.includes("css-loader") &&
                  !moduleLoader.loader?.includes("postcss-loader")
               ) {
                  moduleLoader.options.modules.getLocalIdent = hashOnlyIdent;
               }

               // earlier below statements were sufficient:
               // delete moduleLoader.options.modules.getLocalIdent;
               // moduleLoader.options.modules.localIdentName = '[hash:base64:6]';
            });
         });

      return config;
   },
   // Configure permitted hostnames for images
   // https://nextjs.org/docs/messages/next-image-unconfigured-host
   images: {
      remotePatterns: [
         {
            protocol: "https",
            hostname: "**.darkintaqt.com",
            pathname: "**",
         },
      ],
      unoptimized: true,
   },
};

module.exports = nextConfig;
