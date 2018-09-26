const database = require("sqlite");
const fs = require("fs");
const unirest = require("unirest");
const path = require('path')
var setarray = ["Basic", "Classic", "Hero Skins", "Promo", "Hall of Fame", "Naxxramas", "Goblins vs Gnomes", "Blackrock Mountain", "The Grand Tournament", "The League of Explorers", "Whispers of the Old Gods", "One Night in Karazhan", "Mean Streets of Gadgetzan", "Journey to Un'Goro", "Knights of the Frozen Throne", "Kobolds & Catacombs", "The Witchwood", "The Boomsday Project"];

exports.fetchdata = function(mashapekey) {
    return new Promise((resolve, reject) => {
        unirest.get("https://omgvamp-hearthstone-v1.p.mashape.com/cards")
            .header("X-Mashape-Key", mashapekey)
            .end(function(result) {
                fs.unlink(__dirname + "\\cardinfo.json", function(err) {});
                fs.writeFile(__dirname + "\\cardinfo.json", JSON.stringify(result.body), (err) => {
                    if (err) reject("Error whilst retrieving / saving data.");
                    else resolve("Saved successfully.");
                });
            })
    });
};

exports.importcards = function() {
    return new Promise((resolve, reject) => {
        database.open(__dirname + "\\carddb.sqlite", {
            Promise
        }).then(hssqlcarddb => {
            hssqlcarddb.run("ATTACH (?) as carddb", `${__dirname}\\carddb.sqlite`)
            var cardinfo = JSON.parse(fs.readFileSync(__dirname + '\\cardinfo.json', 'utf8'));
            hssqlcarddb.run(`
    CREATE TABLE IF NOT EXISTS cardinfo ( cardID TEXT, name TEXT, cardSet TEXT, type TEXT, cardText TEXT, playerClass TEXT, locale TEXT, mechanics TEXT, faction TEXT, attack INTEGER, health INTEGER, img TEXT, imgGold TEXT, cost INTEGER, rarity TEXT, flavor TEXT, artist TEXT, collectible INTEGER, race TEXT, durability INTEGER, elite INTEGER, howToGet TEXT, howToGetGold TEXT, PRIMARY KEY(cardID) )
    `).then(() => {
                hssqlcarddb.run("DELETE FROM cardinfo")
                var itemsProcessed = 0;

                setarray.forEach(function(set) {
                    cardinfo[set].forEach(function(element) {
                        hssqlcarddb.run("INSERT INTO cardinfo (cardID, name, cardSet, type, cardText, playerClass, locale, mechanics, faction, attack, health, img, imgGold, cost, rarity, flavor, artist, collectible, race, durability, elite, howToGet, howToGetGold) VALUES( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [element.cardId, element.name, element.cardSet, element.type, element.text, element.playerClass, element.locale, JSON.stringify(element.mechanics), element.faction, element.attack, element.health, element.img, element.imgGold, element.cost, element.rarity, element.flavor, element.artist, element.collectible, element.race, element.durability, element.elite, element.howToGet, element.howToGetGold]).then(() => {
                                if (set === setarray[setarray.length - 1] && cardinfo[set][cardinfo[set].length - 1].cardId === element.cardId) {
                                    hssqlcarddb.close();
                                    resolve(true);
                                }
                            })
                            .catch((err) => {
                                hssqlcarddb.close();
                                reject(err);
                            });
                    })
                })

            })
        })
    })
}
exports.dbpath = __dirname + "\\carddb.sqlite";
exports.jsonpath = __dirname + "\\cardinfo.json";
