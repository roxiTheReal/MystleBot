const { AttachmentBuilder, Events, MessageFlags, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Message, Embed } = require('discord.js');
const fs = require('fs');
const path = require('path');

const ticketCategoryId = '1404501979362889728';
const modRoleIds = ['1371843760891105280', '1337868782789722184', '1352691413938081862', '1368240416218157147'];

const storagePath = path.join(__dirname, 'storage.json')

function readStorage() {
    try { 
        return JSON.parse(fs.readFileSync(storagePath));
    } catch {
        return { currentTicketNumber: 0 };
    }
}

function writeStorage(data) {
    fs.writeFileSync(storagePath, JSON.stringify(data, null, 2));
}

function padNumber(number, length) {
    return number.toString().padStart(length, '0');
}

module.exports = {
      name: Events.InteractionCreate,
      async execute(interaction) {
            if (interaction.isChatInputCommand()) {
              const command = interaction.client.commands.get(interaction.commandName);
              if (!command) {
                  console.error(`No command matching ${interaction.commandName} was found.`);
                    return;
              }
              try {
                    await command.execute(interaction);
              } catch (error) {
                    console.error(error);
                    if (interaction.replied || interaction.deferred) {
                      await interaction.followUp({ content: 'oop, something happened, and it\'s not good', flags: MessageFlags.Ephemeral });
                    } else {
                      await interaction.reply({ content: 'oop, something happened, and it\'s not good', flags: MessageFlags.Ephemeral });
                    }
              }
            } else if (interaction.isButton()) {
            if (interaction.customId === 'create_ticket') {
                await interaction.deferReply({ flags: MessageFlags.Ephemeral });

                const guild = interaction.guild;
                const member = interaction.member;

                const storage = readStorage();
                let ticketNumber = storage.currentTicketNumber || 0;

                ticketNumber = (ticketNumber + 1) % 10000;
                storage.currentTicketNumber = ticketNumber;
                writeStorage(storage);

                const realTicketNumber = padNumber(ticketNumber, 4);
                const ticketName = `ticket-${realTicketNumber}`;

                if (member.roles.cache.some(role => role.name === ticketName)) {
                    return interaction.editReply({ content: `you already have an open ticket: ${ticketName}`, flags: MessageFlags.Ephemeral });
                }

                try {
                    const ticketRole = await guild.roles.create({
                        name: ticketName,
                        mentionable: false,
                        reason: `ticket role for ${interaction.user.tag}`,
                    });

                    await member.roles.add(ticketRole);

                    const channel = await guild.channels.create({
                        name: ticketName,
                        type: 0,
                        parent: ticketCategoryId,
                        permissionOverwrites: [
                            {
                                id: guild.roles.everyone,
                                deny: ['ViewChannel'],
                            },
                            {
                                id: ticketRole.id,
                                allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory'],
                            },
                            ...modRoleIds.map(id => ({
                                id,
                                allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory', 'ManageMessages'],
                            })),
                            {
                                id: guild.members.me.id,
                                allow: ['ViewChannel', 'SendMessages', 'ManageChannels', 'ReadMessageHistory'],
                            },
                        ],
                    });

                    const closeButton = new ButtonBuilder()
                        .setCustomId('close_ticket')
                        .setLabel('Close Ticket')
                        .setStyle(ButtonStyle.Danger);
                    
                    const row = new ActionRowBuilder().addComponents(closeButton);

                    const embed = new EmbedBuilder()
                        .setTitle('here\'s your ticket!')
                        .setDescription(`hey ${interaction.user}, you just created a ticket to talk with the moderation team. please wait, they'll be with you shortly!`)
                        .setColor('Orange');
                    
                        const ticketMessage = await channel.send({ embeds: [embed], components: [row] });
                        await ticketMessage.pin();

                        await interaction.editReply({ content: `your ticket has been created -> ${channel}`, flags: MessageFlags.Ephemeral });
                } catch (error) {
                    console.error(error);
                    await interaction.editReply({ content: 'oop, something goofed and i couldn\'t create the ticket. try again later or blame <@1171015493537247273> for this', flags: MessageFlags.Ephemeral })
                }
            } else if (interaction.customId === 'close_ticket') {
                await interaction.deferReply({ flags: MessageFlags.Ephemeral });

                const channel = interaction.channel;
                const guild = interaction.guild;
                const member = interaction.member;

                if (!channel.name.startsWith('ticket-')) {
                    return interaction.editReply({ content: 'you can only close tickets inside tickets dummy', flags: MessageFlags.Ephemeral });
                }

                try {
                    const ticketRole = guild.roles.cache.find(role => role.name === channel.name);
                    if (ticketRole) {
                        const membersWithRole = ticketRole.members;
                        for (const [, memberWithRole] of membersWithRole) {
                            await memberWithRole.roles.remove(ticketRole).catch(console.error);
                        }
                    }

                    await interaction.editReply({ content: 'closing the ticket...', flags: MessageFlags.Ephemeral });
                    await saveTranscript(channel, guild);
                    await channel.delete('ticket closed');
                } catch (error) {
                    console.error(error);
                    await interaction.editReply({ content: 'oop, something goofed and i couldn\'t close the ticket. try again later or blame <@1171015493537247273> for this', flags: MessageFlags.Ephemeral });
                }
            }
        }
    }
}

async function saveTranscript(channel, guild) {
    let messages = [];
    let lastId;

    while (true) {
        const fetched = await channel.messages.fetch({ limit: 100, before: lastId });
        if (fetched.size === 0) break;
        messages = messages.concat(Array.from(fetched.values()));
        lastId = fetched.last().id;
    }

    messages.reverse();

    const transcriptLines = messages.map(m => {
        const time = m.createdAt.toISOString();
        const author = `${m.author.tag}`;
        let content = m.content || '';

        // If message has attachments, append their URLs
        if (m.attachments.size > 0) {
            const attachmentsUrls = m.attachments.map(att => att.url).join(' ');
            content += content ? ` [Attachments: ${attachmentsUrls}]` : `[Attachments: ${attachmentsUrls}]`;
        }

        // If message has embeds, try to include their titles or descriptions
        if (m.embeds.length > 0) {
            const embedSummaries = m.embeds.map(embed => {
                let summary = '';
                if (embed.title) summary += `Title: ${embed.title} `;
                if (embed.description) summary += `Desc: ${embed.description} `;
                return summary.trim();
            }).join(' | ');
            content += content ? ` [Embeds: ${embedSummaries}]` : `[Embeds: ${embedSummaries}]`;
        }

        // Handle system messages or stickers (optional)
        if (m.system) {
            content = '[System message] ' + content;
        }
        if (m.stickers.size > 0) {
            const stickers = m.stickers.map(s => s.name).join(', ');
            content += content ? ` [Stickers: ${stickers}]` : `[Stickers: ${stickers}]`;
        }

        return `[${time}] ${author}: ${content}`;
    });

    const transcriptText = transcriptLines.join('\n');

    const buffer = Buffer.from(transcriptText, 'utf-8');

    const transcriptChannelId = '1404496983346909225';
    const transcriptChannel = guild.channels.cache.get(transcriptChannelId);

    if (!transcriptChannel) {
        console.warn('[WARN] the transcript channel doesn\'t exist');
        return;
    }

    const attachment = new AttachmentBuilder(buffer, { name: `${channel.name}_transcript.txt` });

    await transcriptChannel.send({
        content: `Transcript for **${channel.name}**`,
        files: [attachment],
    });
}