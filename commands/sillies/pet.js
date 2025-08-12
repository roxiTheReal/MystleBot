const { SlashCommandBuilder, MessageFlags } = require('discord.js');

const responses = {
    petTarget: [
        `{executer} is petting {target}... and they both seem to like it :3`,
        `before {target} could react, {executer} had starting petting them. how cute >w<`,
    ],
    petSelf: [
        `awww, {executer} is petting themselves... that's sweet <:3`,
        `looks like {executer} is feeling a bit lonely and they're petting themselves.. show them some love :3`,
    ],
    petBot: [
        `ty for the pets {executer}!!! i needed them -w-"`,
        `oh stop {executer}! i'm gonna purr if you keep doing that! but keep petting me pls :3c`,
        `aww {executer}, you didn't have to >w<\nthanks for the pets anyway :3`,
    ]
}

function formatResponse(template, variables) {
    return template.replace(/\{(\w+)\}/g, (_, key) => variables[key] || '');
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pet')
        .setDescription('pet someone :3')
        .addUserOption(option => 
            option
                .setName('target')
                .setDescription('the person you wanna pet')
                .setRequired(true),
        ),
    async execute(interaction) {
        const target = interaction.options.getUser('target');
        const executer = interaction.user;
        const me = interaction.client.user.id;

        let chosenResponses;
        if (target.id === executer.id) {
          chosenResponses = responses.petSelf;
        } else if (target.id === me) {
          chosenResponses = responses.petBot;
        } else {
          chosenResponses = responses.petTarget;
        }
    
        const template = chosenResponses[Math.floor(Math.random() * chosenResponses.length)];
    
        const reply = formatResponse(template, {
          executer: `<@${executer.id}>`,
          target: `<@${target.id}>`,
        });
    
        await interaction.reply(reply);
    }
}