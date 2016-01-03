var world = [];
var items = [];
var roomId, info, exitList;

var directions = {
	"n": "n",
	"no": "n",
	"nor": "n",
	"nort": "n",
	"north": "n",
	"northw": "nw",
	"northwe": "nw",
	"northwes": "nw",
	"northwest": "nw",
	"nw": "nw",
	"northe": "ne",
	"northea": "ne",
	"northeas": "ne",
	"northeast": "ne",
	"ne": "ne",
	"s": "s",
	"so": "s",
	"sou": "s",
	"sout": "s",
	"south": "s",
	"southw": "sw",
	"southwe": "sw",
	"southwes": "sw",
	"southwest": "sw",
	"sw": "sw",
	"southe": "se",
	"southea": "se",
	"southeas": "se",
	"southeast": "se",
	"se": "se",
	"e": "e",
	"ea": "e",
	"eas": "e",
	"east": "e",
	"w": "w",
	"we": "w",
	"wes": "w",
	"west": "w",
	"d": "d",
	"do": "d",
	"dow": "d",
	"down": "d",
	"u": "u",
	"up": "u"
};

var directionsToLong = {
	"n": "north",
	"s": "south",
	"e": "east",
	"w": "west",
	"nw": "northwest",
	"ne": "northeast",
	"sw": "southwest",
	"se": "southeast",
	"d": "down",
	"u": "up"
}

var directionsShort = ["n", "s", "e", "w", "nw", "ne", "sw", "se", "u", "d"];

try {
	require('fs').readdirSync(settings.botLocation + '/gaemfiles/world').forEach(function(file) {
	  if (file.match(/\.wrld.json$/) !== null) {
		var name = file.replace('.wrld.json', '');
		world[name] = require(settings.botLocation + '/gaemfiles/world/' + file);
	  }
	});
} catch(e) {
	console.log("Required world files not found. " + e);
}

try {
	require('fs').readdirSync(settings.botLocation + '/gaemfiles/items').forEach(function(file) {
	  if (file.match(/\.item.json$/) !== null) {
		var name = file.replace('.item.json', '');
		items[name] = require(settings.botLocation + '/gaemfiles/items/' + file);
	  }
	});
} catch(e) {
	console.log("Required item files not found. " + e);
}

try {
	settings = require("../../settings.json");
} catch(e) {
	//No settings file found. Terminating.
	console.log("Settings failed to load in character.js. " + e);
}

try {
	character = require(settings.botLocation.toString() + "/gaemfiles/character.json");
} catch(e) {
	console.log("Character set failed to load. " + e);
	character = {};
}

gaemfuncs = {
}

gaemcmds = {
	"go": {
		usage: "<direction>",
		description: "Used to go in a direction. Direction of exit can be shortened.",
		process: function (bot,msg,suffix) {
			if (character[msg.author.id].position == "sitting") {
				bot.sendMessage(msg.channel, msg.author + " You have to .stand first!");
				return;
			}
			if (!suffix) {
				bot.sendMessage(msg.channel, msg.author + " Which direction?");
				return;
			}
			var lookFile = character[msg.author.id].currentAt[0];
			roomId = character[msg.author.id].currentAt;
			if (world[lookFile][roomId]) {
				var startHere = world[lookFile][character[msg.author.id].currentAt];
			} else {
				var startHere = world["0"]["000"];
			}
			var goHere = suffix.toLowerCase();
			if (directions[goHere]) {
				var shortGoHere = directions[goHere];
			} else {
				bot.sendMessage(msg.channel, msg.author + " There's no such direction!");
				return;
			}
			if (startHere.exits[shortGoHere] && startHere.exits[shortGoHere].hasDoor && startHere.exits[shortGoHere].hasDoor == "closed") {
				bot.sendMessage(msg.channel, msg.author + " You bump into a closed door!");
				return;
			}
			if (startHere.exits[shortGoHere] && startHere.exits[shortGoHere].linksTo) {
				var endHere = startHere.exits[shortGoHere].linksTo;
			}
			if (endHere && shortGoHere) {
				for (var i in character) {
					if (character[i].userChannel && character[i].currentAt == character[msg.author.id].currentAt
					&& character[i] != character[msg.author.id]) {
						bot.sendMessage(character[i].userChannel, msg.author.username + " leaves " + directionsToLong[shortGoHere] + ".");
					} else if (character[i].userChannel && character[i].currentAt == endHere && character[i] != character[msg.author.id]) {
						bot.sendMessage(character[i].userChannel, msg.author.username + " enters.")
					}
				}
				character[msg.author.id].currentAt = endHere;
				lookFile = endHere[0];
				info = world[lookFile][endHere];
				var charsList = " ";
				for (var i = 0; i < bot.users.length; i++) {
					if (character[bot.users[i].id] && character[bot.users[i].id].currentAt == endHere
					&& bot.users[i].id != msg.author.id && character[bot.users[i].id].onOrOff == "online") {
						charsList += bot.users[i].username + ", "
						var charPos = character[bot.users[i].id].position;
						if (charPos) {
							if (charPos == "standing") {
								charsList += "standing around.\n";
							} else if (charPos == "sitting") {
								charsList += "sitting down.\n"
							} else {
								charsList += "just... here.\n"
							}
						}
					}
				}
				var exitList = " ";
				if (info.exits) {
					for (var i = 0; i < directionsShort.length; i++) {
						if (info.exits[directionsShort[i]] && info.exits[directionsShort[i]].hidden != true) {
							exitList += directionsToLong[directionsShort[i]] + "\t";
						}
					}
				} else if (exitList = " ") {
					exitList = "There aren't any exits!!! D:"
				}
				if (charsList == " ") {
					charsList = "no one!";
				}
				var listItems = "\nIn the room, you see:\n";
				if (info.roomHas) {
					for (var i in info.roomHas) {
						var itemFile = info.roomHas[i].itemNumber[0];
						var itemNum = info.roomHas[i].itemNumber;
						listItems += "a " + items[itemFile][itemNum].shortDesc + "\t";
					}
				}
				character[msg.author.id].area = info.area
				bot.sendMessage(msg.channel, msg.author + "\n" + info.shortDesc + "\n\n" + info.longDesc + "\n\nLooking around, you see\n" + charsList + "\n\nThe exits are:\n" + exitList);
				if (listItems != "\nIn the room, you see:\n") {
					bot.sendMessage(msg.channel, listItems);
				}
			} else if (shortGoHere && !endHere) {
				bot.sendMessage(msg.channel, msg.author + " You can't go that way!");
			}
		}
	}
}

module.exports = [ gaemfuncs, gaemcmds ];
