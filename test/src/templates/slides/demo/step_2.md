---
order: 2
---
### Set up your configuration

```js
assemble.option({ ... });
assemble.layouts('');
assemble.partials('');
assemble.helpers('');

assemble.task('my-bundle', function () {
  assemble.src('')
    .pipe(assemble.dest(''));
});
```