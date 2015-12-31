var settings, character, gender, age, height, weight, race, classType, hairLength,
	hairType, hairColor, eyesType, eyesColor, info, longdesc, currentAt, roomId, info, exitList, tempRoom;
var intervals = [];
var gaemcmds = [];
var gaemcmdsStack = [];
var intervals = [];
var world = [];
var directionsShort = ["n", "s", "e", "w", "nw", "ne", "sw", "se", "u", "d"];
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

try {
	require('fs').readdirSync(__dirname + '/gaemfiles/world').forEach(function(file) {
	  if (file.match(/\.wrld.json$/) !== null) {
		var name = file.replace('.wrld.json', '');
		world[name] = require('./gaemfiles/world/' + file);
	  }
	});
} catch(e) {
	console.log("Required world files not found. " + e);
}


try {
	settings = require("../settings.json");
} catch(e) {
	//No settings file found. Terminating.
	console.log("Settings failed to load in character.js. " + e);
}

var charsFile = settings.botLocation + "/plugins/character.json";

try {
	character = require(settings.botLocation.toString() + "/plugins/character.json");
} catch(e) {
	console.log("Character set failed to load. " + e);
	character = {};
}

try {
	require('fs').readdirSync(__dirname + '/gaemfiles').forEach(function(file) {
	  if (file.match(/\.js$/) !== null && file !== 'index.js') {
		var name = file.replace('.js', '');
		exports[name] = require('./gaemfiles/' + file);
		if (exports[name][0]) {
			intervals.push(name);
		}
	  }
	});
} catch(e) {
	console.log("Required game files not found. " + e);
}

try {
	for (var i = 0; i < intervals.length; i++) {
		gaemcmds.push(exports[intervals[i]][1]);
	}
} catch(e) {
	console.log(e);
}

// And push the commands to one stack for later...
try {
	for (var i = 0; i < intervals.length; i++) {
		for (var cmd in gaemcmds[i]) {
			gaemcmdsStack[cmd] = 1;
		}
	}
} catch(e) {
	console.log(e);
}

var totalKill = {
	"createInstantInvite": false,
	"kickMembers": false,
	"banMembers": false,
	"manageRoles": false,
	"managePermissions": false,
	"manageChannels": false,
	"manageChannel": false,
	"manageServer": false,
	"readMessages": false,
	"sendMessages": false,
	"sendTTSMessages": false,
	"manageMessages": false,
	"embedLinks": false,
	"attachFiles": false,
	"readMessageHistory": false,
	"mentionEveryone": false
};
var userOnly = {
	"createInstantInvite": false,
	"kickMembers": false,
	"banMembers": false,
	"manageRoles": false,
	"managePermissions": false,
	"manageChannels": false,
	"manageChannel": false,
	"manageServer": false,
	"sendTTSMessages": false,
	"manageMessages": false,
	"embedLinks": false,
	"attachFiles": false,
	"mentionEveryone": false,
	"readMessages": true,
	"sendMessages": true,
	"readMessageHistory": true
};
var botOnly = {
	"createInstantInvite": true,
	"kickMembers": true,
	"banMembers": true,
	"manageRoles": true,
	"managePermissions": true,
	"manageChannels": true,
	"manageChannel": true,
	"manageServer": true,
	"readMessages": true,
	"sendMessages": true,
	"sendTTSMessages": true,
	"manageMessages": true,
	"embedLinks": true,
	"attachFiles": true,
	"readMessageHistory": true,
	"mentionEveryone": true
};

function doPerms(bot,msg,suffix) {
	for (var i = 0; i < bot.users.length; i++) {
		if (bot.users[i].id === bot.user.id) {
			bot.overwritePermissions(tempRoom, bot.users[i], botOnly, function(error) {
				if(error){
					bot.sendMessage(msg.channel,"failed. " + error);
				}
			});
		} else if (bot.users[i].id === msg.author.id) {
			bot.overwritePermissions(tempRoom, bot.users[i], userOnly, function(error) {
				if(error){
					bot.sendMessage(msg.channel,"failed. " + error);
				}
			});
		}
	}
	setTimeout(function () {
		for (var i = 0; i < msg.channel.server.roles.length; i++) {
			if (msg.channel.server.roles[i].name == "@everyone") {
				bot.overwritePermissions(tempRoom, msg.channel.server.roles[i], totalKill, function(error) {
					if (error){
						bot.sendMessage(msg.channel,"failed. " + error);
					}
				});
			}
		}	
	}, 1000);
}

