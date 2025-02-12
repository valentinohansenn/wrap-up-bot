import { Client, Events, VoiceState } from "discord.js"
import { VoiceStateManager } from "../utils/voice-state-manager"

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client: Client) {
        console.log('=== Bot Ready ===');
        console.log(`Logged in as ${client.user?.tag}`);
        console.log(`Serving ${client.guilds.cache.size} guilds`);
        console.log(`With ${client.users.cache.size} users`);
        console.log('================');

        // Get and log guilds information
        const guilds = await client.guilds.fetch()
        for (const [, guild] of guilds) {
            const fullGuild = await guild.fetch()
            const voiceStates = fullGuild.voiceStates.cache

            console.log(`Connected to guild: ${fullGuild.name}`);

            // Log voice states
            voiceStates.forEach((voiceState) => {
                if (voiceState.channelId) {
                    VoiceStateManager.getInstance().updateVoiceState(
                        {} as VoiceState,
                        voiceState
                    )
                    console.log(
                        `🔊 ${voiceState.member?.user?.tag} is in ${voiceState.channel?.name}`
                    )
                }
            })
        }
    },
}
