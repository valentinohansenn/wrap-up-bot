import { Collection, CommandInteraction, Events, MessageFlags, Client } from "discord.js"

declare module "discord.js" {
	export interface Client {
		cooldown: Collection<string, Collection<string, number>>
	}
}

module.exports = {
	cooldown: 5,
	name: Events.InteractionCreate,
   on: true,
	async execute(interaction: CommandInteraction) {
		if (!interaction.isChatInputCommand()) return

		const command = interaction.client.commands.get(interaction.commandName)

		if (!command) {
			console.error(
				`No command matching ${interaction.commandName} was found.`
			)
			return
		}

		const { cooldown } = interaction.client

		if (!cooldown.has(command.data.name)) {
			cooldown.set(command.data.name, new Collection())
		}

		const now = Date.now()
		const timestamps = cooldown.get(command.data.name)!
		const defaultCooldown = 3
		const cooldownAmount = (command.cooldown || defaultCooldown) * 1000

		if (timestamps.has(interaction.user.id)) {
			const expirationTime =
				(timestamps.get(interaction.user.id) ?? 0) + cooldownAmount

			if (now < expirationTime) {
				const timeLeft = (expirationTime - now) / 1000
				return interaction.reply({
					content: `Please wait, you are on a cooldown for \`${command.data.name}\`. You can use it again <t:${timeLeft}:R>.`,
					flags: MessageFlags.Ephemeral,
				})
			}
		}

		timestamps.set(interaction.user.id, now)
		setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount)

		try {
			await command.execute(interaction)
		} catch (error) {
			console.error(error)
			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({
					content: "There was an error while executing this command!",
					flags: MessageFlags.Ephemeral,
				})
			} else {
				await interaction.reply({
					content: "There was an error while executing this command!",
					flags: MessageFlags.Ephemeral,
				})
			}
		}
	},
}
