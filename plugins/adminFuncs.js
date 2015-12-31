var admins, settings;

try {
	settings = require("../settings.json");
} catch(e) {
	//No settings file found. Terminating.
	console.log("Settings failed to load. " + e);
}

var adminsFile = settings.botLocation + "/plugins/admins.json";

try {
	admins = require(settings.botLocation.toString() + "/plugins/admins.json");
} catch(e) {
	console.log(e);
	admins = {};
}

expFuncs = {}

expCmds = {
    "pullanddeploy": {
		disabled: true,
		adminlvl: 4,
        description: "bot will perform a git pull master and restart with the new code",
        process: function(bot,msg,suffix) {
            bot.sendMessage(msg.channel,"fetching updates...",function(error,sentMsg){
                console.log("updating...");
	            var spawn = require('child_process').spawn;
                var log = function(err,stdout,stderr){
                    if(stdout){console.log(stdout);}
                    if(stderr){console.log(stderr);}
                };
                var fetch = spawn('git', ['fetch']);
                fetch.stdout.on('data',function(data){
                    console.log(data.toString());
                });
                fetch.on("close",function(code){
                    var reset = spawn('git', ['reset','--hard','origin/master']);
                    reset.stdout.on('data',function(data){
                        console.log(data.toString());
                    });
                    reset.on("close",function(code){
                        var npm = spawn('npm', ['install']);
                        npm.stdout.on('data',function(data){
                            console.log(data.toString());
                        });
                        npm.on("close",function(code){
                            console.log("goodbye");
                            bot.sendMessage(msg.channel,"brb!",function(){
                                bot.logout(function(){
                                    process.exit();
                                });
                            });
                        });
                    });
                });
            });
        }
    },
    "log": {
        usage: "<log message>",
        description: "logs message to bot console",
		adminlvl: 4,
        process: function(bot,msg,suffix){console.log(msg.content);}
    },
	"addlevel": {
		usage: "<username>",
		description: "Adds a level to the user's admin level. Needed for some commands.",
		adminlvl: 3,
		process: function(bot,msg,suffix) {
			var myAdminLvl = admins[msg.author.id];
			var otherAdmin;
			for (var i = 0; i < bot.users.length; i++) {
				if (bot.users[i].username == suffix) {
					otherAdmin = bot.users[i].id;
				}
			}
			var otherAdminLvl = admins[otherAdmin];
			if (!otherAdminLvl) {
				otherAdminLvl = 0
			}
			if (otherAdmin && myAdminLvl > otherAdminLvl + 1) {
				admins[otherAdmin] = otherAdminLvl + 1;
				//now save the new admin file
				require("fs").writeFile(settings.botLocation + "/plugins/admins.json",JSON.stringify(admins,null,4), null);
				bot.sendMessage(msg.channel,"added admin " + suffix + ": " + admins[otherAdmin]);
			} else {
				console.log(otherAdmin + myAdminLvl + otherAdminLvl);
				bot.sendMessage(msg.channel, suffix + " can't be promoted any further by you or doesn't exist");
			}
		}
	},
	"droplevel": {
		usage: "<username>",
		description: "Removes a level from the user's admin level. Needed for some commands.",
		adminlvl: 3,
		process: function(bot,msg,suffix) {
			var myAdminLvl = admins[msg.author.id];
			var otherAdminLvl = admins[suffix];
			var otherAdmin;
			if (otherAdminLvl > 0) {
				for (var i = 0; i < bot.users.length; i++) {
					if (bot.users[i].username == suffix) {
						otherAdmin = bot.users[i].id;
					}
				}
				if (otherAdmin && myAdminLvl > otherAdminLvl) {
					admins[otherAdmin] = otherAdminLvl - 1;
					//now save the new admin file
					require("fs").writeFile(settings.botLocation + "/plugins/admins.json",JSON.stringify(admins,null,4), null);
					bot.sendMessage(msg.channel,"dropped admin " + otherAdmin + ": " + admins[otherAdmin]);
				}
			} else {
				bot.sendMessage(msg.channel,suffix + " at level 0 already or doesn't exist.")
			}
		}
	},
	"quit": {
		description: "Forces the bot offline. Takes no arguments.",
		adminlvl: 4,
		process: function(bot,msg,suffix) {
			if (suffix) {
				bot.sendMessage(msg.channel, msg.sender+" Wait, what am I quitting?");
			} else {
				bot.sendMessage(msg.channel, "(\u256F°\u25A1°\uFF09\u256F\uFE35 \u253B\u2501\u253B SO FSCKING DONE. I'M OUT.");
				console.log("Quit-ed by " +msg.sender.username);
				bot.logout();
			}
		}
	}
}

module.exports = [ expFuncs, expCmds ];
