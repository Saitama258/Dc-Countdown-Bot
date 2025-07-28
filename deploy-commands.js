import { REST, Routes, SlashCommandBuilder } from 'discord.js';
import dotenv from 'dotenv';
dotenv.config();

const commands = [
  new SlashCommandBuilder()
    .setName('geri-sayim')
    .setDescription('Belirtilen tarihe geri sayım yapar.')
    .addStringOption(option =>
      option
        .setName('tarih')
        .setDescription('GG.AA.YYYY SS:DD formatında tarih (örnek: 31.12.2025 23:59)')
        .setRequired(true)
    )
    .toJSON(),
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log('Slash komutları yükleniyor...');
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: commands }
    );
    console.log('Slash komutları başarıyla yüklendi!');
  } catch (error) {
    console.error(error);
  }
})();
