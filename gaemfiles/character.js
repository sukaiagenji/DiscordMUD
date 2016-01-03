var character, gender, age, height, weight, race, classType, hairLength, hairType, hairColor, eyesType, eyesColor, info, longDesc;
var answerSet = [];
var errorString = " I didn't quite get that. Try again.\n";

try {
	settings = require("../settings.json");
} catch(e) {
	//No settings file found. Terminating.
	console.log("Settings failed to load in character.js. " + e);
}

try {
	theme = require("./theme.json");
} catch(e) {
	//No theme file found.
	console.log("Theme file not found!!! " + e)
}

var charsFile = settings.botLocation + "/gaemfiles/character.json";

try {
	character = require(settings.botLocation.toString() + "/gaemfiles/character.json");
} catch(e) {
	console.log("Character set failed to load. " + e);
	character = {};
}

function onStart(bot,msg,suffix) {
	bot.sendMessage(character[msg.author.id].userChannel, msg.author + " Let's get started creating your character!!! :D");
	setTimeout(function () {
		bot.sendMessage(character[msg.author.id].userChannel, "For all questions, just answer with !! <answer>. Yes, the 2 exclamation marks are needed, and make sure there's a space between !! and <answer>, otherwise I won't understand you.");
	}, 1000);
	setTimeout(function () {
		bot.sendMessage(character[msg.author.id].userChannel, "So, Let's get going!!! Ready? !! yes or !! no");
	}, 2000);
	character[msg.author.id].currentAt = "start";
}

function onGender(bot,msg,suffix) {
	bot.sendMessage(character[msg.author.id].userChannel, msg.author + " Alright! First, are you !! male or !! female?");
	character[msg.author.id].currentAt = "gender";
}

function onRace(bot,msg,suffix) {
	bot.sendMessage(character[msg.author.id].userChannel, msg.author + " is definitely a " + character[msg.author.id].gender + " name. But I can't tell what you are.\nAre you...");
	setTimeout(function () { bot.sendMessage(character[msg.author.id].userChannel, callArray(races)); }, 500);
	character[msg.author.id].currentAt = "race";
}

function onAge(bot,msg,suffix) {
	bot.sendMessage(character[msg.author.id].userChannel, msg.author + " So, you're " + character[msg.author.id].race + ". Well, how about your age?\nYou can be...");
	setTimeout(function () { bot.sendMessage(character[msg.author.id].userChannel, callArray(ages)); }, 500);
	character[msg.author.id].currentAt = "age";
}

function onHeight(bot,msg,suffix) {
	bot.sendMessage(character[msg.author.id].userChannel, msg.author + " Great! You're " + character[msg.author.id].age + ". Next, how tall are you?\nYou can be...");
	setTimeout(function () { bot.sendMessage(character[msg.author.id].userChannel, callArray(heights)); }, 500);
	character[msg.author.id].currentAt = "height";
}

function onWeight(bot,msg,suffix) {
	bot.sendMessage(character[msg.author.id].userChannel, msg.author + " I've got you in at " + character[msg.author.id].height + ". Tell me, how much do you weight?\nYou can be...");
	setTimeout(function () { bot.sendMessage(character[msg.author.id].userChannel, callArray(weights)); }, 500);
	character[msg.author.id].currentAt = "weight";
}

function onClass(bot,msg,suffix) {
	bot.sendMessage(character[msg.author.id].userChannel, msg.author + " You are " + character[msg.author.id].weight + "? OK. What is your Class?\nYou can be...");
	setTimeout(function () { bot.sendMessage(character[msg.author.id].userChannel, callArray(classes)); }, 500);
	character[msg.author.id].currentAt = "class";
}

function onHairLength(bot,msg,suffix) {
	bot.sendMessage(character[msg.author.id].userChannel, msg.author + " You've become a " + character[msg.author.id].classType + "!!! Now, hair. How long is your hair?\nIt can be...");
	setTimeout(function () { bot.sendMessage(character[msg.author.id].userChannel, callArray(hairLengths)); }, 500);
	character[msg.author.id].currentAt = "hairlength";
}

function onHairType(bot,msg,suffix) {
	bot.sendMessage(character[msg.author.id].userChannel, msg.author + " I like " + character[msg.author.id].hairLength + ". But what style?\nPick from...");
	setTimeout(function () { bot.sendMessage(character[msg.author.id].userChannel, callArray(hairTypes)); }, 500);
	character[msg.author.id].currentAt = "hairtype";
}

