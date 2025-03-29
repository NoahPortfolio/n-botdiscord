const { Events, EmbedBuilder } = require('discord.js');
const { Channels, Server } = require('../config.json');

module.exports = {
    name: Events.GuildMemberRemove,
    async execute(member) {
        const leaveChannel = member.guild.channels.cache.get(Channels.leaveChannelId);
        if (!leaveChannel) {
            console.error('❌ Salon de départ introuvable - Vérifiez leaveChannelId dans config.json');
            return;
        }

        try {
            const joinDate = new Date(member.joinedTimestamp);
            const timeSpent = this.formatDuration(Date.now() - member.joinedTimestamp);

            const leaveEmbed = new EmbedBuilder()
                .setColor('#FF6961') // Rouge plus doux
                .setTitle(`😢 ${member.user.username} nous a quitté(e)s`)
                .setDescription(`Nous sommes maintenant ${member.guild.memberCount} membres.`)
                .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 256 }))
                .setImage(Server.bannerUrl || Server.logoUrl)
                .addFields(
                    {
                        name: '📅 Date d\'arrivée',
                        value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:D>`,
                        inline: true
                    },
                    {
                        name: '⏱️ Temps passé',
                        value: timeSpent,
                        inline: true
                    }
                )
                .setFooter({ 
                    text: `${member.guild.name} • À bientôt peut-être !`, 
                    iconURL: member.guild.iconURL() 
                });

            await leaveChannel.send({ embeds: [leaveEmbed] });

        } catch (error) {
            console.error('❌ Erreur lors de l\'envoi du message de départ:', error);
        }
    },

    formatDuration(ms) {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const months = Math.floor(days / 30.44);
        const years = Math.floor(months / 12);

        const parts = [];
        if (years > 0) parts.push(`${years} an${years > 1 ? 's' : ''}`);
        if (months % 12 > 0) parts.push(`${months % 12} mois`);
        if (days % 30 > 0 && months < 3) parts.push(`${days % 30} jour${days % 30 > 1 ? 's' : ''}`);
        
        return parts.join(' ') || 'quelques heures';
    }
};