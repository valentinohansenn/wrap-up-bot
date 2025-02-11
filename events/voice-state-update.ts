import { Events, VoiceState } from "discord.js"
import { VoiceStateManager } from "../utils/voice-state-manager"

module.exports = {
    name: Events.VoiceStateUpdate,
    async execute(oldState: VoiceState, newState: VoiceState) {
        const voiceStateManager = VoiceStateManager.getInstance();
        voiceStateManager.updateVoiceState(oldState, newState);
    }
}
