
const compiler = require('vue-template-compiler');
const beautify = require('js-beautify').js_beautify;
const transpile = require('vue-template-es2015-compiler');


function toFunction (code) {
    return `function (){
        ${beautify(code, {
            indent_size: 4 // eslint-disable-line camelcase
        })}
    }`;
}

function pad(html) {
    return html.split(/\r?\n/).map(line => `  ${line}`).join('\n')
}

module.exports = function compileTemplate(html, scopedId) {
    const parts = compiler.parseComponent(html, {
        pad: 'line'
    });
    const templateResult = compiler.compile(html, {
        preserveWhitespace: true,
        scopedId: scopedId
    });

    if (templateResult.tips && templateResult.tips.length) {
        templateResult.tips.forEach(tip => {
            console.log(tip);
        });
    }

    let code;
    if (templateResult.errors && templateResult.errors.length) {
        console.log(
            `\n  Error compiling template:\n${pad(html)}\n` +
            templateResult.errors.map(e => `  - ${e}`).join('\n') + '\n'
        );
        code = 'var options={render:function(){},staticRenderFns:[]}';
    }
    else {
        const renderFunction = toFunction(templateResult.render);
        const staticRenderFunctions = templateResult.staticRenderFns.map(toFunction).join(',');
        code = transpile(`var options={
    render: ${renderFunction},
    staticRenderFns: [${staticRenderFunctions}]
}`);
    }

    return `(function () {${code};return options;})()`;
}