function onHairColor(bot,msg,suffix) {
	bot.sendMessage(character[msg.author.id].userChannel, msg.author + " Alright, " + character[msg.author.id].hairType + ". What color is your hair?\nTry...");
	setTimeout(function () { bot.sendMessage(character[msg.author.id].userChannel, callArray(hairColors)); }, 500);
	character[msg.author.id].currentAt = "haircolor";
}

function onEyesType(bot,msg,suffix) {
	if (character[msg.author.id].hairLength == "bald") {
		bot.sendMessage(character[msg.author.id].userChannel, msg.author + " Bald is completely fine. On to your eyes. What kind of eyes do you have?\nYou can have...");
		setTimeout(function () { bot.sendMessage(character[msg.author.id].userChannel, callArray(eyesTypes)); }, 500);
		character[msg.author.id].currentAt = "eyestype";
	} else {
		bot.sendMessage(character[msg.author.id].userChannel, msg.author + " That " + character[msg.author.id].hairColor + " looks nice. You still need eyes.\nWhat type?");
		setTimeout(function () { bot.sendMessage(character[msg.author.id].userChannel, callArray(eyesTypes)); }, 500);
		character[msg.author.id].currentAt = "eyestype";
	}
}

function onEyesColor(bot,msg,suffix) {
	bot.sendMessage(character[msg.author.id].userChannel, msg.author + " Almost done, " + character[msg.author.id].eyesType + "-eyes. What color are your eyes?\nChoose...");
	setTimeout(function () { bot.sendMessage(character[msg.author.id].userChannel, callArray(eyesColors)); }, 500);
	character[msg.author.id].currentAt = "eyescolor";
}

function onConfirm(bot,msg,suffix) {
	if (character[msg.author.id].hairLength != "bald") {
		bot.sendMessage(character[msg.author.id].userChannel, msg.author + " Just to be sure we have everything right, you are a " + character[msg.author.id].age + " aged, "
		+ character[msg.author.id].height + " height, " + character[msg.author.id].weight + " weighted " + character[msg.author.id].gender
		+ " " + character[msg.author.id].race + " " + character[msg.author.id].classType + " with " + character[msg.author.id].hairLength
		+ " " + character[msg.author.id].hairType + " " + character[msg.author.id].hairColor + " hair and " + character[msg.author.id].eyesType
		+ " " + character[msg.author.id].eyesColor + " eyes. Is that right? !! yes or !! no.")
	} else {
		bot.sendMessage(character[msg.author.id].userChannel, msg.author + " Just to be sure we have everything right, you are a " + character[msg.author.id].age + ", "
		+ character[msg.author.id].height + ", " + character[msg.author.id].weight + " weighted " + character[msg.author.id].gender
		+ " " + character[msg.author.id].race + " " + character[msg.author.id].classType + " with a bald head and " + character[msg.author.id].eyesType
		+ " " + character[msg.author.id].eyesColor + " eyes. Is that right? !! yes or !! no")
	}
	character[msg.author.id].currentAt = "confirm";
}

function onCompleted(bot,msg,suffix) {
	character[msg.author.id].currentAt = "001";
	character[msg.author.id].onOrOff = "online";
	character[msg.author.id].position = "standing";
	for (var i = 0; i < bot.users.length; i++) {
		if (character[bot.users[i].id] && character[bot.users[i].id].currentAt && character[bot.users[i].id].currentAt == character[msg.author.id].currentAt
		&& bot.users[i].id != msg.author.id && character[bot.users[i].id].onOrOff == "online") {
			bot.sendMessage(character[bot.users[i].id].userChannel, msg.author.username + " entered the world!");
		}
	}
	require("fs").writeFile(charsFile,JSON.stringify(character,null,4), function (e) {
		if (e) {
			console.log("Error writing character.json: " + e);
			bot.sendMessage(character[msg.author.id].userChannel, msg.author + " There was a problem saving your character!!! D:");
			character[msg.author.id].currentAt = "confirm";
		} else {
			bot.sendMessage(character[msg.author.id].userChannel, msg.author + " Your character file was saved!");
			setTimeout(function () { bot.sendMessage(character[msg.author.id].userChannel, msg.author + " Try to .look around first!") }, 1000);
			setTimeout(function () { bot.sendMessage(character[msg.author.id].userChannel, msg.author + " You can also try .help for a bit of information!") }, 2000);
			for (var i = 0; i < bot.channels.length; i++) {
				if (bot.channels[i].name == msg.author.username.toLowerCase()) {
					character[msg.author.id].userChannel = bot.channels[i].id;
					i = 99999999999999;
				}
			}
		}
	});
}

function callArray(array) {
	info = "";
	for (var i in theme[array]) {
		info += "!! " + theme[array[i]] + "\t";
		answerSet.push(theme[array[i]]);
	}
	return info;
}

