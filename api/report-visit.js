// api/report-visit.js
// Ini adalah Vercel Function (Node.js) untuk mengirim notifikasi
// PERHATIAN: Bot Token dan Chat ID dimasukkan LANGSUNG di sini.
// INI SANGAT TIDAK AMAN DAN TIDAK DIREKOMENDASIKAN UNTUK PRODUKSI.
// Kredensial ini akan TERLIHAT jika kode Anda diakses publik.

const TELEGRAM_BOT_TOKEN = '7599993058:AAEGx3i3A00FUNyGHFaYLwcGduRbRaWYNxk'; // <<-- TOKEN BOT ANDA
const TELEGRAM_CHAT_ID = '7666363970';     // <<-- CHAT ID ANDA
const TO_EMAIL = 'penerima@contoh.com';   // <<-- GANTI DENGAN EMAIL PENERIMA (masih disarankan pakai Environment Variable)
const SENDER_EMAIL = 'pengirim@contoh.com'; // <<-- GANTI DENGAN EMAIL PENGIRIM (masih disarankan pakai Environment Variable)

module.exports = async (req, res) => {
    // Set zona waktu ke WIB (Waktu Indonesia Barat)
    process.env.TZ = 'Asia/Jakarta';

    // Ambil informasi pengunjung dari request
    // IP Address diambil dari header Vercel 'x-forwarded-for' atau 'x-real-ip'
    const ip_address = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'Unknown';
    const user_agent = req.headers['user-agent'] || 'Unknown';
    const visit_time = new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta', hour12: false });
    const referer = req.headers['referer'] || 'Direct/Unknown';

    // Buat pesan notifikasi
    const message_content = `Halo Dayzx,\n\n` +
                           `Seseorang baru saja mengunjungi website Genta Nada Band!\n\n` +
                           `Detail Kunjungan:\n` +
                           `------------------\n` +
                           `Waktu Kunjungan: ${visit_time} WIB\n` +
                           `Alamat IP Pengunjung: ${ip_address}\n` +
                           `User Agent (Browser/OS): ${user_agent}\n` +
                           `Halaman Asal: ${referer}\n\n` +
                           `Terima kasih!\n` +
                           `Sistem Notifikasi Genta Nada Band (via Vercel Function).`;

    let telegramSuccess = false;
    let emailSuccess = false;

    // --- Kirim Notifikasi Telegram ---
    if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
        try {
            const telegram_full_url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage?chat_id=${TELEGRAM_CHAT_ID}&text=${encodeURIComponent(message_content)}&parse_mode=HTML`;
            const telegramResponse = await fetch(telegram_full_url);
            if (telegramResponse.ok) {
                telegramSuccess = true;
            } else {
                console.error('Failed to send Telegram notification:', telegramResponse.status, await telegramResponse.text());
            }
        } catch (error) {
            console.error('Error sending Telegram notification:', error);
        }
    }

    // --- Kirim Notifikasi Email ---
    // Mengirim email langsung dari Vercel Function tanpa layanan pihak ketiga sangat kompleks.
    // Biasanya butuh integrasi dengan SendGrid, Mailgun, atau layanan SMTP lainnya.
    // Bagian ini hanya placeholder.
    if (TO_EMAIL && SENDER_EMAIL) {
        try {
            // Placeholder: Di sini Anda akan mengintegrasikan API dari layanan email seperti SendGrid.
            // ... (kode integrasi email service API) ...
            emailSuccess = true; // Anggap berhasil untuk contoh ini
            console.log('Email sending logic would be here. Requires external email service API.');
        } catch (error) {
            console.error('Error sending email notification:', error);
        }
    }


    // Beri respons balik ke klien
    if (telegramSuccess || emailSuccess) {
        res.status(200).json({ status: "success", message: "Visit reported via Vercel Function" });
    } else {
        res.status(500).json({ status: "error", message: "Failed to send any notification. Check Vercel logs." });
    }
};
