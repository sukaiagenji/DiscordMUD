commands = {
    "ping": {
        description: "Responds pong, useful for checking if bot is alive.",
        process: function(bot, msg, suffix) {
            bot.sendMessage(msg.channel, msg.sender+" Pong!");
            if(suffix){
                bot.sendMessage(msg.channel, "Note that !ping takes no arguments!");
            }
        }
    },
    "myid": {
        description: "Returns the user ID of the sender.",
        process: function(bot,msg){bot.sendMessage(msg.channel,msg.author.id);}
    },
	"announce": {
        usage: "<message>",
        description: "Bot sends a global message across all channels.",
		adminlvl: 4,
        process: function(bot,msg,suffix) {
			for (var chan in bot.channels) {
				bot.sendMessage(bot.channels[chan].id, suffix,true);
			}
		}
    },
    "version": {
		disabled: true,
        description: "Returns the git commit this bot is running.",
        process: function(bot,msg,suffix) {
            var commit = require('child_process').spawn('git', ['log','-n','1']);
            commit.stdout.on('data', function(data) {
                bot.sendMessage(msg.channel,data);
            });
            commit.on('close',function(code) {
                if( code != 0){
                    bot.sendMessage(msg.channel,"failed checking git version!");
                }
            });
        }
    }
}

module.exports = commands;
