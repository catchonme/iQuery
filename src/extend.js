// jQuery 的深复制和浅复制的函数
// 最重要的点，是如何防止无限递归 Jquery对环的考虑只判断当前节点是否为根节点
/*
    关于拷贝有二个重要的点
    1. 子项是数组还是对象，使用不同的方式复制
    2. 如果是个环，需要跳出
 */
// 深复制 extend(true, destination, source) 浅复制 extend(destination, source)
function extend() {
    var options, name, src, copy, copyIsArray, clone,
        target = arguments[ 0 ] || {},
        i = 1,
        length = arguments.length,
        deep = false;
    // Handle a deep copy situation
    if ( typeof target === "boolean" ) { // 第一个参数如果是布尔值，那么就是设置是否为深复制，默认是浅复制
        deep = target;
        // Skip the boolean and the target
        target = arguments[ i ] || {};  // 这时候默认的设置就是第一个了
        i++;
    }

    // Handle case when target is a string or something (possible in deep copy)
    // 默认设置如果不是 {} 或者不是 function ,就设置为 {}, 防止填的参数是随意设置的
    if ( typeof target !== "object" && !isFunction( target ) ) {
        target = {};
    }

    // Extend jQuery itself if only one argument is passed
    if ( i === length ) { // 这时候 i==1，只有一个参数，
        target = this;
        i--; // i 重新设置为 0
    }

    for ( ; i < length; i++ ) {
        // Only deal with non-null/undefined values
        // 只处理不是 null/undefined 的值
        if ( ( options = arguments[ i ] ) != null ) {
            // Extend the base object
            for ( name in options ) {
                src = target[ name ]; // src 是目标对象的值 target 就是 parent
                copy = options[ name ]; // copy 是原对象的值

                /* Prevent never-ending loop
                阻止无限循环，如果 target 和 obj 的子项一样，就跳出当前循环
                var _parent = {name:"parent"};
                var _child = {name:"child", parent:_parent};
                像上面这种情况，使用 $.extend(true, _parent, _child) 得到的结果是 {name:"child"}
                如果再加上 _parent["child"] = _child; 这个条件，就无法阻止循环调用
                */
                if ( target === copy ) {
                    continue;
                }

                // Recurse if we're merging plain objects or arrays
                // 如果是深复制的情况，并且子项是数组或是对象，就需要继续递归
                // 如果是深复制，并且自定义的子项 name 也有，而且自定义子项是 对象或者是数组
                if ( deep && copy && ( isPlainObject( copy ) ||
                        ( copyIsArray = Array.isArray( copy ) ) ) ) {
                    if ( copyIsArray ) {
                        copyIsArray = false;
                        // 默认设置中，有 当前循环项的 name
                        clone = src && Array.isArray( src ) ? src : [];
                    } else {
                        clone = src && isPlainObject( src ) ? src : {};
                    }
                    // Never move original objects, clone them
                    target[ name ] = extend( deep, clone, copy );
                    // Don't bring in undefined values
                } else if ( copy !== undefined ) {
                    // 这里，就是浅复制了，只要子项不是 undefined 就可以了
                    // 使用 自定义设置的 name 覆盖 默认设置的子项
                    target[ name ] = copy;
                }
            }
        }
    }
    // Return the modified object
    return target;
};

/** 依赖 */

// 判定类型的函数 jQuery
function type(obj) {
    var  class2type = {};
    var core_toString = class2type.toString;
    var types = ['Boolean', 'Number', 'String', 'Function', 'Array', 'Date', 'RegExp', 'Object', 'Error']
    types.forEach(function(name){
        class2type[ "[object "+name+"]" ] = name.toLowerCase();
    })
    if (obj == null ) {
        return String(obj);
    }
    return typeof obj === "object" || typeof obj === "function" ? class2type[ core_toString.call(obj) ] || "object" : typeof obj;
}

// 判断类型是否为函数
function isFunction( func )
{
    return type( func ) == 'function';
}

// 判定是否是数字 jQuery
function isNumeric(obj) {
    return !isNaN( parseInt( obj ) ) && isFinite( obj );
}

// 判断对象是否为空
function isEmptyObject( obj ) {
    var name;
    for (name in obj) {
        return false;
    }
    return true;
}

// 检查一个对象是否包含任何属性，检查的必须是一个 Object 的实例
/*
    isPlainObject(""); // false
    isPlainObject({}); // true
    isPlainObject(new Object()); // true
    isPlainObject(object.create(null)) // true
 */
function isPlainObject( obj ) {
    var class2type = {};
    var toString = class2type.toString;
    var getProto = Object.getPrototypeOf;
    var hasOwn = class2type.hasOwnProperty;
    var fnToString = hasOwn.toString; // toString 函数
    var ObjectFunctionString = fnToString.call( Object );

    var proto, Ctor;

    // Detect obvious negatives
    // Use toString instead of jQuery.type to catch host objects
    // 直接排除最明显的选项，如果 obj 为 数值/字符串 等有值的，或者最明显的 toString.call(obj) 都不符合，就直接返回 false
    if ( !obj || toString.call( obj ) !== "[object Object]" ) {
        return false;
    }

    proto = getProto( obj );

    // Objects with no prototype (e.g., `Object.create( null )`) are plain
    // 如果没有 Object.getPrototypeOf() 为空，也就是没有设置任何的
    if ( !proto ) {
        return true;
    }

    // Objects with prototype are plain iff they were constructed by a global Object function
    // prototype 上有 constructor, 使用 Object.create() 创建对象后， proto.constructor 为 function
    Ctor = hasOwn.call( proto, "constructor" ) && proto.constructor;
    // prototype 的 constructor 为 function
    return typeof Ctor === "function" && fnToString.call( Ctor ) === ObjectFunctionString;
}