const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { Roles } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('effacer')
        .setDescription('Supprime un nombre spécifique de messages')
        .addIntegerOption(option =>
            option.setName('nombre')
                .setDescription('Nombre de messages à supprimer (1-100)')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(100))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    async execute(interaction) {
        const allowedRoles = Roles.deleteConvRoles || Roles.adminRoles;
        if (!interaction.member.roles.cache.some(role => allowedRoles.includes(role.id))) {
            return interaction.reply({ 
                content: "❌ Vous n'avez pas la permission de supprimer des messages.",
                ephemeral: true 
            });
        }

        const count = interaction.options.getInteger('nombre');

        try {
            if (!interaction.channel.permissionsFor(interaction.guild.members.me).has(PermissionFlagsBits.ManageMessages)) {
                return interaction.reply({
                    content: "❌ Je n'ai pas la permission de gérer les messages dans ce salon.",
                    ephemeral: true
                });
            }

            const messages = await interaction.channel.messages.fetch({ limit: count + 1 });
            
            const deletableMessages = messages.filter(msg => 
                Date.now() - msg.createdTimestamp < 1209600000 // 14 jours en ms
            );

            if (deletableMessages.size === 0) {
                return interaction.reply({
                    content: "❌ Aucun message récent à supprimer (les messages de plus de 14 jours ne peuvent être supprimés).",
                    ephemeral: true
                });
            }

            await interaction.channel.bulkDelete(deletableMessages, true);
            
            const reply = await interaction.reply({ 
                content: `🗑️ ${deletableMessages.size - 1} messages ont été supprimés.`,
                ephemeral: true 
            });

            setTimeout(() => reply.delete().catch(() => {}), 5000);

        } catch (error) {
            console.error('Erreur suppression messages:', error);
            
            let errorMessage = "❌ Une erreur est survenue lors de la suppression";
            if (error.code === 50034) errorMessage = "❌ Impossible de supprimer des messages de plus de 14 jours";
            
            await interaction.reply({ 
                content: errorMessage,
                ephemeral: true 
            });
        }
    },
};