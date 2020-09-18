"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = void 0;
const express = require("express");
const fs = require("fs");
const path = require("path");
function init(port) {
    const app = express();
    const root = path.resolve(`${__dirname}/..`);
    const pages = fs.readdirSync(`${root}/src/pages`);
    for (const page of pages) {
        servePage(app, `${root}/src/pages/${page}`, page);
    }
    serveRoot(app, `${root}/src/home`, "home");
    app.get("/global/three.js", (req, res) => {
        res.sendFile(`${root}/node_modules/three/build/three.min.js`);
    });
    app.use("/build/three.module.js", (req, res) => {
        res.redirect(`/global/three/build/three.module.js`);
    });
    app.use("/global/composer.js", (req, res) => {
        res.redirect(`/global/three/examples/jsm/postprocessing/EffectComposer.js`);
    });
    app.get("/favicon.ico", (req, res) => {
        res.sendFile(`${root}/src/favicon.ico`);
    });
    app.get("/Curriculum%20Vitae", (req, res) => {
        res.sendFile(`${root}/src/global/Curriculum Vitae.pdf`);
    });
    app.use(`/global`, express.static(`${root}/src/global`));
    app.listen(port, () => {
        console.log(`App listening at http://localhost:${port}.`);
    });
}
exports.init = init;
function servePage(app, directory, pageName) {
    app.get(`/${pageName}`, (req, res) => {
        res.sendFile(`${directory}/index.html`);
    });
    app.get(`/${pageName}/style/style.css`, (req, res) => {
        res.sendFile(`${directory}/style.css`);
    });
    app.use(`/${pageName}/assets`, express.static(`${directory}/assets`));
    app.use(`/${pageName}/js`, express.static(`${__dirname}/pages/${pageName}`));
}
function serveRoot(app, directory, pageName) {
    app.get(`/`, (req, res) => {
        res.sendFile(`${directory}/index.html`);
    });
    app.get(`/style/style.css`, (req, res) => {
        res.sendFile(`${directory}/style.css`);
    });
    app.use(`/assets`, express.static(`${directory}/assets`));
    app.use(`/js`, express.static(`${__dirname}/${pageName}`));
}
