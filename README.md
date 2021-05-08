
# TL;DR

Create a list of a given path:

<!-- `━┃┏┓┗┛┣┫┳┻╋` -->

```
folder/
   ┣━━ foo/
   ┃    ┗━━ bar/
   ┃         ┗━━ javascript.js
   ┃         ┗━━ python.py
   ┃         ┗━━ database.sql
   ┃
   ┣━━ paz/
   ┃
   ┗━━ ska/
        ┗━━ ignore.txt
```

```js
const getTree = require("@linkcs/directory-tree");

getTree("./folder");
// {
//   foo: {
//     bar: {
//       "javascript.js": null,
//       "python.py": null,
//       "database.sql": null
//     }
//   },
//   ska: {
//     "ignore.txt": null
//   }
// }

getTree("./folder", { extensions: ".py" });
// {
//   foo: {
//     bar: {
//       "javascript.js": null,
//       "python.py": null,
//       "database.sql": null
//     }
//   },
//   ska: {
//     "ignore.txt": null
//   }
// }

getTree("./folder", { includeFiles: false });
// {
//   foo: {
//     bar: { }
//   },
//   ska: { }
// }
```

## Options


| option           | description                            | default value  |
| ---------------- | -------------------------------------- | -------------- |
| extensions       | Only include files of these extensions | '.*'           |
| ignoreExtensions | Exclude files of these extensions      | null           |
| ignoreFiles      | Regex to ignore certain files          | '\\..*'        |
| ignoreFolders    | Regex to ignore certain folders        | 'node_modules' |
| includeFiles     | Should list files in the tree          | true           |
