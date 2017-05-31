
## 样式篇

### 组件大小所见即所得

:::RULE

一般情况下，**组件所能看到的大小即是它的真实大小**。尽量不要在组件上使用看不见的边界，例如在外部加入`margin`样式。

这样做的好处是：从设计师的角度出发去设计你的代码，设计师给到的标注稿的间距标注一般不会考虑组件外部的透明边界。而组件的使用者（其他开发同学）可能不知道这样的边界的存在，就会造成一些返工。

所以为了提高组件的易用性，一般推荐组件所能看到的大小即是它的真实大小。

```html
<template>
    <span class="box"></span>
    <span class="box"></span>
    <span class="box"></span>
</template>
<style>
.module-css .rule-1 {
    // 组件样式
    .rule-demo .box {
        display: inline-block;
        margin: 0;
        width: 40px;
        height: 40px;
        border: 1px solid #228ae6;
        background: #4dadf7;
    }

    // 使用组件时候的样式
    .rule-demo .box {
        margin-right: 10px;
    }
}
</style>
```
:::

:::RULE

当然也会存在一些例外情况，比如说组件的鼠标响应区域比组件的实际展示区域要大。

这时候我们推荐和设计师做好充分地沟通，确认设计稿中的标注要考虑到这些隐藏边界，或者设计师根本不关心这些隐藏边界导致的几像素偏差。以简化组件使用者在使用此组件时候的难度。

```html
<template>
    <span class="box"></span>
    <span class="box"></span>
    <span class="box"></span>
</template>
<style>
.module-css .rule-2 {
    // 组件样式
    .box {
        display: inline-block;
        margin: 0;
        padding: 5px;
    }
    .box::after {
        content: '';
        display: block;
        width: 40px;
        height: 40px;
        background: #4dadf7;
        border: 1px solid #228ae6;
    }
    .box:hover::after {
        background: #228ae6;
    }
    // 使用组件时候的样式
    .box {
        margin-right: 10px - 5px * 2;
    }
}
</style>
```
:::



### 使用`box-sizing`

:::RULE

组件的根节点样式优先使用`box-sizing:border-box;`，这样在组件外部就可以轻松控制组件的宽高。不需要考虑根节点的`border`和`padding`值。

```html
<template>
    <span class="box">200x200</span>
</template>
<style>
.module-css .rule-3 {
    // 组件样式
    .rule-demo .box {
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
    .rule-demo .box {
        width: 200px;
        height: 200px;
    }
}
</style>
```
:::



### 避免CSS类选择器冲突

:::RULE

