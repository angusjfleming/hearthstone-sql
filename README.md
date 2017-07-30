# hearthstone-sql
hearthstone api conveniently turned into an sql db by XIV.


## fetchdata()
Function that takes an api key from http://hearthstoneapi.com/ and fetches current card lists.

## importcards()
Promise that returns true when it has added all cards from the fetched json to the sql db.

## exports.dbpath
The absolute path to the sqlite file for easy use in other files.
