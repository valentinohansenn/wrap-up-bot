"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
module.exports = {
    name: "reload",
    data: new discord_js_1.SlashCommandBuilder()
        .setName("reload")
        .setDescription("Reloads a command.")
        .addStringOption((option) => option
        .setName("command")
        .setDescription("The command to reload.")
        .setRequired(true)),
    async execute(interaction) {
        const commandName = interaction.options
            .getString("command", true)
            .toLowerCase();
        const command = interaction.client.commands.get(commandName);
        if (!command) {
            return interaction.reply(`There is no command with name \`${commandName}\`!`);
        }
        delete require.cache[require.resolve(`./commands/utility/${command.data.name}.ts`)];
        try {
            const newCommand = require(`./${command.data.name}.ts`);
            interaction.client.commands.set(newCommand.data.name, newCommand);
            await interaction.reply(`Command \`${newCommand.data.name}\` was reloaded!`);
        }
        catch (error) {
            console.error(error);
            await interaction.reply(`There was an error while reloading a command \`${command.data.name}\`:\n\`${error.message}\``);
        }
    },
};
//# sourceMappingURL=reload.js.map