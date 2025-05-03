const { SlashCommandBuilder } = require('discord.js');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const { AttachmentBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('qrcode')
		.setDescription('sends a QR code')
        .addStringOption(option =>
			option
				.setName('link')
				.setDescription('link to be converted to QR code')
                .setRequired(true))
        .addNumberOption(option =>
            option
                .setName('size')
                .setDescription('size of the QR code')
                .setRequired(false)
                .addChoices(
                    { name: '150x150', value: 150 },
                    { name: '300x300', value: 300 },
                    { name: '600x600', value: 600 },
                )),
	async execute(interaction) {
        const reason = interaction.options.getString('link') ?? 'No link provided';
        const size = interaction.options.getNumber('size') ?? 150;
        const sizeString = `${size}x${size}`;
        const url = `https://api.qrserver.com/v1/create-qr-code/?size=${sizeString}&data=${reason}`;

        // Make URL to png
        
        const response = await fetch(url);
        if (!response.ok) {
            return await interaction.reply('Failed to generate QR code.');
        }

        const buffer = await response.buffer();
        const attachment = new AttachmentBuilder(buffer, { name: 'qrcode.png' });

        await interaction.reply({ files: [attachment] });
	},
};

