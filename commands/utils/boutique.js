const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { Commands, Server } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('boutique')
        .setDescription('Affiche la boutique du serveur.'),
    async execute(interaction) {
        if (!Commands?.shop) {
            return interaction.reply({
                content: '❌ Le lien du shop n\'est pas configuré',
                ephemeral: true
            });
        }

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Boutique')
            .setDescription(`Voici notre Boutique : ${Commands.shop}`)
            .setThumbnail(Server.logoUrl)

        await interaction.reply({ embeds: [embed] });
    },
};