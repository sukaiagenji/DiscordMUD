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
	}
}

module.exports = [ gaemfuncs, gaemcmds ];
