import { Client, GatewayIntentBits, Events } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

// Tarih parse fonksiyonu
function parseDateString(tarihStr) {
  const [datePart, timePart] = tarihStr.split(' ');
  if (!datePart || !timePart) return null;

  const [gun, ay, yil] = datePart.split('.');
  const [saat, dakika] = timePart.split(':');

  if (!gun || !ay || !yil || !saat || !dakika) return null;

  const isoString = `${yil}-${ay.padStart(2, '0')}-${gun.padStart(2, '0')}T${saat.padStart(2, '0')}:${dakika.padStart(2, '0')}:00`;
  const tarih = new Date(isoString);

  if (isNaN(tarih.getTime())) return null;

  return tarih;
}

client.once(Events.ClientReady, () => {
  console.log(`✅ Bot giriş yaptı: ${client.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'geri-sayim') {
    const tarihStr = interaction.options.getString('tarih');
    const hedefTarih = parseDateString(tarihStr);

    if (!hedefTarih) {
      return interaction.reply({ content: '❌ Geçersiz tarih formatı! Lütfen GG.AA.YYYY SS:DD formatında yazınız.', ephemeral: true });
    }

    const simdi = new Date();
    let fark = hedefTarih - simdi;
    if (fark <= 0) {
      return interaction.reply({ content: '⏰ Tarih geçmiş veya şu an!', ephemeral: true });
    }

    // İlk mesajı gönder
    await interaction.reply('⏳ Geri sayım başlıyor...');

    // Mesajı al
    let mesaj;
    try {
      mesaj = await interaction.fetchReply();
    } catch (err) {
      console.error('Mesaj alınamadı:', err);
      return;
    }

    // Her saniye mesajı güncelle
    const interval = setInterval(async () => {
      const simdi = new Date();
      const fark = hedefTarih - simdi;

      if (fark <= 0) {
        clearInterval(interval);
        try {
          await mesaj.edit('⏰ Geri sayım tamamlandı!');
        } catch (error) {
          console.error('Mesaj güncellenemedi:', error);
        }
        return;
      }

      const saniye = Math.floor(fark / 1000);
      const gun = Math.floor(saniye / (3600 * 24));
      const saat = Math.floor((saniye % (3600 * 24)) / 3600);
      const dakika = Math.floor((saniye % 3600) / 60);
      const kalanSaniye = saniye % 60;

      const text = `⏳ **${tarihStr}** tarihine kadar:\n **${gun} gün, ${saat} saat, ${dakika} dakika, ${kalanSaniye} saniye kaldı.**`;

      try {
        await mesaj.edit(text);
      } catch (error) {
        clearInterval(interval);
        console.error('Mesaj güncellenemedi:', error);
      }
    }, 1000);
  }
});

client.login(process.env.TOKEN);
