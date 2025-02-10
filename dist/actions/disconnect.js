"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnect = disconnect;
async function disconnect(interaction, executeDisconnect) {
    await interaction.reply("Disconnecting member(s)...");
    const result = await executeDisconnect();
    if (typeof result === "number") {
        await interaction.followUp(`Successfully disconnected ${result} members from the voice channel!`);
    }
    else if (result) {
        await interaction.followUp(`Successfully disconnected ${result.displayName} from the voice channel!`);
    }
    else {
        await interaction.followUp("The member is not in a voice channel.");
    }
}