expFuncs = {
}

expCmds = {
	"setup": {
		description: "Used to set up your character!",
		process: function (bot,msg,suffix) {
			console.log(character[msg.author.id]);
			if (!character[msg.author.id]) {
				character[msg.author.id] = {};
				onStart(bot,msg,suffix);
				for (var i in bot.channels) {
					if (bot.channels[i].name == msg.author.username.toLowerCase()) {
						character[msg.author.id].userChannel = bot.channels[i].id;
					}
				}
			} else {
				bot.sendMessage(character[msg.author.id].userChannel, msg.author + " You've already set up your character!!! If you want to start over, try !delchar");
			}
		}
	},
	"!": {
		description: " ",
		hidden: true,
		process: function(bot,msg,suffix) {
			var answer = suffix.toLowerCase().replace(/[^a-z]/gi,'');
			switch(character[msg.author.id].currentAt) {
				case "start":
					if (answer == "yes") {
						onGender(bot,msg,suffix);
					} else {
						bot.sendMessage(character[msg.author.id].userChannel, msg.author + " Oh, OK. Just let me know when you're ready by saying !! yes");
					}
					break;
				case "gender":
					if (answer == "male") {
						character[msg.author.id].gender = "male";
						setTimeout(onRace(bot,msg,suffix), 1000);
					} else if (answer == "female") {
						character[msg.author.id].gender = "female";
						setTimeout(onRace(bot,msg,suffix), 1000);
					} else {
						bot.sendMessage(character[msg.author.id].userChannel, msg.author + errorString + "!! male or !! female");
					}
					break;
				case "race":
					if (answerSet.indexOf(answer) != -1) {
						character[msg.author.id].race = answer;
						setTimeout(onAge(bot,msg,suffix), 1000);
					} else {
						bot.sendMessage(character[msg.author.id].userChannel, msg.author + errorString + callArray(races));
					}
					break;
				case "age":
					if (answerSet.indexOf(answer) != -1) {
						character[msg.author.id].age = answer;
						setTimeout(onHeight(bot,msg,suffix), 1000);
					} else {
						bot.sendMessage(character[msg.author.id].userChannel, msg.author + errorString + callArray(ages));
					}
					break;
				case "height":
					if (answerSet.indexOf(answer) != -1) {
						character[msg.author.id].height = answer;
						setTimeout(onWeight(bot,msg,suffix), 1000);
					} else {
						bot.sendMessage(character[msg.author.id].userChannel, msg.author + errorString + callArray(heights));
					}
					break;
				case "weight":
					if (answerSet.indexOf(answer) != -1) {
						character[msg.author.id].weight = answer;
						setTimeout(onClass(bot,msg,suffix), 1000);
					} else {
						bot.sendMessage(character[msg.author.id].userChannel, msg.author + errorString + callArray(weights));
					}
					break;
				case "class":
					if (answerSet.indexOf(answer) != -1) {
						character[msg.author.id].classType = answer;
						setTimeout(onHairLength(bot,msg,suffix), 1000);
					} else {
						bot.sendMessage(character[msg.author.id].userChannel, msg.author + errorString + callArray(classes));
					}
					break;
				case "hairlength":
					if (answerSet.indexOf(answer) != -1) {
						character[msg.author.id].hairLength = answer;
						if (character[msg.author.id].hairLength == "bald") {
							character[msg.author.id].hairType = " ";
							character[msg.author.id].hairColor = " ";
							setTimeout(onEyesType(bot,msg,suffix), 1000);
						} else {
							setTimeout(onHairType(bot,msg,suffix), 1000);
						}
					} else {
						bot.sendMessage(character[msg.author.id].userChannel, msg.author + errorString + callArray(hairLengths));
					}
					break;
				case "hairtype":
					if (answerSet.indexOf(answer) != -1) {
						character[msg.author.id].hairType = answer;
						setTimeout(onHairColor(bot,msg,suffix), 1000);
					} else {
						bot.sendMessage(character[msg.author.id].userChannel, msg.author + errorString + callArray(hairTypes));
					}
					break;
				case "haircolor":
					if (answerSet.indexOf(answer) != -1) {
						character[msg.author.id].hairColor = answer;
						setTimeout(onEyesType(bot,msg,suffix), 1000);
					} else {
						bot.sendMessage(character[msg.author.id].userChannel, msg.author + errorString + callArray(hairColors));
					}
					break;
				case "eyestype":
					if (answerSet.indexOf(answer) != -1) {
						character[msg.author.id].eyesType = answer;
						setTimeout(onEyesColor(bot,msg,suffix), 1000);
					} else {
						bot.sendMessage(character[msg.author.id].userChannel, msg.author + errorString + callArray(eyesTypes));
					}
					break;
				case "eyescolor":
					if (answerSet.indexOf(answer) != -1) {
						character[msg.author.id].eyesColor = answer;
						setTimeout(onConfirm(bot,msg,suffix), 1000);
					} else {
						bot.sendMessage(character[msg.author.id].userChannel, msg.author + errorString + callArray(eyesColors));
					}
					break;
				case "confirm":
					if (answer == "yes") {
						onCompleted(bot,msg,suffix);
					} else if (answer == "no") {
						bot.sendMessage(character[msg.author.id].userChannel, msg.author + " Oh, OK. Let's just start over again.");
						setTimeout(onGender(bot,msg,suffix), 1000);
					} else {
						bot.sendMessage(character[msg.author.id].userChannel, msg.author + " I can't do anything unless you say !! yes or !! no");
					}
					break;
				default:
					bot.sendMessage(character[msg.author.id].userChannel, msg.author + " I'm not sure what you're trying, so I'm just ignoring it.");
			}			
		}
	},
	"delchar": {
		description: "Used to delete your character file. WARNING: WILL DELETE WITHOUT CONFIRMATION.",
		process: function (bot,msg,suffix) {
			delete character[msg.author.id];
			require("fs").writeFile(charsFile,JSON.stringify(character,null,4), function (e) {
				if (e) {
					console.log("Error writing character.json: " + e);
					bot.sendMessage(character[msg.author.id].userChannel, msg.author + " There was a problem deleting your character!!! D:");
				} else {
					bot.sendMessage(character[msg.author.id].userChannel, msg.author + " Your character file was deleted!");
				}
			});
		}
	},
	"longdesc": {
		description: "Used to create a better description of yourself.",
		hidden: true,
		process: function (bot,msg,suffix) {
			character[msg.author.id].longdesc = suffix;
			require("fs").writeFile(charsFile,JSON.stringify(character,null,4), function (e) {
				if (e) {
					console.log("Error writing character.json: " + e);
					bot.sendMessage(character[msg.author.id].userChannel, msg.author + " There was a problem saving your description!!! D:");
				} else {
					bot.sendMessage(character[msg.author.id].userChannel, msg.author + " Your description was saved!");
				}
			});
		}
	},
	"deldesc": {
		description: "Used to delete your better description.",
		hidden: true,
		process: function (bot,msg,suffix) {
			delete character[msg.author.id].longDesc;
			require("fs").writeFile(charsFile,JSON.stringify(character,null,4), function (e) {
				if (e) {
					console.log("Error writing character.json: " + e);
					bot.sendMessage(character[msg.author.id].userChannel, msg.author + " There was a problem deleting your description!!! D:");
				} else {
					bot.sendMessage(character[msg.author.id].userChannel, msg.author + " Your description was deleted!");
				}
			});
		}
	},
	"nextsetup": {
		description: "Used to get what setup question you were on.",
		process: function (bot,msg,suffix) {
			if (!character[msg.author.id].currentAt) {
				bot.sendMessage(character[msg.author.id].userChannel, msg.author + " You haven't started your character yet!!!");
			} else {
				bot.sendMessage(character[msg.author.id].userChannel, msg.author + " Continuing.....");
				switch(character[msg.author.id].currentAt) {
					case "start":
						onStart(bot,msg,suffix);
						break;
					case "gender":
						onGender(bot,msg,suffix);
						break;
					case "race":
						onRace(bot,msg,suffix);
						break;
					case "age":
						onAge(bot,msg,suffix);
						break;
					case "height":
						onHeight(bot,msg,suffix);
						break;
					case "weight":
						onWeight(bot,msg,suffix);
						break;
					case "class":
						onClass(bot,msg,suffix);
						break;
					case "hairlength":
						onHairLength(bot,msg,suffix);
						break;
					case "hairtype":
						onHairType(bot,msg,suffix);
						break;
					case "haircolor":
						onHairColor(bot,msg,suffix);
						break;
					case "eyestype":
						onEyesType(bot,msg,suffix);
						break;
					case "eyescolor":
						onEyesColor(bot,msg,suffix);
						break;
					case "confirm":
						onConfirm(bot,msg,suffix);
						break;
					default:
						bot.sendMessage(character[msg.author.id].userChannel, msg.author + " I'm not sure what you're trying, so I'm just ignoring it.");
				}
			}
		}
	}
}

module.exports = [ expFuncs, expCmds ];
