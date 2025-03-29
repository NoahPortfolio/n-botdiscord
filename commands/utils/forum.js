const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { Commands, Server } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('forum')
        .setDescription('Affiche le forum du serveur'),
    async execute(interaction) {
        if (!Commands?.forum) {
            return interaction.reply({
                content: '❌ Le lien du Forum n\'est pas configuré',
                ephemeral: true
            });
        }

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Forum')
            .setDescription(`Voici notre forum : ${Commands.forum}`)
            .setThumbnail(Server.logoUrl)

        await interaction.reply({ embeds: [embed] });
    },
};