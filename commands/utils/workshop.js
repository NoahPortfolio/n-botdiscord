const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { Commands, Server } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('workshop')
        .setDescription('Affiche le workshop du serveur'),
    async execute(interaction) {
        if (!Commands?.workshop) {
            return interaction.reply({
                content: '❌ Le lien du Discord Police n\'est pas configuré',
                ephemeral: true
            });
        }

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Collection')
            .setDescription(`Notre collection du serveur : ${Commands.workshop}`)
            .setThumbnail(Server.logoUrl)

        await interaction.reply({ embeds: [embed] });
    },
};