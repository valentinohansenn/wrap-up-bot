import { AutocompleteInteraction } from "discord.js";
import { MembersOptions } from "../types/member";

export class AutocompleteActions {
   private static readonly STATIC_CHOICES: MembersOptions[] = [
      { name: "Whoever's in the call, get out!", value: "all" },
      { name: "Me, myself and I, bye!", value: "self" },
      { name: "Those AFK son of a bit-", value: "afk" },
   ];

   private static getVoiceMembers(interaction: AutocompleteInteraction) {
      const voiceMembers: MembersOptions[] = [];

      const voiceChannels = interaction.guild?.channels.cache.filter(
         (channel) => channel.isVoiceBased()
      );

      voiceChannels?.forEach((channel) => {
         channel.members?.forEach((member) => {
            voiceMembers.push({ name: member.displayName, value: member.id });
         });
      });

      return voiceMembers
   }

   private static filterChoices(choices: MembersOptions[], focusedValue: string) {
      return choices.filter((choice) => choice.name.toLowerCase().includes(focusedValue)).slice(0, 25);
   }

   static async handleVoiceMembersAutocomplete(interaction: AutocompleteInteraction) {
      const focusedValue = interaction.options.getFocused();
      const voiceMembers = this.getVoiceMembers(interaction);
      const allChoices = [...this.STATIC_CHOICES, ...voiceMembers];
      const filtered = this.filterChoices(allChoices, focusedValue);
      await interaction.respond(filtered);
   }
}
