"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
module.exports = {
    name: "disconnect",
    data: new discord_js_1.SlashCommandBuilder()
        .setName("disconnect")
        .setDescription("Disconnect user(s) from the goddamn voice channel!")
        .addStringOption((option) => option
        .setName("target")
        .setDescription("Someone to be executed out of the call.")
        .setRequired(true)
        // .addChoices(
        // 	{
        // 		name: "Everyone",
        // 		value: "all",
        // 	},
        // 	{
        // 		name: "Current User",
        // 		value: "self",
        // 	},
        // 	{
        // 		name: "AFK Users",
        // 		value: "afk",
        // 	}
        // )
        .setAutocomplete(true))
        .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.KickMembers)
        .setContexts(discord_js_1.InteractionContextType.Guild),
    async autocomplete(interaction) {
        // Handle the auto-completion response
        const focusedValue = interaction.options.getFocused();
        const choices = [
            "Popular Topics: Threads",
            "Sharding: Getting started",
            "Library: Voice Connections",
            "Interactions: Replying to slash commands",
            "Popular Topics: Embed preview",
        ];
        const filtered = choices.filter((choice) => choice.startsWith(focusedValue));
        await interaction.respond(filtered.map((choice) => ({ name: choice, value: choice })));
    },
    async execute(interaction) {
        const commandName = interaction.options.getString("target", true);
        const member = interaction.member;
        await interaction.reply(`This command was run by ${interaction.user.username}, who joined on ${member && "joinedAt" in member ? member.joinedAt : "unknown date"}. Targetted to: ${commandName}`);
    },
};
