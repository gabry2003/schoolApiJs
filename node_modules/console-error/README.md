# console.error :

 ![console-error demo](https://raw.githubusercontent.com/rathath/bucket/master/img/console-error-node.png)

- The purpose of this module is not to give many options for logging , it is just give you lightweight the missing API of console : which is here `console.error`.

- No need documentation, because `console.error` takes the same arguments as `console.log` . However `console.error` will be displayed on terminal like above.

# Install :

```
npm install console-error --save;
```

# How to use :

```js
require('console-error');
// or in babel: import * from 'console-error';

console.error(new Date()); // log time now
console.error({firstname: "Abdesslem", age:32}) ; // log Object
console.error(new Date,[4, 65, 9], {a:"b"}); // I told you : it is like console.log
```



# Related modules :

Use also :

- [**console.info**](https://www.npmjs.com/package/console-info)

- [**console.warn**](https://www.npmjs.com/package/console-warn)

```
npm install console-info  console-warn --save;
```
