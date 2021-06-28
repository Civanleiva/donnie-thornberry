require("dotenv").config();
const Discord = require("discord.js");

const {
	TOKEN,
	VOICE_CHANNEL_ID,
	GUILD_ID,
	NELSON_ID
} = process.env;

const Client = new Discord.Client();

let guild, voiceChannel, connection, Nelson;

Client.on("ready", async () => {
	try {
		guild = await Client.guilds.fetch(GUILD_ID);
		voiceChannel = guild.channels.cache.get(VOICE_CHANNEL_ID);
	} catch (error) {
		console.log(error);
		process.exit(1);
	}
	console.log("Donnie Thornberry Online...");
});

Client.on("voiceStateUpdate", async (oldState, newState) => {
	Nelson = voiceChannel.members.find(GuildMember => GuildMember.id === NELSON_ID);
	if (Nelson) {
		try {
			connection = await voiceChannel.join();
		} catch (error) {
			console.log(error);
		}
	} else {
		try {
			await voiceChannel.leave();
		} catch (error) {
			console.log(error);
		}
	}
});

Client.on("guildMemberSpeaking", (member, speaking) => {
	if (member.id === Nelson.id && speaking.bitfield) {
		(() => {
			connection.play("donnie.mp3");
		})();
	} else if (member.id === Nelson.id && speaking.bitfield === 0) {
		connection.pause(true);
	}
})

Client.login(TOKEN);