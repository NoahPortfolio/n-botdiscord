const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { Commands, Server } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('credit')
        .setDescription('Affiche le forum du serveur'),
    async execute(interaction) {
        if (!Commands?.forum) {
            return interaction.reply({
                content: '❌ Le lien du Credit n\'est pas configuré',
                ephemeral: true
            });
        }

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Bot crée par Noah Ballas')
            .setDescription(`Toutes demande de support possible par MP discord : noah_ballas`)
            .setThumbnail(Server.logoUrl)

        await interaction.reply({ embeds: [embed] });
    },
};