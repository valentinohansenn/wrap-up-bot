import { Client, Events, VoiceState } from "discord.js"
import { VoiceStateManager } from "../utils/voice-state-manager"

module.exports = {
	cooldown: 5,
	name: Events.ClientReady,
	once: true,
	async execute(client: Client) {
		const guilds = await client.guilds.fetch()
		for (const [, guild] of guilds) {
			const fullGuild = await guild.fetch()
			const voiceStates = fullGuild.voiceStates.cache
			console.log(
				`✅ Ready! Logged in as ${client?.user?.tag} in ${fullGuild?.name}`
			)
			voiceStates.forEach((voiceState) => {
            if (voiceState.channelId) {
               VoiceStateManager.getInstance().updateVoiceState({} as VoiceState, voiceState)
            }
				console.log(
					`🔊 ${voiceState.member?.user?.tag} is in ${voiceState.channel?.name}`
				)
			})
		}
	},
}
