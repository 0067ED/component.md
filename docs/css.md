
## 样式篇

### 所见即所得

一般情况下，**组件所能看到的大小即是它的真实大小**。尽量不要在组件上使用看不见的边界，例如在外部加入`margin`样式。

这样做的好处是：从设计师的角度出发去设计你的代码，设计师给到的标注稿的间距标注一般不会考虑组件外部的透明边界。而组件的使用者（其他开发同学）可能不知道这样的边界的存在，就会造成一些返工。

所以为了提高组件的易用性，一般推荐组件所能看到的大小即是它的真实大小。如下例子：

:::GOOD
```html
<span class="box"></span>
<span class="box"></span>
<span class="box"></span>
<style rel="stylesheet/less">
.demo-1 {
    // 组件样式
    .box {
        display: inline-block;
        margin: 0;
        width: 20px;
        height: 20px;
        border: 1px solid #c92a2a;
        background: #f03e3e;
    }

    // 使用组件时候的样式
    &.good-demo .box {
        margin-right: 10px;
    }
}
</style>
```
:::
:::BAD
```html
<span class="box"></span>
<span class="box"></span>
<span class="box"></span>
<style rel="stylesheet/less">
.demo-2 {
    // 组件样式
    .box {
        display: inline-block;
        margin: 0 2px;
        width: 20px;
        height: 20px;
        border: 1px solid #c92a2a;
        background: #f03e3e;
    }

    // 使用组件时候的样式
    &.good-demo .box {
        margin-right: 6px;
    }
    &.good-demo .box:first-child {
        margin-left: 0;
    }
}
</style>
```
:::

当然也会存在一些例外情况，比如说组件的鼠标响应区域比组件的实际展示区域要大。这时候我们推荐和设计师做好充分地沟通，确认标注稿之后要考虑到这些隐藏边界，或者根本不关心这些隐藏边界导致的几像素偏差。以简化组件使用者在使用此组件时候的难度。例子如下：

:::DEMO
```html
<span class="box"></span>
<span class="box"></span>
<span class="box"></span>
<style>
.demo-3 {
    // 组件样式
    .box {
        display: inline-block;
        margin: 0;
        width: 20px;
        height: 20px;
        border: 10px solid transparent;
        background: #f03e3e;
    }
    .box:hover {
        background: #ff6b6b;
    }
    // 使用组件时候的样式
    &.good-demo .box {
        margin-right: 10px;
    }
}
</style>
```
:::

### 单个组件内CSS REST

为了确保**组件在各个页面下最终呈现的样子是一致的**，需要对组件内CSS进行一定程度上的样式重置。我们推荐的重置方法如下：

```less
.reset {
    display: inline-block;      // 或者 block，特殊情况下用inline
    margin: 0;
    padding: 0;
    border: 0;
    box-sizing: border-box;     // IE8+以支持，在有border的时候外部可以更轻松的控制组件宽高
    font-size: 14px;            //
    line-height: 20px;          //
    outline: 0;                 // 不适用浏览器默认focus状态，可以自定义

    // 重置组件内部的常用标签
    div, span, object, iframe, h1, h2, h3, h4, h5, h6, p,
    pre, a, abbr, acronym, address, code, del, dfn, em, img,
    dl, dt, dd, ol, ul, li, fieldset, form, label,
    legend, caption, tbody, tfoot, thead, tr,
    // html5 标签
    article, aside, details, figcaption,
    figure, footer, header, hgroup, menu, nav,
    section, summary, main {
        // 盒模型重置
        margin: 0;
        padding: 0;
        border: 0;
        box-sizing: content-box;
        // focus状态
        outline: 0;
        // 文本
        font-weight: inherit;
        font-style: inherit;
        font-family: inherit;
        font-size: 100%;
        color: inherit;
        vertical-align: baseline;
    }

    // 设置成块级标签
    div, p, pre,
    iframe, audio, canvas, video,   // 本来不是块级元素，但大都作为块级元素使用
    h1, h2, h3, h4, h5, h6,
    dl, dt, dd, ol, ul, li,
    fieldset, form, legend,
    // html5 标签
    article, aside, details, figcaption,
    figure, footer, header, hgroup, menu, nav,
    section, summary, main {
        display: block;
        line-height: inherit;
    }
    ol, ul {
        list-style: none;
    }
    table, caption, tbody, tfoot, thead, tr {

    }
    table {
        border-collapse: separate;
        border-spacing: 0;
        vertical-align: middle;
    }
    caption, th, td {
        text-align: inherit;
        font-weight: inherit;
        vertical-align: middle;
    }

    // 行内元素
    // TODO
    span, object,
    a, abbr, acronym, address, code, del, dfn, em, img,
    dl, dt, dd, ol, ul, li, fieldset, form, label,
    legend, caption, tbody, tfoot, thead, tr,
    // html5 标签
    article, aside, details, figcaption,
    figure, footer, header, hgroup, menu, nav,
    section, summary, main {

    audio, canvas, video {
        .inline-block();
    }
}
```
