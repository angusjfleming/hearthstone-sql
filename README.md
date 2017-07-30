# hearthstone-sql

[![npm](https://img.shields.io/npm/v/hearthstone-sql.svg)](https://www.npmjs.com/package/hearthstone-sql)

Data fetched from http://hearthstoneapi.com. Data will be stored locally in the same manner as the database is.

## Install

Install the package from npm:

```
npm install hearthstonejson
```

### fetchdata()
Function that takes an api key from http://hearthstoneapi.com/ and fetches current card lists.

### importcards()
Promise that returns true when it has added all cards from the fetched json to the sql db.

### exports.dbpath
The absolute path to the sqlite file for easy use in other files. Will not reference anything if you have never fetched any data.

### exports.jsonpath
The absolute path to the json file for easy use in other files. Will not reference anything if you have never fetched any data.

## Example

```javascript
var hssql = require("hearthstone-sql")

hssql.fetchdata(mashapekey)
.then(() => {
hssql.importcards()
})
```
