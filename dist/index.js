"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables from .env file
dotenv_1.default.config();
if (!process.env.DISCORD_TOKEN) {
    console.error("Please provide a valid Discord bot token.");
    process.exit(1);
}
// Create a new Discord client instance
const client = new discord_js_1.Client({
    intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.MessageContent,
    ],
});
// Bot logs when it's ready
client.once("ready", () => {
    console.log(`${client.user?.username} is online!`);
});
// Listen for messages and log the sender's name
client.on("messageCreate", (message) => {
    if (message.author.bot) {
        // If the message is from a bot, stop further execution
        return;
    }
    if (!message.member) {
        // If the message is a DM, stop further execution
        return;
    }
    console.log(`${message.member.displayName} sent: ${message.content}`);
});
client.on("interactionCreate", (interaction) => {
    if (!interaction.isChatInputCommand()) {
        return;
    }
    const { commandName } = interaction;
    console.log({ commandName });
    if (commandName === "hey") {
        console.log("here");
        interaction.reply("What's up, girl? Whatchu lookin' at?");
    }
});
// Login to Discord with your app's token
client.login(process.env.DISCORD_TOKEN);