expFuncs = {
	"checkCmd": function (bot,msg) {
//		console.log("treating " + msg.content + " from " + msg.author.username + " as command");
		var cmdTxt = msg.content.split(" ")[0].substring(1).toLowerCase();
		var suffix = msg.content.substring(cmdTxt.length+2);
		if (msg.content.indexOf(bot.user.mention()) == 0) {
			try {
				cmdTxt = msg.content.split(" ")[1];
				suffix = msg.content.substring(bot.user.mention().length+cmdTxt.length+2);
			} catch(e) { //no command
				bot.sendMessage(msg.channel,"Yes?");
				return;
			}
		} else if (gaemcmdsStack[cmdTxt]) {
			for (var i = 0; i < gaemcmds.length; i++) {
				if (gaemcmds[i][cmdTxt]) {
					gaemcmds[i][cmdTxt].process(bot,msg,suffix);
					return;
				}
			}
		} else {
			bot.sendMessage(msg.channel, "Invalid command ." + cmdTxt);
		}
	}
}

// expCmds are any commands you want your bot to be able to do.

expCmds = {
    "newgaem": {
		usage: "<character name>",
        description: "Starts a new gaem!",
		hidden: true,
        process: function(bot,msg,suffix) {
			if (character[msg.author.id].roomName) {
				bot.createChannel(msg.channel.server, character[msg.author.id].roomName, function(error) {
					if(error){
						bot.sendMessage(msg.channel,"failed to create channel: " + error);
					}
				});

			}
			if (msg.author.id.toLowerCase().replace(/[^a-z0-9]/gi,'').trim() == "") {
				bot.sendMessage(msg.channel, msg.author + " You need to use !newgaem <character name> with alphanumeric characters only!!!")
			}
			if (!suffix || suffix.toLowerCase().replace(/[^a-z0-9]/gi,'').trim() != "") {
				if (character[msg.author.id] && character[msg.author.id].userChannel) {
					for (var i = 0; i < bot.channels.length; i++) {
						if (bot.channels[i].id == character[msg.author.id].userChannel || bot.channels[i].name == msg.author.username.toLowerCase()) {
							bot.sendMessage(msg.channel, msg.author + " A channel called " + bot.channels[i] + " already exists! You'll need to !quitgaem first, or ask that " + bot.channels[i] + " be deleted!");
							return;
						}
					}
				}
				bot.createChannel(msg.channel.server, msg.author.username, function(error) {
					if(error){
						bot.sendMessage(msg.channel,"failed to create channel: " + error);
					}
				});
			} else {
				if (character[msg.author.id] && character[msg.author.id].userChannel) {
					for (var i = 0; i < bot.channels.length; i++) {
						if (bot.channels[i].id == character[msg.author.id].userChannel || bot.channels[i].name == suffix.toLowerCase()) {
							bot.sendMessage(msg.channel, msg.author + " A channel called " + bot.channels[i] + " already exists! You'll need to !quitgaem first, or ask that " + bot.channels[i] + " be deleted!");
							return;
						}
					}
				}
				bot.createChannel(msg.channel.server, suffix, function(error) {
					if(error){
						bot.sendMessage(msg.channel,"failed to create channel: " + error);
					}
				});
			}
			setTimeout(function () {
				for (var i = 0; i < bot.channels.length; i++) {
					if (!suffix) {
						if (bot.channels[i].name == msg.author.username.toLowerCase() || bot.channels[i].name == character[msg.author.id].roomName) {
							tempRoom = bot.channels[i].id;
							bot.sendMessage(msg.channel, msg.author + ": created " + bot.channels[i] + "!!! Head there now to start playing!!!");
							i = 99999999999999;
						}
					} else {
						if (bot.channels[i].name == suffix) {
							tempRoom = bot.channels[i].id;
							bot.sendMessage(msg.channel, msg.author + ": created " + bot.channels[i] + "!!! Head there now to start playing!!!");
							i = 99999999999999;
						}
					}
				}
				if (!character[msg.author.id]) {
					bot.sendMessage(tempRoom, "Let's start by making your character!!! Please type !setup to begin!");
				} else if (character[msg.author.id].currentAt == "charcomplete") {
					character[msg.author.id].currentAt = "001";
					character[msg.author.id].userChannel = tempRoom;
					bot.sendMessage(tempRoom, "You're all set! I'd start by using .look to look around first.");
					setTimeout(function () { bot.sendMessage(tempRoom, "You might want to try .help too!"); }, 1000);
				} else if (character[msg.author.id].currentAt.replace(/[^0-9]/gi,'').trim() == "") {
					bot.sendMessage(tempRoom, "You need to finish your !setup. Try !nextsetup");
				} else {
					character[msg.author.id].userChannel = tempRoom;
					character[msg.author.id].onOrOff = "online";
					for (var i = 0; i < bot.users.length; i++) {
						if (character[bot.users[i].id] && character[bot.users[i].id].currentAt && character[bot.users[i].id].currentAt == roomId
						&& bot.users[i].id != msg.author.id && character[bot.users[i].id].onOrOff == "online") {
							bot.sendMessage(character[bot.users[i].id].userChannel, msg.author.username + " entered the world!");
						}
					}
					var charsList = " ";
					var lookFile = character[msg.author.id].currentAt[0];
					roomId = character[msg.author.id].currentAt;
					if (world[lookFile][roomId]) {
						info = world[lookFile][character[msg.author.id].currentAt];
					} else {
						info = world["0"]["000"];
					}
					for (var i = 0; i < bot.users.length; i++) {
						if (character[bot.users[i].id] && character[bot.users[i].id].currentAt && character[bot.users[i].id].currentAt == roomId
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
					} else {
						exitList = "There aren't any exits!!! D:"
					}
					if (charsList === " ") {
						charsList = "no one!";
					}
					character[msg.author.id].area = info.area
					bot.sendMessage(tempRoom, msg.author + "\n" + info.shortDesc + "\n\n" + info.longDesc + "\n\nLooking around, you see\n" + charsList + "\n\nThe exits are:\n" + exitList);
				}
			}, 1000);
			
			setTimeout(function () { doPerms(bot,msg,suffix); }, 2000);
			setTimeout(function () { doPerms(bot,msg,suffix); }, 4000);
			tempRoom = "";
		}
    },
	"quitgaem": {
		description: "Saves your file, deletes your channel, and closes the gaem!",
		process: function (bot,msg,suffix) {
			for (var i = 0; i < bot.channels.length; i++) {
				if (bot.channels[i].id == character[msg.author.id].userChannel) {
					tempRoom = i;
				}
			}
			if (msg.channel.id != character[msg.author.id].userChannel) {
				bot.sendMessage(msg.channel, msg.author + " You have to go to " + bot.channels[tempRoom] + " to use this command!");
				return;
			}
			character[msg.author.id].onOrOff = "offline";
			require("fs").writeFile(charsFile,JSON.stringify(character,null,4), function (e) {
				if (e) {
					console.log("Error writing character.json: " + e);
					bot.sendMessage(msg.channel, msg.author + " There was a problem saving your character!!! D:");
				} else {
					bot.sendMessage(msg.channel, msg.author + " Your character file was saved!");
				}
			});
			setTimeout(function () {
				bot.deleteChannel(character[msg.author.id].userChannel);
				for (var i in character) {
					if (character[i].userChannel && character[i].currentAt == character[msg.author.id].currentAt && character[i] != character[msg.author.id] && character[i].onOrOff == "online") {
						bot.sendMessage(character[i].userChannel, msg.author.username + " leaves the world.");
					}
				}
			}, 5000);
		}
	},
	"savegaem": {
		description: "Saves the character file!",
		process: function (bot,msg,suffix) {
			require("fs").writeFile(charsFile,JSON.stringify(character,null,4), function (e) {
				if (e) {
					console.log("Error writing character.json: " + e);
					bot.sendMessage(msg.channel, msg.author + " There was a problem saving your character!!! D:");
				} else {
					bot.sendMessage(msg.channel, msg.author + " Your character file was saved!");
				}
			});
		}
	}
}

module.exports = [ expFuncs, expCmds ];
