const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { Commands, Server } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ip')
        .setDescription('Affiche ip du serveur'),
    async execute(interaction) {
        if (!Commands?.ipgmod) {
            return interaction.reply({
                content: '❌ Le lien du Discord Police n\'est pas configuré',
                ephemeral: true
            });
        }

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('IP')
            .setDescription(`Voici IP du serveur : ${Commands.ipgmod}`)
            .setThumbnail(Server.logoUrl)

        await interaction.reply({ embeds: [embed] });
    },
};