import fs from "node:fs"
import path from "node:path"
import dotenv from "dotenv"
import { Client, Collection, GatewayIntentBits } from "discord.js"

// Define custom client type with additional properties
declare module "discord.js" {
	export interface Client {
		commands: Collection<any, any>
		cooldowns: Collection<any, any>
	}
}

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
}) as Client

client.commands = new Collection()
client.cooldowns = new Collection()

// Set all commands from the command files to the client
const foldersPath = path.join(__dirname, "commands")
const commandFolders = fs.readdirSync(foldersPath)

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder)
	const commandFiles = fs
		.readdirSync(commandsPath)
		.filter((file) => file.endsWith(".ts"))
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file)
		const command = require(filePath)
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ("data" in command && "execute" in command) {
			client.commands.set(command.data.name, command)
		} else {
			console.log(
				`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
			)
		}
	}
}

// Get all event files and set them to the client based on their type
const eventsPath = path.join(__dirname, "events")
const eventFiles = fs
	.readdirSync(eventsPath)
	.filter((file) => file.endsWith(".ts"))

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file)
	const event = require(filePath)
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args))
	} else {
		client.on(event.name, (...args) => event.execute(...args))
	}
}

// Login to Discord with your app's token
client.login(process.env.DISCORD_TOKEN)
