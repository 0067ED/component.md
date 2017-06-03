const compileTemplate = require('./compileTemplate');
const cheerio = require('cheerio');
const babel = require('babel-core');

let scopedId = 0;
function compileComponent(template, script) {
    scopedId++;

    const templateJS = compileTemplate(`<div class="component">
        ${template}
    </div>`, scopedId);
    const scriptJS = (script || `export default {}`).replace('export default', 'return');
    return `(function () {
    var Template = ${templateJS};
    var Component = (function () {
        ${scriptJS}
    })();
    Component.render = Template.render;
    Component.staticRenderFns = Template.staticRenderFns;
    return Component;
})()`;
}

module.exports = function compileVue(html, styles) {
    const $ = cheerio.load(html, {
        decodeEntities: false,
        lowerCaseAttributeNames: false,
        lowerCaseTags: false
    });
    const allTemplates = $('template');
    if (!allTemplates.length) {
        return '';
    }

    const style = $('style').each((index, style) => {
        styles.push($(style).html());
    });

    const componentsCode = [];
    allTemplates.each((index, element) => {
        const template = $(element).html();
        const script = $(element).next('script').html();
        componentsCode.push(compileComponent(template, script));
    });
    const mainComponentCode = `
        var DemoComponent = Vue.extend(${componentsCode.shift()});
        var scripts = document.getElementsByTagName('script');
        var script = scripts[scripts.length - 1];
        var ruleDemo = document.createElement('div');
        ruleDemo.className = 'rule-demo';
        var div = document.createElement('div');
        ruleDemo.appendChild(div);
        var textDiv = script.parentNode.previousElementSibling;
        textDiv.insertBefore(ruleDemo, textDiv.firstChild)
        new DemoComponent().$mount(div);
    `;
    const otherComponentCode = componentsCode.reduce((result, component) => {
        result += `
            tmp = ${component};
            Vue.component(tmp.name, tmp);
        `
        return result;
    }, '');

    const code = `
(function () {
    let tmp;
    ${otherComponentCode}
    ${mainComponentCode}
})();
`;
    try {
        const r = babel.transform(code, {
            presets: [
                [
                    'env',
                    {
                        targets: {
                            browsers: ['last 2 versions', 'ie >= 9']
                        }
                    }
                ]
            ]
        });
        return `
            <script>${r.code}</script>
        `;
    }
    catch (e) {
        console.log(e);
        return '';
    }
}
