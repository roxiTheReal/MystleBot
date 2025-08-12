const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder, Events, MessageFlags } = require('discord.js');

// Replace this with your Discord user ID
const OWNER_ID = '1171015493537247273';

// Command registration
module.exports = {
    data: new SlashCommandBuilder()
        .setName('suggest')
        .setDescription('do you have ideas for a new feature/command? share them! :3'),
    async execute(interaction) {
        // Create the modal
        const modal = new ModalBuilder()
            .setCustomId('suggestModal')
            .setTitle('suggest the feature/command here');

        // Suggestion field
        const suggestionInput = new TextInputBuilder()
            .setCustomId('suggestion')
            .setLabel('Your suggestion')
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder('Enter your suggestion here...')
            .setRequired(true);

        // Name field (optional)
        const nameInput = new TextInputBuilder()
            .setCustomId('name')
            .setLabel('Your name')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('Leave blank to stay anonymous')
            .setRequired(false);

        modal.addComponents(
            new ActionRowBuilder().addComponents(suggestionInput),
            new ActionRowBuilder().addComponents(nameInput)
        );

        await interaction.showModal(modal);
    }
};

// Modal submission handler
module.exports.modalHandler = (client) => {
    client.on(Events.InteractionCreate, async (interaction) => {
        if (!interaction.isModalSubmit()) return;
        if (interaction.customId !== 'suggestModal') return;

        const suggestion = interaction.fields.getTextInputValue('suggestion');
        const name = interaction.fields.getTextInputValue('name') || 'Anonymous';

        const embed = new EmbedBuilder()
            .setTitle('📩 New Suggestion')
            .addFields(
                { name: 'From', value: name, inline: true },
                { name: 'Suggestion', value: suggestion }
            )
            .setFooter({ text: `From server: ${interaction.guild?.name || 'DM'}` })
            .setTimestamp()
            .setColor(0x00AE86);

        try {
            const owner = await client.users.fetch(OWNER_ID);
            await owner.send({ embeds: [embed] });
            await interaction.reply({ content: '✅ Your suggestion has been sent!', flags: MessageFlags.Ephemeral });
        } catch (err) {
            console.error('Failed to DM suggestion:', err);
            await interaction.reply({ content: '❌ Failed to send your suggestion. Please try again later.', flags: MessageFlags.Ephemeral });
        }
    });
};
