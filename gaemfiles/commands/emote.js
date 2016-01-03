var info, emotes;

try {
	emotes = require("./emotes.json");
} catch(e) {
	//No settings file found. Terminating.
	console.log("Emotes failed to load. " + e);
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
					if (!character[msg.author.id]) {
						bot.sendMessage(msg.channel, msg.author + " You need to run !setup first.");
						return;
					}
					bot.sendMessage(msg.channel, emotes[name][0]);
					for (var i in character) {
						if (character[msg.author.id] && character[i].userChannel && character[i].currentAt == character[msg.author.id].currentAt && character[i] != character[msg.author.id] && !emotes[name]["1m"]) {
							bot.sendMessage(character[i].userChannel, msg.author.username + emotes[name][1]);
						} else if (character[i].userChannel && character[i].currentAt == character[msg.author.id].currentAt && character[i] != character[msg.author.id] && character[msg.author.id].gender == "male") {
							bot.sendMessage(character[i].userChannel, msg.author.username + emotes[name]["1m"]);
						} else if (character[i].userChannel && character[i].currentAt == character[msg.author.id].currentAt && character[i] != character[msg.author.id] && character[msg.author.id].gender == "female") {
							bot.sendMessage(character[i].userChannel, msg.author.username + emotes[name]["1f"]);
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
						} else if (!emotes[name]["5m"]){
							for (var i in character) {
								if (character[i].userChannel && character[i].currentAt == character[msg.author.id].currentAt && character[i] != character[msg.author.id] && character[i] != character[victimID]) {
									bot.sendMessage(character[i].userChannel, msg.author.username + emotes[name][3] + victim);
								} else if (character[i].userChannel && character[i].currentAt == character[msg.author.id].currentAt && character[i] != character[msg.author.id] && character[i] == character[victimID]) {
									bot.sendMessage(character[i].userChannel, msg.author.username + emotes[name][3] + emotes[name][5]);
								} else if (character[i].userChannel && character[i].currentAt == character[msg.author.id].currentAt && character[i] == character[msg.author.id] && character[i] != character[victimID]) {
									bot.sendMessage(character[i].userChannel, emotes[name][2] + victim + emotes[name][4]);
								}
							}
						} else {
							for (var i in character) {
								if (character[i].userChannel && character[i].currentAt == character[msg.author.id].currentAt && character[i] != character[msg.author.id] && character[i] != character[victimID]) {
									if (emotes[name]["6m"] && character[msg.author.id].gender == "male") {
										bot.sendMessage(character[i].userChannel, msg.author.username + emotes[name][3] + victim + emotes[name]["6m"]);
									} else if (emotes[name]["6f"] && character[msg.author.id].gender == "female") {
										bot.sendMessage(character[i].userChannel, msg.author.username + emotes[name][3] + victim + emotes[name]["6f"]);
									} else {
										bot.sendMessage(character[i].userChannel, msg.author.username + emotes[name][3] + victim);
									}
								} else if (character[i].userChannel && character[i].currentAt == character[msg.author.id].currentAt && character[i] != character[msg.author.id] && character[i] == character[victimID]) {
									if (character[msg.author.id].gender == "male") {
										bot.sendMessage(character[i].userChannel, msg.author.username + emotes[name][3] + emotes[name]["5m"]);
									} else {
										bot.sendMessage(character[i].userChannel, msg.author.username + emotes[name][3] + emotes[name]["5f"]);
									}
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
	}
}

module.exports = [ gaemfuncs, gaemcmds ];
