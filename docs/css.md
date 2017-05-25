
## 样式篇

### 所见即所得

:::RULE

> 一般情况下，**组件所能看到的大小即是它的真实大小**。尽量不要在组件上使用看不见的边界，例如在外部加入`margin`样式。
>
> 这样做的好处是：从设计师的角度出发去设计你的代码，设计师给到的标注稿的间距标注一般不会考虑组件外部的透明边界。而组件的使用者（其他开发同学）可能不知道这样的边界的存在，就会造成一些返工。
>
> 所以为了提高组件的易用性，一般推荐组件所能看到的大小即是它的真实大小。

```html
<template>
    <span class="box"></span>
    <span class="box"></span>
    <span class="box"></span>
</template>
<style rel="stylesheet/less">
.rule-1 {
    // 组件样式
    .rule-view-1 .box {
        display: inline-block;
        margin: 0;
        width: 40px;
        height: 40px;
        border: 1px solid #228ae6;
        background: #4dadf7;
    }

    // 使用组件时候的样式
    .rule-view-1 .box {
        margin-right: 10px;
    }
}
</style>
```
:::

:::RULE

> 当然也会存在一些例外情况，比如说组件的鼠标响应区域比组件的实际展示区域要大。
>
> 这时候我们推荐和设计师做好充分地沟通，确认设计稿中的标注要考虑到这些隐藏边界，或者设计师根本不关心这些隐藏边界导致的几像素偏差。以简化组件使用者在使用此组件时候的难度。

```html
<template>
    <span class="box"></span>
    <span class="box"></span>
    <span class="box"></span>
</template>
<style>
.rule-2 {
    // 组件样式
    .box {
        display: inline-block;
        margin: 0;
        width: 40px;
        height: 40px;
        border: 10px solid transparent;
        background: #4dadf7;
    }
    .box:hover {
        background: #228ae6;
    }
    // 使用组件时候的样式
    .box {
        margin-right: 10px;
    }
}
</style>
```
:::



### 使用`box-sizing`

:::RULE

> 组件的root节点样式优先使用`box-sizing:border-box;`，这样在组件外部就可以轻松控制组件的宽高。不需要考虑root节点的`border`和`padding`值。

```html
<template>
    <span class="box">200x200</span>
</template>
<style rel="stylesheet/less">
.rule-3 {
    // 组件样式
    .rule-view-1 .box {
        display: inline-block;
        margin: 0;
        width: 50px;
        height: 50px;
        padding: 10px;
        vertical-align: middle;
        text-align: center;
        border: 1px solid #228ae6;
        background: #4dadf7;
        box-sizing: border-box;
    }

    // 使用组件时候的样式
    .rule-view-1 .box {
        width: 200px;
        height: 200px;
    }
}
</style>
```
:::



### 使用`currentColor`

:::RULE

> 如果组件颜色较为单一，可以使用`currentColor`来设置颜色。这样在组件外部就可以通过`color`属性来轻松控制组件的颜色

```html
<template>
    <span class="button">按钮</span>
</template>
<style rel="stylesheet/less">
.rule-4 {
    // 组件样式
    .button {
        display: inline-block;
        margin: 0;
        width: 80px;
        height: 40px;
        line-height: 40px;
        vertical-align: middle;
        text-align: center;
        color: #c92a2a;
        cursor: pointer;
        border: 2px solid currentColor;
        background: transparent;
        box-sizing: border-box;
    }

    // 使用组件时候的样式
    .button {
        color: #4dadf7;
    }
    .button:hover {
        color: #228ae6;
    }
}
</style>
```
:::



### 组件内部尽量自适应高宽

:::RULE

> 组件的高宽很可能会被修改，此时如果组件内部是自适应变化的，那么就可以大大提高组件的易用性。组件的使用者在外部只需要通过CSS的`width`和`height`就可以方便的修改组件的高宽，通常会配合`box-sizing:border-box`一起使用。
>
> 在开发组件时一定要把高宽变化的情况考虑在内，尽量做到组件内部自适应高宽。

```html
<template>
    <span class="input">
        <span></span>
        <input></input>
        <span></span>
    </span>
</template>
<style rel="stylesheet/less">
.rule-5 {
    // 组件样式
    .button {
        display: inline-block;
        margin: 0;
        width: 80px;
        height: 40px;
        line-height: 40px;
        vertical-align: middle;
        text-align: center;
        color: #c92a2a;
        border: 2px solid currentColor;
        background: transparent;
        box-sizing: border-box;
    }

    // 使用组件时候的样式
    .button {
        color: #0067ED;
    }
}
</style>
```
:::



### 单个组件内CSS REST

:::RULE

> 为了确保**组件在各个页面下最终呈现的样子是一致的**，需要对组件内CSS进行一定程度上的样式重置。我们推荐的重置方法如下：

```less
.reset {
    display: inline-block;      // 或者 block，特殊情况下用inline
    margin: 0;
    padding: 0;
    border: 0;
    box-sizing: border-box;     // IE8+以后支持，在有`border`的时候外部可以更轻松的控制组件宽高
    font-size: 14px;            //
    line-height: 20px;          //
    outline: 0;                 // 不适用浏览器默认focus状态，可以自定义

    // 重置组件内部的常用标签
    div, span, object, iframe, h1, h2, h3, h4, h5, h6, p,
    pre, a, abbr, address, code, del, dfn, em, img,
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
    span, a, label,
    abbr, address, code, del, dfn, em {
        display: inline;
    }
    img, object, audio, canvas, video {
        display: inline-block;
    }
}
```
:::
