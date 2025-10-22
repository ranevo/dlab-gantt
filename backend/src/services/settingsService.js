import { query } from '../db.js';
import { config } from '../config.js';

const SETTINGS_CACHE = new Map();

export const refreshSettingsCache = async () => {
  const rows = await query('SELECT `key`, `value` FROM settings');
  SETTINGS_CACHE.clear();
  rows.forEach((row) => SETTINGS_CACHE.set(row.key, row.value));
  if (!SETTINGS_CACHE.has('session_timeout_minutes')) {
    SETTINGS_CACHE.set('session_timeout_minutes', '10');
  }
  if (!SETTINGS_CACHE.has('highlight_color')) {
    SETTINGS_CACHE.set('highlight_color', config.defaultHighlightColor);
  }
  if (!SETTINGS_CACHE.has('memo_font_size')) {
    SETTINGS_CACHE.set('memo_font_size', String(config.defaultMemoFontSize));
  }
  if (!SETTINGS_CACHE.has('attachment_root')) {
    SETTINGS_CACHE.set('attachment_root', config.attachmentStorage);
  }
  return SETTINGS_CACHE;
};

export const getSetting = async (key) => {
  if (!SETTINGS_CACHE.size) {
    await refreshSettingsCache();
  }
  return SETTINGS_CACHE.get(key);
};

export const getSettings = async () => {
  if (!SETTINGS_CACHE.size) {
    await refreshSettingsCache();
  }
  return Object.fromEntries(SETTINGS_CACHE.entries());
};

export const updateSettings = async (settings) => {
  const keys = Object.keys(settings);
  for (const key of keys) {
    const value = settings[key];
    await query(
      'INSERT INTO settings (`key`, `value`) VALUES (:key, :value) ON DUPLICATE KEY UPDATE `value` = VALUES(`value`)',
      { key, value }
    );
    SETTINGS_CACHE.set(key, String(value));
  }
  return getSettings();
};
