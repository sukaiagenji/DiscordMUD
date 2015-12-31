var intervals = [];
var world = [];
var roomId, info, exitList, emotes, info;

try {
	emotes = require("./emotes.json");
} catch(e) {
	//No settings file found. Terminating.
	console.log("Emotes failed to load. " + e);
}

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
	require('fs').readdirSync(__dirname + '/world').forEach(function(file) {
	  if (file.match(/\.wrld.json$/) !== null) {
		var name = file.replace('.wrld.json', '');
		world[name] = require('./world/' + file);
	  }
	});
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
	character = require(settings.botLocation.toString() + "/plugins/character.json");
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
			if (world[lookFile][roomId].roomHas) {
				for (var i in world[lookFile][roomId].roomHas) {
					if (world[lookFile][roomId].roomHas[i].itemIs == lookSuffix) {
						bot.sendMessage(msg.channel, msg.author + " You see " + world[lookFile][roomId].roomHas[i].itemDesc);
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
				bot.sendMessage(msg.channel, msg.author + "\n" + info.shortDesc + "\n\n" + info.longDesc + "\n\nLooking around, you see\n" + charsList + "\n\nThe exits are:\n" + exitList);
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
	},
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
				character[msg.author.id].area = info.area
				bot.sendMessage(msg.channel, msg.author + "\n" + info.shortDesc + "\n\n" + info.longDesc + "\n\nLooking around, you see\n" + charsList + "\n\nThe exits are:\n" + exitList);
			} else if (shortGoHere && !endHere) {
				bot.sendMessage(msg.channel, msg.author + " You can't go that way!");
			}
		}
	},
	"sit": {
		description: "Ummm.... sit.",
		process: function (bot,msg,suffix) {
			if (character[msg.author.id].position != "sitting") {
				character[msg.author.id].position = "sitting";
				for (var i in character) {
					if (character[i].userChannel && character[i].currentAt == character[msg.author.id].currentAt && character[i] != character[msg.author.id]) {
						bot.sendMessage(character[i].userChannel, msg.author.username + " sits down.");
					}
				}
				bot.sendMessage(msg.channel, msg.author + " You sit down.")
			} else {
				bot.sendMessage(msg.channel, msg.author + " You're already sitting!");
			}
		}
	},
	"stand": {
		description: "Ummm.... stand. Duh.",
		process: function (bot,msg,suffix) {
			if (character[msg.author.id].position != "standing") {
				character[msg.author.id].position = "standing";
				for (var i in character) {
					if (character[i].userChannel && character[i].currentAt == character[msg.author.id].currentAt && character[i] != character[msg.author.id]) {
						bot.sendMessage(character[i].userChannel, msg.author.username + " stands up.");
					}
				}
				bot.sendMessage(msg.channel, msg.author + " You stand up.")
			} else {
				bot.sendMessage(msg.channel, msg.author + " You're already standing!");
			}
		}
	},
	"'": {
		usage: "<message>",
		description: "Talk to other players in the room with you!",
		process: function (bot,msg,suffix) {
			if (!suffix) {
				bot.sendMessage(msg.channel, msg.author + " What do you want to say?");
				return;
			}
			for (var i in character) {
				if (character[i].userChannel && character[i].currentAt == character[msg.author.id].currentAt && character[i] != character[msg.author.id]) {
					bot.sendMessage(character[i].userChannel, msg.author.username + " says \'" + suffix + "\'");
				}
			}
			bot.sendMessage(msg.channel, "You said \'" + suffix + "\'");
		}
	},
	"say": {
		usage: "<message>",
		description: "Talk to other players in the room with you!",
		process: function (bot,msg,suffix) {
			if (!suffix) {
				bot.sendMessage(msg.channel, msg.author + " What do you want to say?");
				return;
			}
			for (var i in character) {
				if (character[i].userChannel && character[i].currentAt == character[msg.author.id].currentAt && character[i] != character[msg.author.id]) {
					bot.sendMessage(character[i].userChannel, msg.author.username + " says \'" + suffix + "\'");
				}
			}
			bot.sendMessage(msg.channel, "You said \'" + suffix + "\'");
		}
	},
	"help": {
		description: "Used to get help.",
		process: function (bot,msg,suffix) {
            for (var cmd in gaemcmds) {
				if (cmd != "help") {
					var cmdInfo = "." + cmd;
					var usage = gaemcmds[cmd].usage;
					if (usage) {
						cmdInfo += " " + usage;
					}
					var description = gaemcmds[cmd].description;
					if(description){
						cmdInfo += "\n\t" + description;
					}
					bot.sendMessage(msg.channel,cmdInfo);
				}
            }
		}
	},
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
			if (startHere.exits[shortGoHere].linksTo) {
				var endHere = startHere.exits[shortGoHere].linksTo;
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
					bot.sendMessage(msg.channel, msg.author + " The door leading " + directionsToLong[shortGoHere] + " is now closed!")
				} else if (exitDoor == "open") {
					bot.sendMessage(msg.channel, msg.author + " This door is already closed!!!")
				}
			}
		}
	},
	"emote": {
		usage: "<emote> <optional username>",
		description: "Prints an emote, optionally with a second user (dependant on emote)",
		process: function(bot,msg,suffix) {
			var args = suffix.split(" ");
			var name = args.shift().toLowerCase();
			if (!name) {
				bot.sendMessage(msg.channel, "!emote " + this.usage + "\n" + this.description);
			} else if (!emotes[name]) {
				bot.sendMessage(msg.channel, msg.author + " I don't know that one...");
			} else {
				var victim = args.join(" ");
				if (!victim) {
					bot.sendMessage(msg.channel, emotes[name][0]);
					for (var i in character) {
						if (character[i].userChannel && character[i].currentAt == character[msg.author.id].currentAt && character[i] != character[msg.author.id]) {
							bot.sendMessage(character[i].userChannel, msg.author.username + emotes[name][1]);
						}
					}
				} else if (victim == msg.author.username) {
					bot.sendMessage(msg.channel, msg.author + " That's a bit awkward, isn't it?")
				} else {
					for (var i = 0; i < bot.users.length; i++) {
						if (character[bot.users[i].id] && character[bot.users[i].id].currentAt == character[msg.author.id].currentAt
						&& bot.users[i].id != msg.author.id && character[bot.users[i].id].onOrOff == "online") {
							if (bot.users[i].username == victim) {
								var victimFound = victim;
								var victimID = bot.users[i].id;
							}
						}
					}
					if (!victimFound) {
						bot.sendMessage(msg.channel, msg.author + " " + victim + " isn't around.");
					} else {
						if (!emotes[name][2]) {
							bot.sendMessage(msg.channel, msg.author + " You can't do that!!!");
						} else {
							for (var i in character) {
								if (character[i].userChannel && character[i].currentAt == character[msg.author.id].currentAt && character[i] != character[msg.author.id] && character[i] != character[victimID]) {
									bot.sendMessage(character[i].userChannel, msg.author.username + emotes[name][3] + victim);
								} else if (character[i].userChannel && character[i].currentAt == character[msg.author.id].currentAt && character[i] != character[msg.author.id] && character[i] == character[victimID]) {
									bot.sendMessage(character[i].userChannel, msg.author.username + emotes[name][3] + emotes[name][5]);
								} else if (character[i].userChannel && character[i].currentAt == character[msg.author.id].currentAt && character[i] == character[msg.author.id] && character[i] != character[victimID]) {
									bot.sendMessage(character[i].userChannel, emotes[name][2] + victim + emotes[name][4]);
								}
							}
						}
					}
				}
			}
		}
	},
	

	
	"emotehelp": {
		description: "Prints a list of available emotes.",
		process: function(bot,msg,suffix) {
			info = " ";
			for (var cmd in emotes) {
				info += cmd + "\t";
			}
			bot.sendMessage(msg.channel, "Here are the available emotes:\n");
			setTimeout(function() {
				bot.sendMessage(msg.channel, info);
			}, 500);
		}
	},
	"yell": {
		usage: "<message>",
		description: "Yell to other players in the same area as you!",
		process: function (bot,msg,suffix) {
			if (!suffix) {
				bot.sendMessage(msg.channel, msg.author + " What do you want to say?");
				return;
			}
			for (var i in character) {
				if (character[i].userChannel && character[i].area == character[msg.author.id].area && character[i] != character[msg.author.id]) {
					bot.sendMessage(character[i].userChannel, msg.author.username + " yelled \'" + suffix + "\'");
				}
			}
			bot.sendMessage(msg.channel, "You yelled \'" + suffix + "\'");
		}
	},
	"emotehelp": {
		description: "Prints a list of available emotes.",
		process: function(bot,msg,suffix) {
		info = " ";
		for (var cmd in emotes) {
			info += cmd + "\t";
		}
		bot.sendMessage(msg.channel, "Here are the available emotes:\n");
		setTimeout(function() {
			bot.sendMessage(msg.channel, info);
		}, 500);
		}
	}
}

module.exports = [ gaemfuncs, gaemcmds ];
