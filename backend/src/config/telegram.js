import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';

dotenv.config();

let bot = null;

if (process.env.TELEGRAM_BOT_TOKEN) {
  bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: false });
}

export const sendTelegramNotification = async (message) => {
  if (!bot || !process.env.TELEGRAM_CHAT_ID) {
    console.log('Telegram notification (not configured):', message);
    return;
  }

  try {
    await bot.sendMessage(process.env.TELEGRAM_CHAT_ID, message, {
      parse_mode: 'HTML'
    });
  } catch (error) {
    console.error('Telegram notification error:', error);
  }
};

