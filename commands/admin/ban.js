const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { Roles } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Bannit un membre du serveur')
        .addUserOption(option =>
            option.setName('membre')
                .setDescription('Le membre à bannir')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('raison')
                .setDescription('Raison du bannissement')
                .setRequired(false))
        .addIntegerOption(option =>
            option.setName('jours')
                .setDescription('Nombre de jours de messages à supprimer (0-7)')
                .setRequired(false)
                .setMinValue(0)
                .setMaxValue(7))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    async execute(interaction) {
        if (!interaction.member.roles.cache.some(role => Roles.banRoles.includes(role.id))) {
            return interaction.reply({ 
                content: "❌ Vous n'avez pas la permission de bannir des membres.",
                ephemeral: true 
            });
        }

        const user = interaction.options.getUser('membre');
        const reason = interaction.options.getString('raison') || 'Aucune raison spécifiée';
        const deleteDays = interaction.options.getInteger('jours') || 0;

        try {
            const deleteMessageSeconds = deleteDays * 24 * 60 * 60;

            const member = await interaction.guild.members.fetch({ 
                user: user.id,
                force: true 
            }).catch(() => null);

            if (!member) {
                return interaction.reply({ 
                    content: "❌ Ce membre n'est pas sur le serveur. Utilisez l'ID pour bannir hors-ligne.",
                    ephemeral: true 
                });
            }

            if (user.id === interaction.user.id) {
                return interaction.reply({
                    content: "❌ Vous ne pouvez pas vous bannir vous-même.",
                    ephemeral: true
                });
            }

            if (!member.bannable) {
                return interaction.reply({ 
                    content: "❌ Je ne peux pas bannir ce membre (permissions insuffisantes ou rôle trop élevé).",
                    ephemeral: true 
                });
            }

            if (member.roles.highest.position >= interaction.member.roles.highest.position) {
                return interaction.reply({ 
                    content: "❌ Vous ne pouvez pas bannir un membre avec un rôle égal ou supérieur au vôtre.",
                    ephemeral: true 
                });
            }

            console.log(`[BAN] ${interaction.user.tag} > ${user.tag} | Raison: "${reason}" | Suppression: ${deleteDays} jours`);

            await member.ban({ 
                reason: `[Par ${interaction.user.tag}] ${reason}`,
                deleteMessageSeconds: deleteMessageSeconds
            });

            const banEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('🔨 Membre banni')
                .setDescription(`${user.tag} a été banni du serveur.`)
                .addFields(
                    { name: 'Raison', value: reason, inline: true },
                    { name: 'Messages supprimés', value: `${deleteDays} jours`, inline: true }
                )
                .setFooter({ text: `Modérateur: ${interaction.user.tag}` })
                .setTimestamp();

            await interaction.reply({ embeds: [banEmbed] });

        } catch (error) {
            console.error('Erreur de bannissement:', error);
            
            let errorMessage = "❌ Une erreur est survenue lors du bannissement";
            if (error.code === 50013) errorMessage = "❌ Permissions insuffisantes pour bannir";
            else if (error.code === 50001) errorMessage = "❌ Accès refusé par les paramètres du serveur";
            
            await interaction.reply({ 
                content: errorMessage,
                ephemeral: true 
            });
        }
    },
};