为了避免组件之间或组件与使用页面之间的CLASS类冲突，导致CSS样式的冲突。推荐使用[BEM](http://getbem.com/naming/)、[SUIT](https://suitcss.github.io/)、[SMACSS](https://smacss.com/)之类的CLASS命名规范。当然也可以自己规范一套命名规范。

使用BEM或SUIT规范时，推荐使用[postcss-bem](https://github.com/kezzbracey/postcss-bem)插件。它提供了@规则，可以简化CSS代码书写。

```less
// BEM规范
@component-namespace v {
    @b input {
        // TODO
        @m search {
            // TODO
        }
        @e placeholder {
            // TODO
        }
    }
}

// 自定义规范
.input {
    // TODO
}
.input-search {
    // TODO
}
.input-placeholder {
    // TODO
}

```
:::



### 使用`currentColor`和`color:inherit`

:::RULE

如果组件颜色较为单一，可以使用`currentColor`来设置颜色。这样在组件外部就可以通过设置根节点的`color`属性来轻松控制组件的颜色。

如果需要设置颜色的节点不是根节点，还可以和`color:inherit`配合使用，继承根节点的`color`值。

```html
<template>
    <span class="x-button">
        <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
        width="24px" height="24px" viewBox="0 0 24 24" style="enable-background:new 0 0 24 24;" xml:space="preserve">
            <g>
                <path d="M12,0C5.373,0,0,5.373,0,12s5.373,12,12,12s12-5.373,12-12S18.627,0,12,0z M12,22
                C6.477,22,2,17.521,2,12C2,6.477,6.477,2,12,2c5.523,0,10,4.478,10,10C22,17.521,17.523,22,12,22z"/>
                <path d="M12.5,6h-1C11.224,6,11,6.224,11,6.5v7c0,0.275,0.224,0.5,0.5,0.5h1c0.275,0,0.5-0.225,0.5-0.5v-7
                C13,6.224,12.775,6,12.5,6z"/>
                <path d="M12.5,16h-1c-0.276,0-0.5,0.225-0.5,0.5v1c0,0.275,0.224,0.5,0.5,0.5h1c0.275,0,0.5-0.225,0.5-0.5
                v-1C13,16.225,12.775,16,12.5,16z"/>
            </g>
        </svg>
        按钮
    </span>
</template>
<style>
// 组件样式
@component-namespace x {
    @b button {
        display: inline-block;
        margin: 0;
        padding: 9px 0;
        width: 80px;
        height: 40px;
        line-height: 20px;
        font-size: 14px;
        vertical-align: middle;
        text-align: center;
        color: #c92a2a;
        cursor: pointer;
        border: 1px solid currentColor;
        background: transparent;
        box-sizing: border-box;

        svg {
            color: inherit;
            fill: currentColor;
            width: 16px;
            height: 16px;
            display: inline-block;
            vertical-align: -3px;
        }
    }
}

.module-css .rule-5 {
    // 使用组件时候的样式
    .x-button {
        color: #4dadf7;

        &:hover {
            color: #228ae6;
        }
    }
}
</style>
```
:::



### 组件尽量自适应高宽

:::RULE

组件的高宽很可能会被修改，此时如果组件内部是自适应变化的，那么就可以大大提高组件的易用性。组件的使用者在外部只需要通过CSS的`width`和`height`就可以方便的修改组件的高宽，通常会配合`box-sizing:border-box`一起使用。

在开发组件时一定要把高宽变化的情况考虑在内，尽量做到组件内部自适应高宽。

```html
<template>
    <span class="x-input x-input--search">
        <svg version="1.1" x="0px" y="0px"
        width="20px" height="20px" viewBox="0 0 20 20" xml:space="preserve">
        <path style="fill-rule:evenodd;clip-rule:evenodd;" d="M17.696,16.227l-2.531-2.532c2.5-2.748,2.431-6.999-0.223-9.653
        c-2.734-2.733-7.166-2.733-9.899,0c-2.734,2.734-2.734,7.166,0,9.9c2.306,2.306,5.819,2.659,8.503,1.073l2.681,2.682
        c0.406,0.406,1.063,0.406,1.469,0S18.102,16.633,17.696,16.227z M6.457,12.527c-1.953-1.952-1.953-5.118,0-7.071
        s5.118-1.953,7.071,0c1.952,1.953,1.952,5.119,0,7.071C11.575,14.48,8.409,14.48,6.457,12.527z"/>
        </svg>
        <input class="x-input__txt"></input>
    </span>
</template>
<style>
// 组件样式
@component-namespace x {
    @b input {
        display: inline-block;
        margin: 0;
        padding: 0 10px;
        width: 400px;
        height: 40px;
        line-height: 40px;
        vertical-align: middle;
        text-align: center;
        color: #495057;
        border: 2px solid currentColor;
        background: #FFF;
        box-sizing: border-box;

        @m search {
            padding-left: 40px;
        }

        svg {
            margin: 8px 0 0 -30px;
            float: left;
            width: 20px;
            height: 20px;
            fill: currentColor;
            color: inherit;
        }

        @e txt {
            display: block;
            width: 100%;
            height: 100%;
            padding: 0;
            border: 0;
            font-size: 20px;
            color: inherit;
            outline: none;
        }
    }
}

.module-css .rule-6 {
    // 使用组件时候的样式
    .x-input {
        width: 300px;
    }
}
</style>
```
:::



### 单个组件内CSS REST

:::RULE

为了确保**组件在各个页面下最终呈现的样子是一致的**，需要对组件内CSS进行一定程度上的样式重置。

我们推荐的为根节点添加`display`样式，以确保其样式的稳定性。对于块级组件`display`值是`block`；对于行内组件值是`inline-block`；对于占位类型的组件值是`inline`；所谓的占位类型，就是其本身不提供任何样式，只是留一个标签在那里做占位。

CSS RESET可以参考右边例子。

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
