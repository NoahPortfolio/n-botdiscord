const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { Commands, Server } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('topserv')
        .setDescription('Affiche le topserv du serveur'),
    async execute(interaction) {
        if (!Commands?.topServers) {
            return interaction.reply({
                content: '❌ Le lien du Discord Police n\'est pas configuré',
                ephemeral: true
            });
        }

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Top Serveur')
            .setDescription(`Notre liens top serveur : ${Commands.topServers}`)
            .setThumbnail(Server.logoUrl)

        await interaction.reply({ embeds: [embed] });
    },
};