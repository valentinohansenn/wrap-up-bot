import {
	Collection,
	CommandInteraction,
	Events,
	MessageFlags,
	Client,
} from "discord.js"

declare module "discord.js" {
	export interface Client {
		cooldown: Collection<string, Collection<string, number>>
	}
}

module.exports = {
	cooldown: 5,
	name: Events.InteractionCreate,
	async execute(interaction: CommandInteraction) {
		const command = interaction.client.commands.get(interaction.commandName)

		if (!command) {
			console.error(
				`No command matching ${interaction.commandName} was found.`
			)
			return
		}

      console.log("command in interaction create", command)

		if (interaction.isChatInputCommand()) {
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
		} else if (interaction.isAutocomplete()) {
			try {
			await command.autocomplete(interaction)
		 } catch (error) {
			console.error(error)
		 }
		}
	},
}
