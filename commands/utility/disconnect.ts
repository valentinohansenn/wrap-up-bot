import {
	AutocompleteInteraction,
	ChatInputCommandInteraction,
	InteractionContextType,
	PermissionFlagsBits,
	SlashCommandBuilder,
} from "discord.js"
import { AutocompleteActions } from "../../actions/autocomplete"

module.exports = {
	name: "disconnect",
	data: new SlashCommandBuilder()
		.setName("disconnect")
		.setDescription("Disconnect user(s) from the goddamn voice channel! 🤬")
		.addStringOption((option) =>
			option
				.setName("target")
				.setDescription("Someone to be executed out of the call.")
				.setRequired(true)
				.setAutocomplete(true)
		)
		.setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
		.setContexts(InteractionContextType.Guild),
	async autocomplete(interaction: AutocompleteInteraction) {
		await AutocompleteActions.handleVoiceMembersAutocomplete(interaction)
	},
	async execute(interaction: ChatInputCommandInteraction) {
		const commandName = interaction.options.getString("target", true)

		const member = interaction.member

		await interaction.reply(
			`This command was run by ${interaction.user.username}, who joined on ${
				member && "joinedAt" in member ? member.joinedAt : "unknown date"
			}. Targetted to: ${commandName}`
		)
	},
}
