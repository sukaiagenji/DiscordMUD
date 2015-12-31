# DiscordMUD
Welcome to the initial commit of DiscordMUD, based on discord.js, and already playable!!! Well... You can walk around and talk. That's about it...

#Installation
There are a few steps before you start using DiscordMUD for the first time. First, you must install node.js onto your system. A quick internet search for your operating system will show you how to do that. Then, you'll need to get discord.js. Just run<br>`npm install discord.js`<br>and everything will be set up for you. Finally, download and extract DiscordMUD to a folder, and move on to Setting up DiscordMUD!

#Setting up DiscordMUD
There are 7 settings you'll need to edit in settings.json, as well as auth.json. auth.json is self-explanatory. But the others.....

`discordjsLocation`<br>Simply the path to your discord.js installation. Hint: You're actually aiming for a folder.<br>
`botLocation`<br>Wherever the folder of your bot is. Since it's still a bot. 2easy.<br>
`loginMessage`<br>Whatever you want your bot to say when it logs in, so that you know she's online! Leave blank for no login message.<br>
`aiEnabled`<br>DiscordMUD can do AIML AI through PandoraBots!!! If you set this to true, she *must* have a botid set.<br>
`botid`<br>Simply the bot ID of the PandoraBot that you'll be using. I'll set instructions later, or just leave it.<br>
`aiRandomReply`<br>If you want Marina to randomly reply to guests, set this to true. She'll respond in any room!!!<br>
`aiIsolated`<br>If you don't want everyone spamming your chat with @s to your AI bot, make a text channel, and put the name here to isolate the AI @s.

#Usage
Be sure DiscordMUD is already on your server (AKA joined) before anything else. Once she's joined, make sure to edit the auth.json and settings.json files to your liking, then simply run `node DiscordMUD.js`. If everything has been set up correctly, you'll get a message with what files you're missing, and how many channels DiscordMUD is serving.

#Advanced
Check out the commands.js file for things like adminlvl and command disabling. Simply.....<br>
adminlvl can be any number, from 0 to 99 for a total of 100 levels. Basically, the higher a person's adminlvl, the more they can do. I only needed 5 levels, so 4 was my highest number.<br>
Most admin commands will be checked by DiscordMUD itself at a later time. Right now, you really only need 1 level for admin controls. Everyone else can stay without a level.<br>
Certain commands have a `disabled` variable. Setting a command's `disabled` to true removes the command from usage. Right now, the only 'plugin' left is gaem.js, which is required to run.

TODO: Explain AI setup through PandoraBots.

#DiscordMUD's Future
There's a LOT of functionality that I'm leaving out right now. You'll see a preliminary world file, items file, and NPC file. Items and NPCs are NOT WORKING YET.

#DiscordMUD's Past
If you've seen my previous bot called Marina, DiscordMUD is actually based on her. She has definitely come a long way from a simple pingpong bot. I added many little things, like !rules and !symbols, and even the ever so wonderful "SHAKE SHAKE" that everyone enjoyed. Now, she's turning into something totally different. I'll probably completely rewrite the code, keeping core functionality in. Just have to wait and see.....

#TODO

More commands. OMG more commands.
