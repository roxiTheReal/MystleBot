const { SlashCommandBuilder } = require('discord.js');
require('dotenv').config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('silly')
        .setDescription('posts a random cat pic/gif'),
    async execute(interaction) {
        try {
            const res = await fetch('https://api.thecatapi.com/v1/images/search', {
                headers: { 'x-api-key': process.env.CAT_API_KEY }
            });
            const data = await res.json();

            if (!data[0] || !data[0].url) {
                await interaction.reply('something went wrong, i couldn\'t find any cat pics :(');
                return;
            }
            await interaction.deferReply();
            await interaction.editReply(data[0].url);
        } catch (err) {
            console.error(err);
            await interaction.reply('something went wrong, i couldn\'t find any cat pics :(');
        }
    }
}