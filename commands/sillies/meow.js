const { SlashCommandBuilder } = require('discord.js');

const meows = [
    'meow',
    'mrrp',
    'miau',
    'mrow',
    'purrrrrr',
    'nya',
];

const catEmojis = [
    ':3',
    '-w-',
    'owo',
    ':3c',
    '^w^',
    'x3',
    '>w<',
    '=w=',
    '>:3'
];

function randomFromArray(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function chaoticPick(arr) {
    // Always at least one
    const picks = [randomFromArray(arr)];

    // 30% chance of adding a second pick
    if (Math.random() < 0.3) picks.push(randomFromArray(arr));

    // 10% chance of adding a third pick (super chaos)
    if (Math.random() < 0.1) picks.push(randomFromArray(arr));

    return picks.join(' ');
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('meow')
        .setDescription('im so silly :3'),
    async execute(interaction) {
        const chaoticMeows = chaoticPick(meows);
        const chaoticEmojis = chaoticPick(catEmojis);

        await interaction.reply(`${chaoticMeows} ${chaoticEmojis}`);
    },
};