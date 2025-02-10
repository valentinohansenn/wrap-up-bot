"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const autocomplete_1 = require("../../actions/autocomplete");
module.exports = {
    name: "disconnect",
    data: new discord_js_1.SlashCommandBuilder()
        .setName("disconnect")
        .setDescription("Disconnect user(s) from the goddamn voice channel! 🤬")
        .addStringOption((option) => option
        .setName("target")
        .setDescription("Someone to be executed out of the call.")
        .setRequired(true)
        .setAutocomplete(true))
        .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.KickMembers)
        .setContexts(discord_js_1.InteractionContextType.Guild),
    async autocomplete(interaction) {
        await autocomplete_1.AutocompleteActions.handleVoiceMembersAutocomplete(interaction);
    },
    async execute(interaction) {
        const commandName = interaction.options.getString("target", true);
        const member = interaction.member;
        await interaction.reply(`This command was run by ${interaction.user.username}, who joined on ${member && "joinedAt" in member ? member.joinedAt : "unknown date"}. Targetted to: ${commandName}`);
    },
};
