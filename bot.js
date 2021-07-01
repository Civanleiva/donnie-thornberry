require("dotenv").config();
const Discord = require("discord.js");

const {
	TOKEN,
	VOICE_CHANNEL_ID,
	GUILD_ID,
	NELSON_ID
} = process.env;

let guild, voiceChannel, connection, Nelson, broadcast;

const Client = new Discord.Client();

Client.on("ready", async () => {
	try {
		guild = await Client.guilds.fetch(GUILD_ID);
		voiceChannel = guild.channels.cache.get(VOICE_CHANNEL_ID);
		broadcast = Client.voice.createBroadcast();
	} catch (error) {
		console.log(error);
		process.exit(1);
	}
	console.log("Donnie Thornberry Online...");
});

Client.on("voiceStateUpdate", async (oldState, newState) => {
	console.log("Help");
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
	console.log(speaking);
	if (member.id === Nelson.id && speaking.bitfield) {
		(play = () => {
			broadcast.play("donnie.mp3")
			connection.play(broadcast).on('finish', play);
		})();
	} else if (member.id === Nelson.id && speaking.bitfield === 0) {
		broadcast.end();
	}
});

Client.login(TOKEN);