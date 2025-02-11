import { VoiceState } from "discord.js";

export class VoiceStateManager {
   private static instance: VoiceStateManager;
   private voiceMembers: Map<string, Set<string>> = new Map(); // channelId -> Set of memberIds

   private constructor() {}

   static getInstance(): VoiceStateManager {
       if (!VoiceStateManager.instance) {
           VoiceStateManager.instance = new VoiceStateManager();
       }
       return VoiceStateManager.instance;
   }

   updateVoiceState(oldState: VoiceState, newState: VoiceState) {
       // Remove from old channel
       if (oldState.channelId) {
           const oldChannelMembers = this.voiceMembers.get(oldState.channelId);
           if (oldChannelMembers) {
               oldChannelMembers.delete(oldState.member!.id);
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
           this.voiceMembers.get(newState.channelId)!.add(newState.member!.id);
       }
   }

   getVoiceMembers(channelId: string): Set<string> {
       return this.voiceMembers.get(channelId) || new Set();
   }
}
