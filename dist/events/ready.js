"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const voice_state_manager_1 = require("../utils/voice-state-manager");
module.exports = {
    cooldown: 5,
    name: discord_js_1.Events.ClientReady,
    once: true,
    async execute(client) {
        const guilds = await client.guilds.fetch();
        for (const [, guild] of guilds) {
            const fullGuild = await guild.fetch();
            const voiceStates = fullGuild.voiceStates.cache;
            console.log(`✅ Ready! Logged in as ${client?.user?.tag} in ${fullGuild?.name}`);
            voiceStates.forEach((voiceState) => {
                if (voiceState.channelId) {
                    voice_state_manager_1.VoiceStateManager.getInstance().updateVoiceState({}, voiceState);
                }
                console.log(`🔊 ${voiceState.member?.user?.tag} is in ${voiceState.channel?.name}`);
            });
        }
    },
};
