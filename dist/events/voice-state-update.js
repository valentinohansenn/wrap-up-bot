"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const voice_state_manager_1 = require("../utils/voice-state-manager");
module.exports = {
    name: discord_js_1.Events.VoiceStateUpdate,
    async execute(oldState, newState) {
        const voiceStateManager = voice_state_manager_1.VoiceStateManager.getInstance();
        voiceStateManager.updateVoiceState(oldState, newState);
    }
};
