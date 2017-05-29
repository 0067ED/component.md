
## Javascript篇


### 使用`const`和`let`

:::RULE

ES6 现在支持了`const`和`let`关键字，相比`var`它们支持了块级作用域。并且`const`用于常量的声明，`let`用于变量的声明。它们本身有更加明确的用途，对代码的可读性也有一定的提高。

```javascript
// 错误例子1
function getValueByCode(code) {
    var VALUE_MAP = {
        200: 'success',
        300: 'REDIRECT',
        400: 'CLIENT ERROR',
        500: 'SERVER ERROR'
    };
    return VALUE_MAP[code];
}
// 正确例子1
function getValueByCode(code) {
    const VALUE_MAP = {
        200: 'success',
        300: 'REDIRECT',
        400: 'CLIENT ERROR',
        500: 'SERVER ERROR'
    };
    return VALUE_MAP[code];
}


// 错误例子2
function getAncestor(component, ancestorName) {
    var parent = component.$parent;
    while (parent.$options.name !== ancestorName) {
        parent = parent.$parent;
    }
    return parent;
}
// 正确例子2
function getAncestor(component, ancestorName) {
    let parent = component.$parent;
    while (parent.$options.name !== ancestorName) {
        parent = parent.$parent;
    }
    return parent;
}
```
:::

### 减少使用`else`关键字

:::RULE

我们在编写javascript代码时，会经常用到`if else`来处理分支逻辑。当分支逻辑只有两层时，这不是什么问题。但当分支逻辑越来越多时，就会出现很多层的`if else`嵌套。这会大大降低代码的可读性。

推荐按照如下规则来尽量减少`else`关键字的使用：

- 如果代码逻辑有两个以上的分支
    - 如果代码逻辑简单只是返回对应值的匹配值，则推荐使用字典对象；
    - 如果只有一条分支逻辑负责其余都很简单，则推荐使用`if return`；
    - 如果有两条以上分支逻辑复杂，推荐使用`switch`关键字（如果分支逻辑非常复杂推荐）；
- 如果代码逻辑只有两个分支
    - 如果分支逻辑简单，则优先尝试使用条件运算符；
    - 如果分支逻辑复杂，则推荐使用`if return`；

PS：在代码逻辑只有两个分支并且使用`if return`时，推荐把简单的分支逻辑立即先`return`掉。把复杂的逻辑放在后面，这样复杂逻辑的缩进会少。代码的可读性会进一步提高。

```javascript
// 错误样例1：两个分支，且逻辑简单
function hasValue(value) {
    if (value && (value.length != null)) {
        return !!value.length;
    }
    else {
        return !!value;
    }
}
// 正确样例1：使用条件运算符
function hasValue(value) {
    // 增加一个有意义的变量名，提高代码可读性
    const isStringOrArray = value && (value.length != null);
    return !!(isStringOrArray ? value.length : value);
}


// 错误样例2：两个以上分支，且逻辑简单
function getType(code) {
    if (code === 1) {
        return 'success';
    }
    else if (code === 2) {
        return 'client error';
    }
    else if (code === 3) {
        return 'server error';
    }
    else {
        return 'unknown error';
    }
}
// 正确样例2
function getType(code) {
    // 此样例中也可以使用数组来做map，不过对象支持更普遍一些
    const CODE_MAP = {
        1: 'success',
        2: 'client error',
        3: 'server error'
    };
    return CODE_MAP[code] || 'unknown error';
}


// 错误样例3：两个分支，且只有一个分支逻辑复杂
function getConfig(id, callback) {
    if (id != null) {
        const params = {
            // TODO calculate params
        };
        $.post('/config', params, function (data) {
            if (data.success) {
                callback(data.data);
            }
            else {
                callback(null);
            }
        });
    }
    else {
        callback(null);
    }
}
// 正确样例3
function getConfig(id, callback) {
    if (id == null) {
        callback(null);
        return;
    }

    const params = {
        // TODO calculate params
    };
    $.post('/config', params, function (data) {
        callback(data.success ? data.data : null);
    });
}


// 错误样例4：两个以上分支，且有多个分支逻辑复杂
function calc(position, relative) {
    if (position === 'top' || position === 'bottom') {
        calcVertical(relative);
    }
    else if (position === 'left' || position === 'right') {
        calcHorizontal(relative);
    }
    else {
        // TODO
    }
}
// 正确样例4
function calc(position, relative) {
    switch (position) {
        case 'top':
        case 'bottom':
            calcVertical(relative);
            break;
        case 'left':
        case 'right':
            calcHorizontal(relative);
            break;
        default:
            // TODO
            break;
    }
}
```
:::



### 使用`map/filter/reduce`替代`for`循环

:::RULE

在ES5之前，我们操作Javascript数组的常用方式是使用`for`循环。这是一种传统且非常高效的做法。在ES5之后，Javascript的数组引入了很多的原生方法，例如`Array.prototype.forEach`方法。这些特性的支持程度可以看[这个表](http://kangax.github.io/compat-table/es5/)。

于是大家开始争论使用`for`循环还是`forEach`方法，甚至有人做了[性能对比](https://jsperf.com/for-vs-foreach/75)。`for`循环的优势在于：性能好，并且能够通过`break`关键字快速退出。 `forEach`方法的优势在于：可读性高，易于使用（天然带有闭包）。

这里要说的不是`for`循环 VS `forEach`方法，而是`for`循环 VS `map/filter/reduce`方法。通过下面这张图你可以清楚地知道它们的作用。

[![](./static/map_filter_reduce.png)](https://twitter.com/apasella/status/741168882958880768)

虽然`for`循环有着更好的性能，但是只要不是超大型数组，性能优势并不明显。相反`map/filter/reduce`方法却可以大大提高代码的可读性，所以更推荐使用他们。

```javascript
// 错误例子1
function getValues(opts) {
    const values = [];
    for (let i = 0; i < opts.length; i++) {
        values.push(opts[i].value);
    }
    return values;
}
// 正确例子1
function getValues(opts) {
    return opts.map((opt) => opt.value);
}


// 错误例子2
function getSelectedOptions(opts) {
    const selectedOpts = [];
    for (let i = 0; i < opts.length; i++) {
        if (opts[i].selected) {
            selectedOpts.push(opts[i]);
        }
    }
    return selectedOpts;
}
// 正确例子2
function getSelectedOptions(opts) {
    return opts.filter((opt) => opt.selected);
}


// 错误例子3
function sumSelectedValue(opts) {
    let sum = 0;
    for (let i = 0; i < opts.length; i++) {
        if (opts[i].selected) {
            sum += opts[i].value;
        }
    }
    return sum;
}
// 正确例子3
function sumSelectedValue(opts) {
    return opts
        .filter((opt) => opt.selected)
        .reduce((result, opt) => result + opt.value, 0);
}
```
:::
