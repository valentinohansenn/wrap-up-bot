"use strict"
Object.defineProperty(exports, "__esModule", { value: true })
const discord_js_1 = require("discord.js")
const autocomplete_1 = require("../../actions/autocomplete")
const timer_1 = require("../../constants/timer")
module.exports = {
	name: "disconnect",
	data: new discord_js_1.SlashCommandBuilder()
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
				.setName("timer")
				.setDescription("Disconnect after specified time")
				.setRequired(true)
				.addChoices(timer_1.TIMER)
		)
		.setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.MoveMembers)
		.setContexts(discord_js_1.InteractionContextType.Guild),
	async autocomplete(interaction) {
		await autocomplete_1.AutocompleteActions.handleVoiceMembersAutocomplete(
			interaction
		)
	},
	async execute(interaction) {
		const targetId = interaction.options.getString("target", true)
		const timer = interaction.options.getString("timer") || "0"
		const timerMinutes = parseInt(timer)
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
		const formatTimeMessage = (minutes) => {
			if (minutes === 0) return "right now"
			if (minutes === 1) return "in a minute"
			if (minutes === 5) return "in 5 minutes"
			if (minutes === 10) return "in 10 minutes"
			if (minutes === 15) return "in 15 minutes"
			if (minutes === 30) return "in 30 minutes"
			if (minutes === 60) return "in an hour"
			return `in ${minutes / 60} hours`
		}
		if (timerMinutes > 0) {
			// Get the channel for follow-up messages
			const channel = interaction.channel
			if (!channel || !("send" in channel)) return
			// Schedule the disconnect
			const timerMs = timerMinutes * 60 * 1000
			const targetMember = await interaction.guild?.members.fetch(targetId)
			const scheduledTime = new Date(
				Date.now() + timerMs
			).toLocaleTimeString()
			await interaction.reply(
				`Scheduled to disconnect ${
					targetId.includes(",") ? "members" : targetMember?.displayName
				} ${formatTimeMessage(timerMinutes)} (at ${scheduledTime}).`
			)
			setTimeout(async () => {
				try {
					const result = await executeDisconnect()
					if (channel) {
						if (typeof result === "number") {
							await channel.send(
								`Successfully disconnected ${result} members from the voice channel (scheduled ${formatTimeMessage(
									timerMinutes
								)})!`
							)
						} else if (result) {
							await channel.send(
								`Successfully disconnected ${
									result.displayName
								} from the voice channel (was scheduled ${formatTimeMessage(
									timerMinutes
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
			}, timerMs)
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
