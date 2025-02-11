import { AutocompleteInteraction } from "discord.js"
import { MembersOptions } from "../types/member"
import { VoiceStateManager } from "../utils/voice-state-manager"

export class AutocompleteActions {
	private static getStaticChoices(interaction: AutocompleteInteraction) {
		const choices: MembersOptions[] = []

		const member = interaction.member
		const voiceChannels = interaction.guild?.channels.cache.filter(
			(channel) => channel.isVoiceBased()
		)

		// Check if there exists any members in the voice channels
		const hasVoiceMembers = voiceChannels?.some(
			(channel) => channel.members.size > 0
		)

		if (!hasVoiceMembers) {
			return choices
		}

		// Get all the members in the voice channels
		const everyone =
			voiceChannels
				?.map((channel) => Array.from(channel.members.keys()))
				.flat() ?? []

		const afk =
			voiceChannels
				?.map((channel) =>
					Array.from(
						channel.members
							.filter(
								(member) =>
									member.voice.selfDeaf || member.voice.selfMute
							)
							.keys()
					)
				)
				.flat() ?? []

		// Check if there exists any members in the voice channels
		if (everyone?.length > 0) {
			choices.push({
				name: "Everyone! Literally, all of em'",
				value: everyone.join(","),
			})
		}

		// Check if the command user is in a voice channel
		if (member && "voice" in member && member.voice.channel) {
			choices.push({ name: "Me, myself and I", value: member.id })
		}

		// Check if there exists AFK users in a voice channel
		if (afk?.length > 0) {
			choices.push({
				name: "AFK bit- I mean, members",
				value: afk.join(","),
			})
		}

		return choices
	}

	private static getVoiceMembers(interaction: AutocompleteInteraction) {
		const voiceMembers: MembersOptions[] = []
		const voiceStateManager = VoiceStateManager.getInstance()

		const commandUserVoiceChannel =
			interaction.member && "voice" in interaction.member
				? interaction.member.voice.channel
				: null

		if (commandUserVoiceChannel) {
			console.log("command user voice", commandUserVoiceChannel)
			const channelMembers = voiceStateManager.getVoiceMembers(
				commandUserVoiceChannel.id
			)

			channelMembers.forEach(async (memberId) => {
				const member = await interaction.guild?.members.fetch(memberId)
				if (!member) return
				if (member.user.bot) return
				if (memberId === interaction.user.id) return

				voiceMembers.push({ name: member.displayName, value: member.id })
			})
		}

		return voiceMembers
	}

	private static filterChoices(
		choices: MembersOptions[],
		focusedValue: string
	) {
		return choices
			.filter((choice) => choice.name.toLowerCase().includes(focusedValue))
			.slice(0, 25)
	}

	static async handleVoiceMembersAutocomplete(
		interaction: AutocompleteInteraction
	) {
		const focusedValue = interaction.options.getFocused()
		const voiceMembers = this.getVoiceMembers(interaction)
		const allChoices = [
			...this.getStaticChoices(interaction),
			...voiceMembers,
		]
		const filtered = this.filterChoices(allChoices, focusedValue)
		await interaction.respond(filtered)
	}
}
