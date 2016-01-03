var items = [];
var world = [];

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
	var character = require(settings.botLocation.toString() + "/gaemfiles/character.json");
} catch(e) {
	console.log("Character set failed to load. " + e);
	character = {};
}

gaemfuncs = {}

gaemcmds = {
	"take": {
		usage: "<item>",
		description: "Take an item.",
		process: function (bot,msg,suffix) {
			var itemFile, itemNum;
			if (character[msg.author.id]) {
				var roomFile = character[msg.author.id].currentAt[0];
				var roomId = character[msg.author.id].currentAt;
			}
			if (!suffix) {
				bot.sendMessage(msg.channel, msg.author + " What am I taking?");
				return;
			}
			for (var i in bot.users) {
				if (suffix.toLowerCase() == bot.users[i].username.toLowerCase()) {
					bot.sendMessage(msg.channel, msg.author + " Yeah, let's not take that.....");
					return;
				}
			}
			if (world[roomFile][roomId]) {
				if (world[roomFile][roomId].hasNPC) {
					for (var i in world[roomFile][roomId].hasNPC) {
						if (suffix.toLowerCase() == world[roomFile][roomId].hasNPC[i].npcIs.toLowerCase()) {
							bot.sendMessage(msg.channel, msg.author + " Yeah, let's not take that.....");
							return;
						}
					}
				}
			}
			for (var i in items) {
				for (var q in items[i]) {
					if (suffix.toLowerCase() == items[i][q].shortDesc.toLowerCase()) {
						itemFile = i;
						itemNum = q;
					}
				}
			}
			if (itemNum) {
				for (var i in world[roomFile][roomId].roomHas) {
					if (itemNum == world[roomFile][roomId].roomHas[i].itemNumber) {
						if (character[msg.author.id].inventory) {
							for (var q in character[msg.author.id].inventory) {
								if (itemNum == character[msg.author.id].inventory[q].itemNumber) {
									if (items[itemFile][itemNum].maxCarry < character[msg.author.id].inventory[q].amount) {
										character[msg.author.id].inventory[q].amount += 1;
										if (world[roomFile][roomId].roomHas[i].amount == 1) {
											delete world[roomFile][roomId].roomHas[i];
										} else {
											world[roomFile][roomId].roomHas[i].amount -= 1;
										}
										bot.sendMessage(msg.channel, msg.author + " You've taken a " + suffix + ".");
										return;
									} else {
										bot.sendMessage(msg.channel, msg.author + " You can't take another " + suffix + ".");
										return;
									}
								} else {
									var itemSlot = Object.keys(character[msg.author.id].inventory).length;
									bot.sendMessage(msg.channel, msg.author + " You've taken a " + suffix + ".");
									character[msg.author.id].inventory[itemSlot] = { "itemNumber": itemNum, "amount": 1 };
									if (world[roomFile][roomId].roomHas[i].amount == 1) {
										delete world[roomFile][roomId].roomHas[i];
									} else {
										world[roomFile][roomId].roomHas[i].amount -= 1;
									}
									return;
								}
							}
						} else {
							character[msg.author.id].inventory = {};
						}
						if (world[roomFile][roomId].roomHas[i].amount == 1) {
							delete world[roomFile][roomId].roomHas[i];
						} else {
							world[roomFile][roomId].roomHas[i].amount -= 1;
						}
						var itemSlot = Object.keys(character[msg.author.id].inventory).length;
						bot.sendMessage(msg.channel, msg.author + " You've taken a " + suffix + ".");
						character[msg.author.id].inventory[itemSlot] = { "itemNumber": itemNum, "amount": 1 };
						var worldHas = true;
					}
				}
				if (!worldHas) {
					bot.sendMessage(msg.channel, msg.author + " There's no " + suffix + " here.")
				}
			}
		}
	},
	"drop": {
		usage: "<item>",
		description: "Drop an item.",
		process: function (bot,msg,suffix) {
			if (character[msg.author.id]) {
				var roomFile = character[msg.author.id].currentAt[0];
				var roomId = character[msg.author.id].currentAt;
			}
			if (!suffix) {
				bot.sendMessage(msg.channel, msg.author + " What am I dropping?");
				return;
			}
			for (var i in bot.users) {
				if (suffix.toLowerCase() == bot.users[i].username.toLowerCase()) {
					bot.sendMessage(msg.channel, msg.author + " Yeah, let's not try that.....");
					return;
				}
			}
			if (world[roomFile][roomId]) {
				if (world[roomFile][roomId].hasNPC) {
					for (var i in world[roomFile][roomId].hasNPC) {
						if (suffix.toLowerCase() == world[roomFile][roomId].hasNPC[i].npcIs.toLowerCase()) {
							bot.sendMessage(msg.channel, msg.author + " Yeah, let's not try that.....");
							return;
						}
					}
				}
			}
			for (var i in items) {
				for (var q in items[i]) {
					if (suffix.toLowerCase() == items[i][q].shortDesc.toLowerCase()) {
						itemFile = i;
						itemNum = q;
					}
				}
			}
			if (itemNum) {
				for (var i in character[msg.author.id].inventory) {
					if (itemNum == character[msg.author.id].inventory[i].itemNumber) {
						if (world[roomFile][roomId].roomHas) {
							for (var q in world[roomFile][roomId].roomHas) {
								if (itemNum == world[roomFile][roomId].roomHas[q].itemNumber) {
									if (items[itemFile][itemNum].maxCarry < world[roomFile][roomId].roomHas[q].amount) {
										world[roomFile][roomId].roomHas[q].amount += 1;
										bot.sendMessage(msg.channel, msg.author + " You've dropped a " + suffix + ".");
										if (character[msg.author.id].inventory[i].amount == 1) {
											delete character[msg.author.id].inventory[i];
										} else {
											character[msg.author.id].inventory[i].amount -= 1;
										}
										return;
									} else {
										bot.sendMessage(msg.channel, msg.author + " You can't drop another " + suffix + " here.");
										return;
									}
								}
							}
							var itemSlot = Object.keys(world[roomFile][roomId].roomHas).length;
							bot.sendMessage(msg.channel, msg.author + " You've dropped a " + suffix + ".");
							world[roomFile][roomId].roomHas[itemSlot] = { "itemNumber": itemNum, "amount": 1 };
							return;
						} else {
							world[roomFile][roomId].roomHas = {};
						}
						if (character[msg.author.id].inventory[i].amount == 1) {
							delete character[msg.author.id].inventory[i];
						} else {
							character[msg.author.id].inventory[i].amount -= 1;
						}
						var itemSlot = Object.keys(world[roomFile][roomId].roomHas).length;
						bot.sendMessage(msg.channel, msg.author + " You've dropped a " + suffix + ".");
						world[roomFile][roomId].roomHas[itemSlot] = { "itemNumber": itemNum, "amount": 1 };
						var worldHas = true;
					}
				}
				if (!worldHas) {
					bot.sendMessage(msg.channel, msg.author + " You don't have a " + suffix + " to drop.")
				}
			}
		}
	}
}

module.exports = [ gaemfuncs, gaemcmds ];
