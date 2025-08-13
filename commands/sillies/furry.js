const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('furry')
        .setDescription('you know what you are, now tell someone >:3')
        .addStringOption(option =>
            option
               .setName('animal')
               .setDescription('the animal you are >w<')
               .setRequired(true)
               .addChoices(
                { name: 'cat', value: '\u00A0kitty cat :3' },
                { name: 'dog', value: '\u00A0doggo :3c' },
                { name: 'shark', value: '\u00A0shork >:3' },
                { name: 'fox', value: '\u00A0foxxo >ω<' },
                { name: '???', value: 'n unknown creature :3?' }
            )
        )
        .addUserOption(option =>
            option
                .setName('target')
                .setDescription('who you wanna tell :3')
                .setRequired(true)
        ),
    async execute(interaction) {
        const furry = interaction.options.getString('animal');
        const target = interaction.options.getUser('target');
        
        await interaction.deferReply();
        await interaction.editReply({ content: `<@${interaction.user.id}> is a furry (a${furry}), and wants to let <@${target.id}> know it :3` });
    }
}