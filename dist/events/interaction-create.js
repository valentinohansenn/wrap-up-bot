"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
module.exports = {
    cooldown: 5,
    name: discord_js_1.Events.InteractionCreate,
    async execute(interaction) {
        const command = interaction.client.commands.get(interaction.commandName);
        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }
        console.log("command in interaction create", command);
        if (interaction.isChatInputCommand()) {
            try {
                await command.execute(interaction);
            }
            catch (error) {
                console.error(error);
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({
                        content: "There was an error while executing this command!",
                        flags: discord_js_1.MessageFlags.Ephemeral,
                    });
                }
                else {
                    await interaction.reply({
                        content: "There was an error while executing this command!",
                        flags: discord_js_1.MessageFlags.Ephemeral,
                    });
                }
            }
        }
        else if (interaction.isAutocomplete()) {
            try {
                await command.autocomplete(interaction);
            }
            catch (error) {
                console.error(error);
            }
        }
    },
};
