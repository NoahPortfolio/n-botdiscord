const { Events, EmbedBuilder } = require('discord.js');
const { Channels, Server } = require('../config.json');

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        const welcomeChannel = member.guild.channels.cache.get(Channels.welcomeChannelId);
        if (!welcomeChannel) {
            console.error('❌ Salon de bienvenue introuvable');
            return;
        }

        try {
            const welcomeEmbed = new EmbedBuilder()
                .setColor('#4CAF50')
                .setTitle(`✨ Bienvenue ${member.user.username} !`)
                .setDescription(`🎉 Bienvenue parmi nous ${member} !`)
                .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 256 }))
                .setImage(Server.bannerUrl || Server.logoUrl)
                .addFields(
                    {
                        name: '📅 Date de création',
                        value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:D>`,
                        inline: true
                    },
                    {
                        name: '👤 Membre n°',
                        value: member.guild.memberCount.toString(),
                        inline: true
                    }
                )
                .setFooter({ 
                    text: `${member.guild.name}`, 
                    iconURL: member.guild.iconURL() 
                });

            await welcomeChannel.send({
                content: `||${member}||`,
                embeds: [welcomeEmbed]
            });

            try {
                const dmEmbed = new EmbedBuilder()
                    .setColor('#FFA500')
                    .setTitle(`Bienvenue sur ${member.guild.name} !`)
                    .setDescription('Merci de nous avoir rejoint ! Voici quelques informations :')
                    .addFields(
                        { name: '📜 Règles', value: 'N\'hésite pas à lire les règles du serveur !' },
                        { name: '❓ Besoin d\'aide ?', value: 'Contacte un membre du staff si tu as des questions.' }
                    )
                    .setThumbnail(Server.logoUrl);

                await member.send({ embeds: [dmEmbed] });
            } catch (dmError) {
                console.log(`❌ Impossible d'envoyer un MP à ${member.user.tag}`);
            }

        } catch (error) {
            console.error('❌ Erreur lors de l\'envoi du message de bienvenue:', error);
        }
    },
};