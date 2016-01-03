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
	}
}

module.exports = [ gaemfuncs, gaemcmds ];
