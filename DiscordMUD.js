/*
Welcome to DiscordMUD v2.0a for Discord.js!!!

Special thanks to Discord and its creators Hammer & Chisel, inc.,
 Discord.js and its creator hydrabolt, and DiscordBot and its creator chalda!
 
 http://www.discordapp.com/
 https://github.com/hydrabolt/discord.js
 https://github.com/chalda/DiscordBot/


*/

// Resource files for usage by DiscordMUD, such as commands
var commands, settings, admins;
var expCmdsStack = {};
var intervals = [];
var expCmds = [];
var expFuncs = [];

try {
	settings = require("./settings.json");
	console.log("Settings loaded.");
} catch(e) {
	//No settings file found. Terminating.
	console.log("Settings failed to load. " + e);
}

// Obviously need discord.js to run...
try {
	var Discord = require(settings.discordjsLocation);
	console.log("Discord location loaded.");
} catch(e) {
	var Discord = require("../");
	console.log("Discord.JS not found. " + e);
}

// Create the bot and other server related instances
var bot = new Discord.Client();

try {
	commands = require("./commands.js");
	console.log("Commands loaded.");
} catch(e) {
	console.log("Could not load commands file (required). Terminating. " + e);
}

try {
	admins = require("./plugins/admins.json");
	console.log("Admins loaded.");
} catch(e) {
	admins = {};
	console.log("Admin file failed to load. " + e);
}

// And finally, the login file.
try {
	var AuthDetails = require("./auth.json");
	console.log("Auth file loaded.");
} catch(e) {
	console.log("Couldn't find auth.json file, needed for sign-in. " + e);
}

// Gaem directory.
try {
	require('fs').readdirSync(__dirname + '/gaemfiles').forEach(function(file) {
	  if (file.match(/\.js$/) !== null && file !== 'index.js' && file !== 'commands.js') {
		var name = file.replace('.js', '');
		exports[name] = require('./gaemfiles/' + file);
		// If this plugin has any functions, we'll add it to a stack.
		if (exports[name][0]) {
			intervals.push(name);
		}
	  }
	});
	console.log("Plugins loaded.");
} catch(e) {
	console.log("No plugins found. " + e);
}

// Plugins directory
try {
	require('fs').readdirSync(__dirname + '/plugins').forEach(function(file) {
	  if (file.match(/\.js$/) !== null && file !== 'index.js' && file !== 'commands.js') {
		var name = file.replace('.js', '');
		exports[name] = require('./plugins/' + file);
		// If this plugin has any functions, we'll add it to a stack.
		if (exports[name][0]) {
			intervals.push(name);
		}
	  }
	});
	console.log("Plugins loaded.");
} catch(e) {
	console.log("No plugins found. " + e);
}

// And grab any commands and functions from plugins as well...
try {
	for (var i = 0; i < intervals.length; i++) {
		expCmds.push(exports[intervals[i]][1]);
	}
	for (var i = 0; i < intervals.length; i++) {
		expFuncs.push(exports[intervals[i]][0]);
	}
} catch(e) {
	console.log(e);
}

// And push the commands to one stack for later...
try {
	for (var i = 0; i < intervals.length; i++) {
		for (var cmd in expCmds[i]) {
			expCmdsStack[cmd] = 1;
		}
	}
} catch(e) {
	console.log(e);
}


// When the bot comes online...
bot.on("ready", function () {
	// Let's just send this to the console.
	console.log("Ready to begin! Serving in " + bot.channels.length + " channels");

	// Send a message to the #general channel of each server, letting everyone know we're online.
	if (settings.loginMessage) {
		for (var i = 0; i < bot.channels.length; i++) {
			if (bot.channels[i].name == "general") {
				bot.sendMessage(bot.channels[i].id, settings.loginMessage.toString());
			}
		}
	}
	
	try {
		// Run all the plugin intervals fn60sec functions once at start....
		for (var i = 0; i < intervals.length; i++) {
			if (exports[intervals[i]][0].fn60sec) {
				exports[intervals[i]][0].fn60sec(bot);
			}
		}
		// Then set the interval timer.
		setInterval(function () { for (var i = 0; i < intervals.length; i++) {
				if (exports[intervals[i]][0].fn60sec) {
					exports[intervals[i]][0].fn60sec(bot);
				}
			}
		}, 60000);
		setInterval(function () { for (var i = 0; i < intervals.length; i++) {
				if (exports[intervals[i]][0].fn300sec) {
					exports[intervals[i]][0].fn300sec(bot);
				}
			}
		}, 300000);
	} catch(e) {
		console.log(e);
	}
	
	try {
		// And run all plugin runOnce functions.
		for (var i = 0; i < intervals.length; i++) {
			if (exports[intervals[i]][0].runOnce) {
				exports[intervals[i]][0].runOnce(bot);
			}
		}
	} catch(e) {
		console.log("Nope again. " + e);
	}
});

