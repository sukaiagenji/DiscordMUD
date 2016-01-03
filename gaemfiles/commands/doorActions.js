var world = [];
var roomId;

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

var directionsOpposite = {
	"n": "s",
	"s": "n",
	"e": "w",
	"w": "e",
	"nw": "se",
	"ne": "sw",
	"sw": "ne",
	"se": "nw",
	"d": "u",
	"u": "d"
}

try {
	require('fs').readdirSync(settings.botLocation + '/gaemfiles/world').forEach(function(file) {
	  if (file.match(/\.wrld.json$/) !== null) {
		var name = file.replace('.wrld.json', '');
		world[name] = require(settings.botLocation + '/gaemfiles/world/' + file);
	  }
	});
	console.log("World files loaded.");
} catch(e) {
	console.log("Required world files not found. " + e);
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






	"open": {
		usage: "<direction>",
		description: "Used to open an unlocked door in a given direction.",
		process: function (bot,msg,suffix) {
			if (!suffix) {
				bot.sendMessage(msg.channel, msg.author + " What direction?");
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
			if (startHere.exits[shortGoHere] && startHere.exits[shortGoHere].linksTo) {
				var endHere = startHere.exits[shortGoHere].linksTo;
			}
			if (startHere.exits[shortGoHere] && startHere.exits[shortGoHere].hasDoor) {
				var exitDoor = startHere.exits[shortGoHere].hasDoor;
			} else {
				bot.sendMessage(msg.channel, msg.author + " There is no door there!");
				return;
			}
			if (endHere && shortGoHere && exitDoor) {
				if (exitDoor == "closed" && (!startHere.exits[shortGoHere].hasDoor.hasDoorMagic || startHere.exits[shortGoHere].hasDoor.hasDoorMagic == false)) {
					startHere.exits[shortGoHere].hasDoor = "open";
					var endFile = endHere[0];
					for (var i in world[endFile][endHere].exits) {
						if (world[endFile][endHere].exits[i].linksTo == roomId && (!world[endFile][endHere].exits[i].hasDoor.hasDoorMagic || world[endFile][endHere].exits[i].hasDoor.hasDoorMagic == false)) {
							world[endFile][endHere].exits[i].hasDoor = "open";
						}
					}
					for (var i in character) {
						if (character[i].userChannel && character[i].currentAt == character[msg.author.id].currentAt && character[i] != character[msg.author.id]) {
							bot.sendMessage(character[i].userChannel, msg.author.username + " opened the door leading " + directionsToLong[shortGoHere] + "!");
						}
						if (character[i].userChannel && character[i].currentAt == endHere && character[i] != character[msg.author.id]) {
							bot.sendMessage(character[i].userChannel, "Someone opened the door leading " + directionsToLong[directionsOpposite[shortGoHere]] + "!");
						}
					}
					bot.sendMessage(msg.channel, msg.author + " The door leading " + directionsToLong[shortGoHere] + " is now open!")
				} else if (exitDoor == "open") {
					bot.sendMessage(msg.channel, msg.author + " This door is already open!!!")
				}
			}
		}
	},
	"close": {
		usage: "<direction>",
		description: "Used to close an unlocked door in a given direction.",
		process: function (bot,msg,suffix) {
			if (!suffix) {
				bot.sendMessage(msg.channel, msg.author + " What direction?");
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
			if (startHere.exits[shortGoHere] && startHere.exits[shortGoHere].linksTo) {
				var endHere = startHere.exits[shortGoHere].linksTo;
			} else {
				bot.sendMessage(msg.channel, msg.author + " There is no exit there!");
				return;
			}
			if (startHere.exits[shortGoHere].hasDoor) {
				var exitDoor = startHere.exits[shortGoHere].hasDoor;
			} else {
				bot.sendMessage(msg.channel, msg.author + " There is no door there!");
				return;
			}
			if (endHere && shortGoHere && exitDoor) {
				if (exitDoor == "open" && (!startHere.exits[shortGoHere].hasDoor.hasDoorMagic || startHere.exits[shortGoHere].hasDoor.hasDoorMagic == false)) {
					startHere.exits[shortGoHere].hasDoor = "closed";
					var endFile = endHere[0];
					for (var i in world[endFile][endHere].exits) {
						if (world[endFile][endHere].exits[i].linksTo == roomId && (!world[endFile][endHere].exits[i].hasDoor.hasDoorMagic || world[endFile][endHere].exits[i].hasDoor.hasDoorMagic == false)) {
							world[endFile][endHere].exits[i].hasDoor = "closed";
						}
					}
					for (var i in character) {
						if (character[i].userChannel && character[i].currentAt == character[msg.author.id].currentAt && character[i] != character[msg.author.id]) {
							bot.sendMessage(character[i].userChannel, msg.author.username + " closed the door leading " + directionsToLong[shortGoHere] + "!");
						}
						if (character[i].userChannel && character[i].currentAt == endHere && character[i] != character[msg.author.id]) {
							bot.sendMessage(character[i].userChannel, "Someone closed the door leading " + directionsToLong[directionsOpposite[shortGoHere]] + "!");
						}
					}
					bot.sendMessage(msg.channel, msg.author + " The door leading " + directionsToLong[shortGoHere] + " is now closed!")
				} else if (exitDoor == "open") {
					bot.sendMessage(msg.channel, msg.author + " This door is already closed!!!")
				}
			}
		}
	}
}

module.exports = [ gaemfuncs, gaemcmds ];
