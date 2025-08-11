const { SlashCommandBuilder, MessageFlags, PermissionFlagsBits, InteractionContextType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('bans a member from the server')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('the user you want to ban')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('time')
                .setDescription('time of the ban in minutes (use 0 for permaban)')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('reason')
                .setDescription('reason of the ban')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .setContexts(InteractionContextType.Guild),
    async execute(interaction) {
        const target = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason') || 'no reason';
        const member = interaction.guild.members.cache.get(target.id);
        const time = interaction.options.getInteger('time');

        if (!member) {
            return interaction.reply({ content: 'that user couldn\'t be found in this server', flags: MessageFlags.Ephemeral });
        }
        if (!member.bannable) {
            return interaction.reply({ content: 'i can\'t ban this user', flags: MessageFlags.Ephemeral });
        }

        try {
            await interaction.guild.members.ban(target, { reason });

            await interaction.reply(`banned ${target.tag} ${time === 0 ? 'permanently' : `for ${time} minute(s) `} (reason: ${reason})`);

            if (time > 0) {
                setTimeout(async () => {
                    try {
                        await interaction.guild.members.unban(target.id, 'ban expired');
                    } catch (unbanError) {
                        console.error(`failed to unban ${target.tag}:`, unbanError);
                    }
                }, time * 60 * 1000);
            }
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'couldn\'t ban the user', flags: MessageFlags.Ephemeral });
        }
    },
};