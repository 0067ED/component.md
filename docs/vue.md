
## Vue篇


### 使用`v-bind`和`v-on`的快捷方法

:::RULE
Vue 为`v-bind`和`v-on`指令提供了两个快捷方法，虽然这看起来和普通的HTML风格不一样，但是`:`和`@`字符也是可以作为HTML属性名的。

推荐优先使用它们，这可以大大提高写代码的速度以及代码的可读性。

```html
<!-- 错误例子1 -->
<a v-on:click="doSomething"></a>
<!-- 正确例子1 -->
<a @click="doSomething"></a>

<!-- 错误例子2 -->
<a v-bind:href="url"></a>
<!-- 正确例子2 -->
<a :href="url"></a>
```
:::



### 简化`props`的类型

:::RULE

Vue组件的`props`是其最重要的对外API，推荐在设计这些`props`时尽量确保它们的类型简化，不要使用一个非常复杂的对象或者数组。尽量确保其`props`类型是字符串、数字、布尔值之类的基本类型，即使真的需要用到对象和数组，也可以尽量简化其内部项的类型。

这么设计有几个好处：

1. 属性分离，可以使得`props`有更好的语义化、功能更加清晰、易于理解
2. 基本类型的`props`可以直接在模板中作为字面量使用。但如果是对象和函数类型的字面量，那么因为模板每次都会重新生成`props`值，相当于每次渲染时得到的`props`是不同的，会导致`watch`回调函数的不必要触发

但是也并不是所有的组件都一定要使用基本类型的`props`，如果基本类型并不能满足需求或者并不是特别好用，那么还是推荐使用对象或数组类型。

举个例子，`tab`组件的可选tab数据更多是当前页面固定不变的，而`tree`的可选值数据更多的是动态输出（存储在后端）的。所以推荐`tab`组件的可选tab数据使用简单类型，而`tree`使用数组类型。

```html
<!-- 正确例子 -->
<x-tabs value="3">
    <x-tab value="1">首页</x-tab>
    <x-tab value="2">动画</x-tab>
    <x-tab value="3">电影</x-tab>
    <x-tab value="4">电视剧</x-tab>
    <x-tab value="5">其他</x-tab>
</x-tabs>

<x-tree :value="selectedProductionId" :options="productionTree"></x-tree>
```
:::



### `props`和`data`

:::RULE

Vue 的`props`和`data`配置有点相似，但又完全不一样。**`props`其实是组件对外部的属性接口，而`data`是组件内部的可变状态。**

从Vue 2.0开始，`props`便不能通过`this.prop = newValue;`的赋值方式来修改（在debug模式下会报错），必须在组件外部通过属`v-bind/v-model`指令的方式由父组件传输过来新的值。而`data`则是可以在组件内外部来直接用Javascript赋值来修改的，不过很少会在组件外直接修改组件的`data`值。

所以我们已经可以得到如下几个结论：

1. 如果这个状态不应该被组件外部修改，则只使用`data`
2. 如果这个状态应该被组件外部修改
    1. 如果这个状态不会被内部修改（用户交互或其他原因导致），则只使用`props`
    2. 如果这个状态会被内部修改，则需要同时使用`data`和`props`

因为`props`和`data`不能同名，所以必须要区分一下。我们来看一个简单的输入框组件`x-input`的案例。

输入框的值即需要被外部组件控制修改，也同时需要能够让用户键盘输入来修改。所以定义了一个`props`名为`value`被外部使用，再定义一个`currentValue`作为`data`被内部修改。具体结构看下图：

![](./static/vue_props_data.png =400x)

绿色为组件实例，蓝色为`props`，黄色为`data`。初始化时`currentValue`的值会被赋值为`value`的值，并watch `value`值变化，如果外部修改`inputValue`则会立即更新`currentValue`。如果用户输入，则会更新`currentValue`并触发`input`事件然后通知`inputValue`新的值。

这里会有一个死循环在内部，但是由于Vue的watch机制是在值发生变化（===）时才触发回调，所以不存在问题。所以你需要确保一个状态不应该有多个不同的引用值。

```html
<!-- x-container -->
<template>
    <x-input name="username" v-model="inputValue"></x-input>
    <div>{{inputValue}}</div>
</template>
<script>
    export default {
        name: 'XContainer',
        data() {
            return {
                inputValue: '输入框文字'
            };
        }
    }
</script>

<!-- x-input -->
<template>
    <span class="x-input">
        <input class="x-input__txt" :name="name" v-model="currentValue"></input>
    </span>
</template>
<script>
    export default {
        name: 'XInput',
        props: {
            name: String,
            value: [String, Number]
        },
        data() {
            return {
                currentValue: this.value
            };
        },
        watch: {
            value(nextValue) {
                this.currentValue = nextValue;
            },
            currentValue(nextValue) {
                this.$emit('input', nextValue);
            }
        }
    }
</script>
```
:::


### 适度且灵活地使用模板的行内表达式

:::RULE
Vue 内置的模板很强大，设置提供了行内表达式功能。这让过去很麻烦难以处理的情况变得很简单，比如获取列表内点击行的数据。