// And when the bot goes offline for any reason.
bot.on("disconnected", function () {

	console.log("Disconnected!"); // Yep, we're disconnected.
	process.exit(1); //exit node.js with an error
	
});

// From DiscordBot
bot.on("message", function (msg) {
	
	//check if message is a command
	if (msg.author.id != bot.user.id && msg.content[0] === '!') {
        console.log("treating " + msg.content + " from " + msg.author.username + " as command");
		var cmdTxt = msg.content.split(" ")[0].substring(1).toLowerCase().replace(/[^a-z0-9_!]/gi,'');
        var suffix = msg.content.substring(cmdTxt.length+2); // Add one for the ! and one for the space
        if (msg.content.indexOf(bot.user.mention()) == 0) {
			try {
				cmdTxt = msg.content.split(" ")[1];
				suffix = msg.content.substring(bot.user.mention().length+cmdTxt.length+2);
			} catch(e) { //no command
				bot.sendMessage(msg.channel,"Yes?");
				return;
			}
        }
        if (cmdTxt === "help") {
            //help is special since it iterates over the other commands
            for (var cmd in commands) {
				if ((!commands[cmd].adminlvl || admins[msg.author.id] >= commands[cmd].adminlvl) && commands[cmd].disabled != true && commands[cmd].hidden != true) {
					var info = "!" + cmd;
					var usage = commands[cmd].usage;
					if (usage) {
						info += " " + usage;
					}
					var description = commands[cmd].description;
					if(description){
						info += "\n\t" + description;
					}
					bot.sendMessage(msg.channel,info);
				}
            }
			for (var i = 0; i < expCmds.length; i++) {
				for (var cmd in expCmds[i]) {
					if ((!expCmds[i][cmd].adminlvl || admins[msg.author.id] >= expCmds[i][cmd].adminlvl) && expCmds[i][cmd].disabled != true && expCmds[i][cmd].hidden != true) {
						var info = "!" + cmd;
						var usage = expCmds[i][cmd].usage;
						if (usage) {
							info += " " + usage;
						}
						var description = expCmds[i][cmd].description;
						if(description){
							info += "\n\t" + description;
						}
						bot.sendMessage(msg.channel,info);
						
					}
				}
			}
        } else if ((commands[cmdTxt] && (admins[msg.author.id] >= commands[cmdTxt.replace(/[^a-z0-9_]/gi,'')].adminlvl || !commands[cmdTxt.replace(/[^a-z0-9_]/gi,'')].adminlvl)
			&& (commands[cmdTxt.replace(/[^a-z0-9_]/gi,'')].disabled != true || !commands[cmdTxt.replace(/[^a-z0-9_]/gi,'')].disabled)) || expCmdsStack[cmdTxt]) {
				if (!commands[cmdTxt.replace(/[^a-z0-9_]/gi,'')]) {
				for (var i = 0; i < expCmds.length; i++) {
					if (expCmds[i][cmdTxt] && ((admins[msg.author.id] >= expCmds[i][cmdTxt].adminlvl) || !expCmds[i][cmdTxt].adminlvl)) {
						expCmds[i][cmdTxt].process(bot,msg,suffix);
						return;
					}
				}
			} else if (commands[cmdTxt].disabled != true) {
				commands[cmdTxt.replace(/[^a-z0-9_]/gi,'')].process(bot,msg,suffix);
			}
		} else {
			bot.sendMessage(msg.channel, "Invalid command " + cmdTxt);
		}
	} else if (msg.author.id != bot.user.id && msg.content[0] === '.' && msg.content[1] !== '.') {
		var cmdTxt = msg.content.split(" ")[0].substring(1).toLowerCase().replace(/[^a-z0-9']/gi,'');
		if (cmdTxt) {
			for (var i = 0; i < expFuncs.length; i++) {
				if (expFuncs[i].checkCmd) {
					expFuncs[i].checkCmd(bot,msg);
					return;
				}
			}
		}
	} else {
		//message isn't a command or is from us
        //drop our own messages to prevent feedback loops
        if (msg.author.id == bot.user.id) {
            return;
        }
        if (msg.author.id != bot.user.id && msg.isMentioned(bot.user) && !msg.content.split(" ")[1]) {
                bot.sendMessage(msg.channel,msg.author + ", you called?");
        }
    }
});
 
// Needed for login information.
bot.login(AuthDetails.email, AuthDetails.password);
