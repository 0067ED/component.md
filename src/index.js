
const hljs = require('highlight.js');
const MarkdownIt = require('markdown-it');
const vfs = require('vinyl-fs');
const Vinyl = require('vinyl');
const through = require('through2');
const compileVue = require('./compileVue');
const less = require('less');
const watchr = require('watchr');
const path = require('path');
const fs = require('fs');
const postSalad = require('postcss-salad');

const allStyles = [];
const md = new MarkdownIt({
    html: true,
    highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return `<pre class="hljs"><code>${hljs.highlight(lang, str).value}</code></pre>
                        ${lang.toLowerCase() == 'html' ? compileVue(str, allStyles) : ''}
                `;
            }
            catch (e) {}
        }

        return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`; // use external default escaping
    }
});

let insideRuleContainer = false;
const oldFenceRule = md.renderer.rules.fence;
md.renderer.rules.fence = function() {
    return insideRuleContainer
        ? `</div><div class="rule-code">${oldFenceRule.apply(this, arguments)}</div>`
        : oldFenceRule.apply(this, arguments);
};

md.use(require('markdown-it-imsize'));
md.use(require('markdown-it-anchor'), {});
let count = 0;
md.use(require('markdown-it-container'), 'RULE', {
    render: function (tokens, idx) {
        if (tokens[idx].nesting === 1) {
            insideRuleContainer = true;
            // opening tag
            return `<div class="rule rule-${++count}">
                        <div class="rule-right">
                        <div class="rule-txt">`;
        }
        else {
            // closing tag
            insideRuleContainer = false;
            return '</div></div>\n';
        }
    }
});
md.use(require('markdown-it-container'), 'RULE_NO_CODE', {
    render: function (tokens, idx) {
        if (tokens[idx].nesting === 1) {
            insideRuleContainer = true;
            // opening tag
            return `<div class="rule rule-nocode rule-${++count}">
                        <div class="rule-txt">`;
        }
        else {
            // closing tag
            insideRuleContainer = false;
            return '</div></div>\n';
        }
    }
});

const HEADER_HTML = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>前端组件开发心得</title>
        <link rel="stylesheet" href="./static/tomorrow.css">
        <link rel="stylesheet" href="./static/doc.css">
        <script src="//unpkg.com/vue@2.3.3"></script>
        <style>{demoStyle}</style>
    </head>
    <body class="page-{pageClass}">
        {beforeHTML}
        <div class="main">
            <div class="header">
                <h1>前端组件开发心得</h1>
                <div class="header-info">
                    <p>这篇文档总结了一些前端组件的开发心得，整理出了一个我们理想中的Best Practise。</p>
                    <p>它更多的是Vue相关的内容，如果你有其他库（React，Angular）的心得也可以发Merge Request来提交。</p>
                    <p>希望会对你的组件库开发有一定帮助。</p>
                </div>
            </div>`;
const FOOTER_HTML = `
        </div>
        <script src="./static/doc.js"></script>
    </body>
    </html>`;

function run(options) {
    const src = options && options.src || './docs/**/*.md';
    const dest = options && options.dest || './docs';
    const files = [];
    function build(type, fullPath) {
        if (path.extname(fullPath) !== '.md') {
            return;
        }

        console.log(`[${type}] ${fullPath}`);
        vfs.src(src)
            .pipe(through.obj(
                function (file, encoding, callback) {
                    if (file.isNull() || file.contents == null) {
                        callback(null, file);
                        return;
                    }

                    if (file.isStream()) {
                        throw new Error('stream content is not supported');
                        return;
                    }

                    try {
                        files.push(Buffer.concat([
                            new Buffer(`<div class="module module-${file.stem.trim()}">`),
                            new Buffer(md.render(file.contents.toString())),
                            new Buffer('</div>')
                        ]));
                    }
                    catch (e) {
                        console.log(e);
                        callback(e);
                    }
                    callback();
                },
                function (callback) {
                    const style = allStyles.join('\n');
                    less.render(style, (e, output) => {
                        if (e) {
                            console.log(e);
                            return;
                        }

                        postSalad.process(output.css, {
                            'browsers': ['ie > 8', 'last 2 versions'],
                            'features': {
                                'bem': {
                                    'shortcuts': {
                                        'component': 'b',
                                        'modifier': 'm',
                                        'descendent': 'e'
                                    },
                                    'separators': {
                                        'descendent': '__',
                                        'modifier': '--'
                                    }
                                }
                            }
                        }).then((result) => {
                            files.unshift(new Buffer(HEADER_HTML
                                .replace('{pageClass}', 'rules')
                                .replace('{beforeHTML}', '')
                                .replace('{demoStyle}', `\n${result.css}`)
                            ));
                            files.push(new Buffer(FOOTER_HTML));
                            this.push(new Vinyl({
                                base: dest,
                                path: `${dest}/index.html`,
                                contents: Buffer.concat(files)
                            }));
                            callback();
                            files.length = 0;
                            allStyles.length = 0;
                            count = 0;
                        });
                    });
                }
            ))
            .pipe(vfs.dest(dest));
    }

    build('init', src);

    const docPath = new Vinyl({path: src}).dirname.replace('**', '');
    watchr.open(docPath, build, function (error) {
        if (error) {
            console.log(`watch failed on "${docPath}".`, error);
            return;
        }
        console.log(`watch files on "${docPath}".\n\n`);
    });
};

run();
