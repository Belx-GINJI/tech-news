/**
 * 毎朝8時(JST)にニュースを自動取得するCronスクリプト
 *
 * 使い方:
 *   npm run cron
 *
 * このスクリプトは常駐プロセスとして動作し、
 * 毎日日本時間8:00にRSSフィードを取得してJSONファイルに保存します。
 *
 * Windowsのタスクスケジューラーで npm run fetch-news を
 * 毎朝8時に実行する方法でも代用できます。
 */
import cron from 'node-cron';
import { fetchAndSave } from './fetch-now';

console.log('[Cron] Tech News Aggregator - Cron scheduler started');
console.log('[Cron] Scheduled: Every day at 08:00 JST (23:00 UTC)');

cron.schedule(
  '0 23 * * *',
  async () => {
    console.log(`\n[Cron] Triggered at ${new Date().toISOString()}`);
    await fetchAndSave();
  },
  { timezone: 'Asia/Tokyo' }
);

console.log('[Cron] Waiting for next scheduled run...');
console.log('[Cron] Press Ctrl+C to stop.\n');
