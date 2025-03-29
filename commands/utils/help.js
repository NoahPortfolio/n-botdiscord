const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Affiche la liste des commandes disponibles'),
    async execute(interaction) {
        const helpEmbed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('📚 Liste des commandes')
            .addFields(
                { name: '🔨 Modération', value: '`/ban`, `/kick`, `/effacer-conversation`' },
                { name: '🎉 Giveaway', value: '`/giveaway`' },
                { name: '💡 Suggestions', value: '`/accept-suggestion`, `/refuse-suggestion`' },
                { name: '📊 Utilitaires', value: '`/ping`, `/avatar`, `/credit`, `/info-serveur`, `/ip`, `/topserv`' },
                { name: '🎮 Divers', value: '`/boutique`, `/discordpolice`, `/discordswat`, `/forum`, `/workshop`' }
            )
            .setFooter({ text: ':)' });

        await interaction.reply({ embeds: [helpEmbed] });
    },
};