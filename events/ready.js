const { Events, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Embed } = require('discord.js');
const fs = require('fs');
const path = require('path');

const storagePath = path.join(__dirname, 'storage.json');

function readStorage() {
	try {
		const raw = fs.readFileSync(storagePath);
		return JSON.parse(raw);
	} catch {
		return {};
	}
}

function writeStorage(data) {
	fs.writeFileSync(storagePath, JSON.stringify(data, null, 2));
}

const TICKET_CHANNEL_ID = '1404496927801872504';

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		console.log(`logged in as ${client.user.tag}`);

		client.emit('deploy', client);

		const ticketChannelId = TICKET_CHANNEL_ID;
		const channel = await client.channels.fetch(ticketChannelId);
		if (!channel) {
			console.error('oops, that channel doesn\'t exist');
			return;
		}

		const storage = readStorage();
		let message;

		if (storage.ticketMessageId) {
			try {
				message = await channel.messages.fetch(storage.ticketMessageId);
			} catch {

			}
		}

		if (!message) {
			const embed = new EmbedBuilder()
				.setTitle('open a ticket here')
				.setDescription('click the button below to open a new support ticket.')
				.setColor('Orange');

			const button = new ButtonBuilder()
				.setCustomId('create_ticket')
				.setLabel('Create ticket')
				.setStyle(ButtonStyle.Success);

			const row = new ActionRowBuilder().addComponents(button);

			message = await channel.send({ embeds: [embed], components: [row] });

			storage.ticketMessageId = message.id;
			writeStorage(storage);
		} else {
			console.log('message already exists...');
		}
	},
};
