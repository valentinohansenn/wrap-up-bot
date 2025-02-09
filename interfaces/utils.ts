import { CommandInteraction, SlashCommandBuilder } from 'discord.js';

export interface CommandsOptions {
   data: SlashCommandBuilder
   execute: (interaction: CommandInteraction) => Promise<void>
}
