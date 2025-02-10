"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutocompleteActions = void 0;
class AutocompleteActions {
    static STATIC_CHOICES = [
        { name: "Whoever's in the call, get out!", value: "all" },
        { name: "Me, myself and I, bye!", value: "self" },
        { name: "Those AFK son of a bit-", value: "afk" },
    ];
    static getVoiceMembers(interaction) {
        const voiceMembers = [];
        const voiceChannels = interaction.guild?.channels.cache.filter((channel) => channel.isVoiceBased());
        voiceChannels?.forEach((channel) => {
            channel.members?.forEach((member) => {
                voiceMembers.push({ name: member.displayName, value: member.id });
            });
        });
        return voiceMembers;
    }
    static filterChoices(choices, focusedValue) {
        return choices.filter((choice) => choice.name.toLowerCase().includes(focusedValue)).slice(0, 25);
    }
    static async handleVoiceMembersAutocomplete(interaction) {
        const focusedValue = interaction.options.getFocused();
        const voiceMembers = this.getVoiceMembers(interaction);
        const allChoices = [...this.STATIC_CHOICES, ...voiceMembers];
        const filtered = this.filterChoices(allChoices, focusedValue);
        await interaction.respond(filtered);
    }
}
exports.AutocompleteActions = AutocompleteActions;
