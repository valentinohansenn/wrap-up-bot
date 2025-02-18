import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js"
const { RockPaperScissors } = require("discord-gamecord")

module.exports = {
	name: "rps",
	description: "Play rock-paper-scissors with your mates!",
	data: new SlashCommandBuilder()
		.setName("rps")
		.setDescription("Play rock-paper-scissors with your mates!")
		.addUserOption((option) =>
			option
				.setName("opponent")
				.setDescription("The user you want to challenge.")
				.setRequired(true)
		),
	async execute(interaction: ChatInputCommandInteraction) {
		const { options } = interaction
		const opponent = options.getUser("opponent")

		if (opponent?.bot) {
			return interaction.reply({
				content: "Get some friends, man... not bots. It's more fun!",
				ephemeral: true,
			})
		}

		if (opponent?.id === interaction.user.id) {
			return interaction.reply({
				content:
					"You're that lonely, huh. You can't play against yourself!",
				ephemeral: true,
			})
		}

		const Game = new RockPaperScissors({
			message: interaction,
			isSlashGame: true,
			opponent: opponent,
			embed: {
				title: "Rock Paper Scissors",
				color: "#5865F2",
				description: "Press a button below to make a choice.",
			},
			buttons: {
				rock: "Rock",
				paper: "Paper",
				scissors: "Scissors",
			},
			emojis: {
				rock: "🪨",
				paper: "📰",
				scissors: "✂️",
			},
			mentionUser: true,
			timeoutTime: 60000,
			buttonStyle: "PRIMARY",
			pickMessage: "You choose {emoji}.",
			winMessage: "**{player}** won the Game! Congratulations!",
			tieMessage: "The Game tied! No one won the Game!",
			timeoutMessage: "The Game went unfinished! No one won the Game!",
			playerOnlyMessage:
				"Only {player} and {opponent} can use these buttons.",
		})

		Game.startGame()
	},
}
