import { REST, Routes } from "discord.js"
import dotenv from "dotenv"

const commands = [
	{
		name: "hey",
		description: "Interact with your beloved bot!",
	},
]

dotenv.config()

if (!process.env.DISCORD_TOKEN) {
	console.error("Please provide a valid Discord bot token.")
	process.exit(1)
}

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN)

;(async () => {
	try {
		if (!process.env.DISCORD_CLIENT_ID) {
			console.error("Please provide a valid Discord client ID.")
			process.exit(1)
		}

		if (!process.env.DISCORD_GUILD_ID) {
			console.error("Please provide a valid Discord guild ID.")
			process.exit(1)
		}

		console.log("Started refreshing application (/) commands.")

		await rest.put(
			Routes.applicationGuildCommands(
				process.env.DISCORD_CLIENT_ID,
				process.env.DISCORD_GUILD_ID
			),
			{ body: commands }
		)

		console.log("Successfully reloaded application (/) commands.")
		// Exit the process
		process.exit(0)
	} catch (error) {
		console.error(error)
		process.exit(1)
	}
})()
