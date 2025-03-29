const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { Roles, Channels } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('refuse-suggestion')
        .setDescription('Refuser une suggestion')
        .addStringOption(option =>
            option.setName('message_id')
                .setDescription('ID du message de suggestion')
                .setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const messageId = interaction.options.getString('message_id');
        const channel = interaction.guild.channels.cache.get(Channels.suggestionsChannelId);

        if (!interaction.member.roles.cache.has(Roles.AcceptSuggestion)) {
            return interaction.editReply({ 
                content: "❌ Vous n'avez pas la permission de refuser des suggestions."
            });
        }

        try {
            const message = await channel.messages.fetch(messageId);
            if (!message) {
                return interaction.editReply({ 
                    content: "❌ Message introuvable dans le salon des suggestions."
                });
            }

            const embedData = message.embeds[0]?.data;
            if (!embedData) {
                return interaction.editReply({
                    content: "❌ Ce message ne contient pas de suggestion valide."
                });
            }

            const fields = embedData.fields?.map(field => 
                field.name === 'Statut' 
                    ? { name: 'Statut', value: '🔴 Refusée', inline: true }
                    : field
            ) || [];

            if (!fields.some(f => f.name === 'Statut')) {
                fields.push({
                    name: 'Statut',
                    value: '🔴 Refusée',
                    inline: true
                });
            }

            const updatedEmbed = new EmbedBuilder(embedData)
                .setColor('#FF0000')
                .setFields(fields)
                .setFooter({ 
                    text: `❌ Refusé par ${interaction.user.username}`,
                    iconURL: interaction.user.displayAvatarURL() 
                });

            await message.edit({ 
                embeds: [updatedEmbed],
                components: [] 
            });

            if (message.hasThread) {
                const thread = await message.thread;
                await thread.send(`⚠️ Cette suggestion a été refusée par ${interaction.user}.`);
                await thread.setLocked(true);
                await thread.setArchived(true);
            }

            await interaction.editReply({ 
                content: "✅ Suggestion refusée avec succès." 
            });

        } catch (error) {
            console.error('Erreur refus suggestion:', error);
            await interaction.editReply({ 
                content: "❌ Erreur lors du refus de la suggestion."
            });
        }
    },
};