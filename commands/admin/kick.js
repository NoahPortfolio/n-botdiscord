const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { Roles } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Expulse un membre du serveur')
        .addUserOption(option => 
            option.setName('membre')
                .setDescription('Le membre à expulser')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('raison')
                .setDescription('Raison de l\'expulsion')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
    async execute(interaction) {
        const allowedRoles = Roles.KickRoles || Roles.banRoles;
        if (!interaction.member.roles.cache.some(role => allowedRoles.includes(role.id))) {
            return interaction.reply({ 
                content: "❌ Vous n'avez pas la permission d'expulser des membres.",
                ephemeral: true 
            });
        }

        const user = interaction.options.getUser('membre');
        const reason = interaction.options.getString('raison') || 'Aucune raison spécifiée';

        try {
            const member = await interaction.guild.members.fetch({ user: user.id, force: true }).catch(() => null);
            
            if (!member) {
                return interaction.reply({ 
                    content: "❌ Ce membre n'est pas sur le serveur ou je n'ai pas pu le récupérer.",
                    ephemeral: true 
                });
            }

            if (!member.kickable) {
                return interaction.reply({ 
                    content: "❌ Je ne peux pas expulser ce membre (permissions insuffisantes ou rôle trop élevé).",
                    ephemeral: true 
                });
            }

            if (member.user.id === interaction.user.id) {
                return interaction.reply({ 
                    content: "❌ Vous ne pouvez pas vous expulser vous-même.",
                    ephemeral: true 
                });
            }

            if (member.roles.highest.position >= interaction.member.roles.highest.position) {
                return interaction.reply({ 
                    content: "❌ Vous ne pouvez pas expulser un membre de rang égal ou supérieur.",
                    ephemeral: true 
                });
            }

            console.log(`[KICK] ${interaction.user.tag} > ${user.tag} | Raison: ${reason}`);
            await member.kick(reason);
            
            await interaction.reply({ 
                content: `✅ ${user.tag} a été expulsé.\n📝 Raison: ${reason}`,
                allowedMentions: { users: [] }
            });
            
        } catch (error) {
            console.error('Erreur lors du kick:', error);
            
            let errorMessage = "❌ Une erreur inattendue est survenue";
            if (error.code === 50013) errorMessage = "❌ Permissions insuffisantes";
            else if (error.code === 50001) errorMessage = "❌ Accès refusé par les paramètres du serveur";
            
            await interaction.reply({ 
                content: errorMessage,
                ephemeral: true 
            });
        }
    },
};