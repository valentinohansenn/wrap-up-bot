import { Client, GatewayIntentBits } from "discord.js"
import dotenv from "dotenv"

// Load environment variables from .env file
dotenv.config()

if (!process.env.DISCORD_TOKEN) {
	console.error("Please provide a valid Discord bot token.")
	process.exit(1)
}

// Create a new Discord client instance
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
	],
})

// Bot logs when it's ready
client.once("ready", () => {
	console.log(`${client.user?.username} is online!`)
})

// Listen for messages and log the sender's name
client.on("messageCreate", (message) => {
	if (message.author.bot) {
		// If the message is from a bot, stop further execution
		return
	}

	if (!message.member) {
		// If the message is a DM, stop further execution
		return
	}

	console.log(`${message.member.displayName} sent: ${message.content}`)
})

client.on("interactionCreate", (interaction) => {
	if (!interaction.isChatInputCommand()) {
		return
	}

	const { commandName } = interaction

	if (commandName === "hey") {
		interaction.reply("What's up, girl? Whatchu lookin' at?")
	}
})

// Login to Discord with your app's token
client.login(process.env.DISCORD_TOKEN)