过去我们需要在渲染列表每一行的时候，把对应数据项的ID或者索引值作为`li`元素的`data-id`属性的值；然后在`ul`元素上绑定点击事件，通过事件代理拿到当前点击的`li`元素；然后获取`li`元素的`data-id`值，然后得到对应的数据项。

而使用Vue之后，只需要通过行内表达式就可以轻易地做到，见右边。

> 虽然行内表达很强大，但是并不推荐在表达式内写太复杂的逻辑。因为它可读性差，且难以复用。
>
> 如果只是用来作为显示，则更推荐使用`computed`；如果是用来做复杂的执行，则推荐把值传给`methods`的方式；

```html
<template>
    <ul>
        <li v-for="item in list" @click="clickedItem = item">
            {{item.name}}
        </li>
    </ul>

    <div>Clicked item name: {{clickedItem.name || ''}}</div>
</template>
<script>
    export default {
        data() {
            return {
                list: [
                    {name: 'Vue'},
                    {name: 'Angular'},
                    {name: 'React'},
                    {name: 'jQuery'}
                ],
                clickedItem: {}
            };
        }
    }
</script>
```
:::


### 尽量少使用`$parent`

:::RULE

在 Vue 中，父子组件的数据传输主要依靠属性的由上向下传输，也就是所谓的单向数据流。当子组件想要向父组件传输数据时，一般使用事件。

你可能会想到`v-model`或者`v-bind.sync`（2.0开时移除但2.3.0+重新增加）的双向绑定，其实它的内部实现机制也是依赖了单向数据流和事件，只是提供了一个简单的快捷方式而已。

当然还有另一个自下向上传输数据的方式，就是`$parent`。但是应该尽量减少它的使用，如果使用了`$parent`则要考虑到不包含指定`$parent`的情况。

> 主要原因是：一个组件应该能独立运行，不应该过度依赖其父组件。这会导致其不能在其他更为复杂的上下文中不能使用。例如父子组件之间插入了另一个其他组件，见右边代码。

不过这个情况也并不绝对，比如右边的`x-form`与`x-form-item`。这两个组件是互相配合使用的，`x-form-item`不需要支持独立使用。但是我们也并不一定要使用`$parent`，更推荐使用`provide && inject`机制。

```html
<!-- 正常例子 -->
<x-form>
    <x-form-item name="username">
        <x-input value="0067ED"></x-input>
    </x-form-item>
    <x-form-item name="password">
        <x-input password></x-input>
    </x-form-item>
    <x-form-item>
        <button type="submit">登录</button>
    </x-form-item>
</x-form>


<!-- 异常例子 -->
<x-form>
    <!-- 加入了水平布局的组件，导致了父子级关系改变 -->
    <x-layout align="horizontal">
        <x-form-item name="username">
            <x-input value="0067ED"></x-input>
        </x-form-item>
    </x-layout>
    <x-layout align="horizontal">
        <x-form-item name="password">
            <x-input password></x-input>
        </x-form-item>
    </x-layout>
    <x-layout align="horizontal">
        <x-form-item>
            <button type="submit">登录</button>
        </x-form-item>
    </x-layout>
</x-form>
```
:::


### `provide` 与 `inject` 实现上下数据传输

:::RULE

在Vue中，直接的父子组件可以通过属性和事件机制轻松地实现数据传输。但是属性和事件机制并不能覆盖到所有的情况：

- 祖孙关系的组件
- 父组件传输数据给`slot`中的子组件

为了解决这些场景的数据传输问题。Vue自2.2.0开始，新增了`provide`与`inject`配置。通过它们可以轻松实现上下级关系的组件之间的数据传输。它的机制与React的context类似。

上级组件通过`provide`配置暴露其指定名称的数据，下级组件通过`inject`配置注入其同名数据。由于`provide`配置支持函数类型，所以甚至可以将上级组件自己的引用传给下级组件。

`provide`与`inject`配置相对隐晦，且名称容易冲突。所以一般只用在组件开发中使用，不建议在业务逻辑开发中使用。

如果浏览器支持ES6（`Symbol`和`Reflect.ownKeys`），那么可以使用`Symbol`作为名称来避免冲突。

```Javascript
var Ancestor = {
    provide() {
        return {
            specialAncestor: this
        };
    },
    // ...
};

var Child = {
    inject: [specialAncestor],
    created() {
        console.log(this.specialAncestor);
    }
};
```
:::



### 非父子组件的数据传输

:::RULE_NO_CODE

之前两条tips中已经提到了有上下级关系的组件之间的数据传输，那么如果是兄弟组件呢？这种情况下由于没有上下级关系，所以不能通过属性、事件或者`provide && inject`来传输数据。

一般有两种方法来解决非上下级关系的组件之间的数据传输。第一种是使用组件共同的祖先组件来实现数据共享。还有一种方法是使用类似[Flux](https://facebook.github.io/flux/)的架构来管理和实现全局的`store`。例如[Vuex](https://github.com/vuejs/vuex)是一个不错的选择。

[![](./static/state.png =600x)](https://vuejs.org/v2/guide/state-management.html#Official-Flux-Like-Implementation)
:::
