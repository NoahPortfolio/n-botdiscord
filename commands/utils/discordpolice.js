const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { Commands, Server } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('discord_swat')
        .setDescription('Affiche le lien du discord Police'),
    async execute(interaction) {
        if (!Commands?.discordSwat) {
            return interaction.reply({
                content: '❌ Le lien du Discord Police n\'est pas configuré',
                ephemeral: true
            });
        }

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('👮 Discord Swat')
            .setDescription(`[Discord Swat](${Commands.discordSwat})`)
            .setThumbnail(Server.logoUrl)

        await interaction.reply({ embeds: [embed] });
    },
};