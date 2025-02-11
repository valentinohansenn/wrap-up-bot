import {
	AutocompleteInteraction,
	ChatInputCommandInteraction,
	InteractionContextType,
	PermissionFlagsBits,
	SlashCommandBuilder,
} from "discord.js"
import { AutocompleteActions } from "../../actions/autocomplete"
import { DELAY } from "../../constants/delay"

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
		.addStringOption((option) =>
			option
				.setName("delay")
				.setDescription("Disconnect after specified time")
				.setRequired(true)
				.addChoices(DELAY)
		)
		.setDefaultMemberPermissions(PermissionFlagsBits.MoveMembers)
		.setContexts(InteractionContextType.Guild),
	async autocomplete(interaction: AutocompleteInteraction) {
		await AutocompleteActions.handleVoiceMembersAutocomplete(interaction)
	},
	async execute(interaction: ChatInputCommandInteraction) {
		const targetId = interaction.options.getString("target", true)
		const delay = interaction.options.getString("delay") || "0"

		const delayMinutes = parseInt(delay)

		const executeDisconnect = async () => {
			// Disconnect the member(s) based on the autocomplete
			if (targetId.includes(",")) {
				const memberIds = targetId.split(",")
				let disconnectedMembers = 0

				for (const memberId of memberIds) {
					const member = await interaction.guild?.members.fetch(memberId)
					if (member?.voice.channel) {
						await member.voice.disconnect()
						disconnectedMembers++
					}
				}

				return disconnectedMembers
			} else {
				const member = await interaction.guild?.members.fetch(targetId)

				if (member?.voice.channel) {
					await member.voice.disconnect()
					return member
				}

				return null
			}
		}

		const formatTimeMessage = (minutes: number) => {
			if (minutes === 0) return "right now"
			if (minutes === 1) return "in a minute"
			if (minutes === 5) return "in 5 minutes"
			if (minutes === 10) return "in 10 minutes"
			if (minutes === 15) return "in 15 minutes"
			if (minutes === 30) return "in 30 minutes"
			if (minutes === 60) return "in an hour"
			return `in ${minutes / 60} hours`
		}

		if (delayMinutes > 0) {
			// Get the channel for follow-up messages
			const channel = interaction.channel
			if (!channel || !("send" in channel)) return

			// Schedule the disconnect
			const delayMs = delayMinutes * 60 * 1000
			const targetMember = await interaction.guild?.members.fetch(targetId)
			const scheduledTime = new Date(
				Date.now() + delayMs
			).toLocaleTimeString()

			await interaction.reply(
				`Scheduled to disconnect ${
					targetId.includes(",") ? "members" : targetMember?.displayName
				} ${formatTimeMessage(delayMinutes)} (at ${scheduledTime}).`
			)

			setTimeout(async () => {
				try {
					const result = await executeDisconnect()

					if (channel) {
						if (typeof result === "number") {
							await channel.send(
								`Successfully disconnected ${result} members from the voice channel (scheduled ${formatTimeMessage(
									delayMinutes
								)})!`
							)
						} else if (result) {
							await channel.send(
								`Successfully disconnected ${
									result.displayName
								} from the voice channel (was scheduled ${formatTimeMessage(
									delayMinutes
								)})!`
							)
						} else {
							await channel.send(
								"Target member(s) were not in a voice channel when the timer expired."
							)
						}
					}
				} catch (error) {
					console.error(error)
					if (channel) {
						await channel.send(
							"There was an error executing the scheduled disconnect."
						)
					}
				}
			}, delayMs)
		} else {
			// Immediate disconnect
			const result = await executeDisconnect()

			if (typeof result === "number") {
				await interaction.reply(
					`Successfully disconnected ${result} members from the voice channel!`
				)
			} else if (result) {
				await interaction.reply(
					`Successfully disconnected ${result.displayName} from the voice channel!`
				)
			} else {
				await interaction.reply({
					content: "Target member is not in a voice channel!",
					ephemeral: true,
				})
			}
		}
	},
}
