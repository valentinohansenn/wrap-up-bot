"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
module.exports = {
    cooldown: 5,
    name: discord_js_1.Events.ClientReady,
    once: true,
    execute(client) {
        console.log(`✅ Ready! Logged in as ${client?.user?.tag}`);
    },
};
