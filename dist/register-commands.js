"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const dotenv_1 = __importDefault(require("dotenv"));
const commands = [
    {
        name: "hey",
        description: "Interact with your beloved bot!",
    },
];
dotenv_1.default.config();
if (!process.env.DISCORD_TOKEN) {
    console.error("Please provide a valid Discord bot token.");
    process.exit(1);
}
const rest = new discord_js_1.REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);
(async () => {
    try {
        if (!process.env.DISCORD_CLIENT_ID) {
            console.error("Please provide a valid Discord client ID.");
            process.exit(1);
        }
        if (!process.env.DISCORD_GUILD_ID) {
            console.error("Please provide a valid Discord guild ID.");
            process.exit(1);
        }
        console.log("Started refreshing application (/) commands.");
        await rest.put(discord_js_1.Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID, process.env.DISCORD_GUILD_ID), { body: commands });
        console.log("Successfully reloaded application (/) commands.");
        // Exit the process
        process.exit(0);
    }
    catch (error) {
        console.error(error);
        process.exit(1);
    }
})();
