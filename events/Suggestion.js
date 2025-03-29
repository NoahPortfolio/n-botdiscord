const { Events, EmbedBuilder, ThreadAutoArchiveDuration } = require('discord.js');
const { Channels, Server } = require('../config.json');

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (message.channel.id !== Channels.suggestionsChannelId || message.author.bot) return;

        try {
            const suggestionEmbed = new EmbedBuilder()
                .setColor('#FFA500')
                .setAuthor({ 
                    name: `Suggestion de ${message.author.username}`,
                    iconURL: message.author.displayAvatarURL({ dynamic: true, size: 256 }) 
                })
                .setDescription(message.content)
                .addFields({
                    name: 'Statut',
                    value: '🟡 En attente de modération',
                    inline: true
                })
                .setFooter({ 
                    text: `ID: ${message.author.id} • ${Server.name || 'Serveur'}`,
                    iconURL: Server.logoUrl 
                })
                .setTimestamp();

            const sentMessage = await message.channel.send({ 
                embeds: [suggestionEmbed] 
            });
            
            await message.delete().catch(() => {});

            const thread = await sentMessage.startThread({
                name: `Discussion: ${message.content.substring(0, 50)}${message.content.length > 50 ? '...' : ''}`,
                autoArchiveDuration: ThreadAutoArchiveDuration.OneWeek,
                reason: 'Discussion sur la suggestion'
            });

            const welcomeEmbed = new EmbedBuilder()
                .setColor('#00BFFF')
                .setDescription(`💡 **Bienvenue dans la discussion**\n\n${message.author}, merci pour ta suggestion !\n\nLes membres peuvent voter avec les réactions et discuter ici.`)
                .setFooter({ text: 'Les abus seront sanctionnés' });

            await thread.send({ 
                content: `${message.author}`,
                embeds: [welcomeEmbed] 
            });

            const reactions = ['✅', '🤷', '❌'];
            for (const reaction of reactions) {
                await sentMessage.react(reaction).catch(() => {});
            }

        } catch (error) {
            console.error('Erreur dans le traitement de la suggestion:', error);
            message.channel.send({
                content: "❌ Une erreur est survenue lors du traitement de la suggestion.",
                deleteAfter: 10
            }).catch(() => {});
        }
    }
};