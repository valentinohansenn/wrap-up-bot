"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoiceStateManager = void 0;
class VoiceStateManager {
    static instance;
    voiceMembers = new Map(); // channelId -> Set of memberIds
    constructor() { }
    static getInstance() {
        if (!VoiceStateManager.instance) {
            VoiceStateManager.instance = new VoiceStateManager();
        }
        return VoiceStateManager.instance;
    }
    updateVoiceState(oldState, newState) {
        // Remove from old channel
        if (oldState.channelId) {
            const oldChannelMembers = this.voiceMembers.get(oldState.channelId);
            if (oldChannelMembers) {
                oldChannelMembers.delete(oldState.member.id);
                if (oldChannelMembers.size === 0) {
                    this.voiceMembers.delete(oldState.channelId);
                }
            }
        }
        // Add to new channel
        if (newState.channelId) {
            if (!this.voiceMembers.has(newState.channelId)) {
                this.voiceMembers.set(newState.channelId, new Set());
            }
            this.voiceMembers.get(newState.channelId).add(newState.member.id);
        }
    }
    getVoiceMembers(channelId) {
        return this.voiceMembers.get(channelId) || new Set();
    }
}
exports.VoiceStateManager = VoiceStateManager;
