import { SlashCommandBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('geri-sayim')
        .setDescription('Belirli bir tarihe geri sayım yapar.')
        .addStringOption(option =>
            option.setName('tarih')
                .setDescription('Tarih formatı: GG.AA.YYYY SS:DD')
                .setRequired(true)
        ),

    async execute(interaction) {
        const tarihStr = interaction.options.getString('tarih');
        const hedefTarih = new Date(tarihStr.replace(' ', 'T'));

        if (isNaN(hedefTarih)) {
            return interaction.reply('❌ Geçersiz tarih formatı. Örnek: `01.01.2026 00:00`');
        }

        const simdi = new Date();
        const fark = hedefTarih - simdi;

        if (fark <= 0) {
            return interaction.reply('⏰ Bu tarih geçmişte kaldı.');
        }

        const saniye = Math.floor(fark / 1000);
        const gun = Math.floor(saniye / (3600 * 24));
        const saat = Math.floor((saniye % (3600 * 24)) / 3600);
        const dakika = Math.floor((saniye % 3600) / 60);
        const kalanSaniye = saniye % 60;

        await interaction.reply(`⏳ **${tarihStr}** tarihine kadar:\n **${gun} gün, ${saat} saat,  ${dakika} dakika, ${kalanSaniye} saniye kaldı.**`);
    }
}
