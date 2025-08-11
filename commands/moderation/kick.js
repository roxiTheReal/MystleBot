const { SlashCommandBuilder, MessageFlags, PermissionFlagsBits, InteractionContextType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('kicks a member from the server')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('the user you want to kick')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('reason')
                .setDescription('reason of the kick')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
        .setContexts(InteractionContextType.Guild),
    async execute(interaction) {
        const target = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason') || 'no reason';
        const member = interaction.guild.members.cache.get(target.id);

        if (!member) {
            return interaction.reply({ content: 'that user couldn\'t be found in this server', flags: MessageFlags.Ephemeral });
        }
        if (!member.kickable) {
            return interaction.reply({ content: 'i can\'t kick this user', flags: MessageFlags.Ephemeral });
        }

        try {
            await member.kick(reason);
            await interaction.reply(`kicked ${target.tag} (reason: ${reason})`);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'couldn\'t kick the user', flags: MessageFlags.Ephemeral });
        }
    },
};