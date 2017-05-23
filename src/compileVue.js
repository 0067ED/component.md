const compileTemplate = require('./compileTemplate');
const cheerio = require('cheerio');
const babel = require('babel-core');

let scopedId = 0;
module.exports = function compileVue(html, styles) {
    const $ = cheerio.load(html, {
        decodeEntities: false,
        lowerCaseAttributeNames: false,
        lowerCaseTags: false
    });

    scopedId++;
    const template = compileTemplate(`<div class="component">
        ${$.html('template')}
    </div>`, scopedId);
    const style = $.html('style')
        .trim()
        .replace(/^<style[^>]*>/i, '')
        .replace(/<\/style>$/i, '');
    const script = ($.html('script') || `export default {}`).replace('export default', 'return');
    const code = `
(function () {
    var DemoComponent = Vue.extend((function () {
        var Template = ${template};
        var Component = (function () {
            ${script}
        })();
        Component.render = Template.render;
        Component.staticRenderFns = Template.staticRenderFns;
        return Component;
    })());
    var scripts = document.getElementsByTagName('script');
    var script = scripts[scripts.length - 1];
    new DemoComponent().$mount(script.previousElementSibling);
})();
`;

    styles.push(style);
    const r = babel.transform(code, {
        presets: ['es2016']
    });
    return `
        <div></div>
        <script>${r.code}</script>
    `;
}
