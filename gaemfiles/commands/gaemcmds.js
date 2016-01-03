var world = [];
var roomId, info, exitList, emotes;

try {
	emotes = require("./emotes.json");
} catch(e) {
	//No settings file found. Terminating.
	console.log("Emotes failed to load. " + e);
}

var toPoss = {
	"female": "her",
	"male": "his"
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
	}
}

module.exports = [ gaemfuncs, gaemcmds ];
