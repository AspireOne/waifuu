/** @type {import('@lingui/conf').LinguiConfig} */
module.exports = {
    locales: ["en", "cs"],
    sourceLocale: "en",
    catalogs: [
        {
            path: "<rootDir>/src/locales/{locale}/messages",
            include: ["src"],
        },
    ],
    format: "po",

};