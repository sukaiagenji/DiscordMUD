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
	"look": {
		usage: "<player name>, or <direction>, or <object>",
		description: "Used to look around the room if no player specified, or at a player in your room, or in a direction, or at something.",
		process: function (bot,msg,suffix) {
			var lookSuffix = suffix.toLowerCase();
			var lookFile = character[msg.author.id].currentAt[0];
			var roomId = character[msg.author.id].currentAt;
			if (world[lookFile][roomId]) {
				var startHere = world[lookFile][character[msg.author.id].currentAt];
			} else {
				var startHere = world["0"]["000"];
			}
			for (var i in directions) {
				if (lookSuffix == directions[i]) {
					var shortGoHere = directions[lookSuffix];
					if (startHere.exits[shortGoHere] && startHere.exits[shortGoHere].hasDoor && startHere.exits[shortGoHere].hasDoor == "closed") {
						bot.sendMessage(msg.channel, msg.author + " You can't see through a closed door!");
						return;
					} else if (!startHere.exits[shortGoHere]) {
						bot.sendMessage(msg.channel, msg.author + " There's nothing to see!!!");
						return;
					}
					if (startHere.exits[shortGoHere] && startHere.exits[shortGoHere].linksTo) {
						var endHere = startHere.exits[shortGoHere].linksTo;
					}
				}
			}
			if (endHere) {
				lookFile = endHere[0];
				var lookRoom = world[lookFile][endHere];
				bot.sendMessage(msg.channel, msg.author + " You see " + lookRoom.shortDesc);
				return;
			}
			if (lookSuffix) {
				for (var i in items) {
					for (var q in items[i]) {
						if (suffix.toLowerCase() == items[i][q].shortDesc) {
							var itemReal = items[i][q];
						}
					}
				}
				for (var i in world[lookFile][roomId].roomHas) {
					if (itemReal.itemNumber == world[lookFile][roomId].roomHas[i].itemNumber) {
						bot.sendMessage(msg.channel, msg.author + " You see " + itemReal.longDesc);
						return;
					}
				}
			}
			var charsList = " ";
			if (!lookSuffix) {
				if (character[msg.author.id].currentAt == "charcomplete") {
					character[msg.author.id].currentAt = "001";
				}
				var lookFile = character[msg.author.id].currentAt[0];
				roomId = character[msg.author.id].currentAt;
				if (world[lookFile][roomId]) {
					info = world[lookFile][character[msg.author.id].currentAt];
				} else {
					info = world["0"]["000"];
				}
				for (var i = 0; i < bot.users.length; i++) {
					if (character[bot.users[i].id] && character[bot.users[i].id].currentAt == character[msg.author.id].currentAt
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
				if (world[lookFile][roomId].roomHas) {
					for (var i in world[lookFile][roomId].roomHas) {
						var itemFile = world[lookFile][roomId].roomHas[i].itemNumber[0];
						var itemNum = world[lookFile][roomId].roomHas[i].itemNumber;
						listItems += "a " + items[itemFile][itemNum].shortDesc + "\t";
					}
				}
				bot.sendMessage(msg.channel, msg.author + "\n" + info.shortDesc + "\n\n" + info.longDesc + "\n\nLooking around, you see\n" + charsList + "\n\nThe exits are:\n" + exitList);
				if (listItems != "\nIn the room, you see:\n") {
					bot.sendMessage(msg.channel, listItems);
				}
				return;
			} else {
				for (var i = 0; i < bot.users.length; i++) {
					if (bot.users[i].username.toLowerCase() == lookSuffix) {
						var userFound = true;
						info = character[bot.users[i].id];
						info.name = bot.users[i].username;
					}
				}
				if (userFound == true) {
					if (!info) {
						bot.sendMessage(msg.channel, msg.author + " You see something, but the image is fuzzy. This person hasn't run !setup yet.");
					} else if (suffix.toLowerCase() == msg.author.username.toLowerCase()) {
						bot.sendMessage(msg.channel, msg.author + " Looking at yourself is a little conceited...")				
					} else if (info.longdesc && character[msg.author.id].currentAt == info.currentAt) {
						bot.sendMessage(msg.channel, msg.author + " " + info.longdesc);
					} else if (info.hairLength != "bald" && character[msg.author.id].currentAt == info.currentAt) {
						bot.sendMessage(msg.channel, msg.author + " You see a "  + info.age + " aged " + info.height +
						" height, " + info.weight + " built " + info.gender + " " + info.race +
						" looking at you with " + info.eyesType + " " + info.eyesColor +
						" eyes, " + info.hairLength + " " + info.hairType + " " + info.hairColor +
						" hair, trained in the ways of the " + info.classType + ".");
					} else if (!info.longdesc && info.hairLength == "bald" && character[msg.author.id].currentAt == info.currentAt){
						bot.sendMessage(msg.channel, msg.author + " You see a "  + info.age + " aged " + info.height +
						" height, " + info.weight + " built " + info.gender + " " + info.race +
						" looking at you with " + info.eyesType + " " + info.eyesColor +
						" eyes, a " + info.hairLength + " head, trained in the ways of the " + info.classType + ".");
					} else if (info && character[msg.author.id].currentAt !== info.currentAt) {
						bot.sendMessage(msg.channel, msg.author + " " + info.name + " isn't around.");
					}
				} else if (suffix) {
					bot.sendMessage(msg.channel, msg.author + " I don't see a " + suffix + " anywhere...");
				} else {
					bot.sendMessage(msg.channel, msg.author + " I don't know what you want to look at...");
				}
				info = '';
			}
		}
	}
}

module.exports = [ gaemfuncs, gaemcmds ];
