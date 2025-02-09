import { CommandInteraction, SlashCommandBuilder } from "discord.js";

module.exports = {
	data: new SlashCommandBuilder()
		.setName("disconnect now")
		.setDescription("Disconnect specific users from the voice channel right now!"),
   async execute(interaction: CommandInteraction): Promise<void> {
      await interaction.reply("What's up, girl? Whatchu lookin' at?");
   },
};
