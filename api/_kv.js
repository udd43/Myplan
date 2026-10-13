// api/_kv.js
// Lightweight, zero-dependency Upstash / Vercel KV REST client

const KV_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

function isKVConfigured() {
  return Boolean(KV_URL && KV_TOKEN);
}

async function kvCommand(command, ...args) {
  if (!isKVConfigured()) {
    const err = new Error('KV_NOT_CONFIGURED');
    err.code = 'KV_NOT_CONFIGURED';
    throw err;
  }

  const res = await fetch(`${KV_URL}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${KV_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify([command, ...args]),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`KV REST Error ${res.status}: ${errText}`);
  }

  const data = await res.json();
  if (data.error) {
    throw new Error(data.error);
  }
  return data.result;
}

async function kvGet(key) {
  const raw = await kvCommand('GET', key);
  if (!raw) return null;
  if (typeof raw === 'object') return raw;
  try {
    return JSON.parse(raw);
  } catch (e) {
    return raw;
  }
}

async function kvSet(key, value) {
  const str = typeof value === 'object' ? JSON.stringify(value) : String(value);
  return await kvCommand('SET', key, str);
}

async function kvDel(key) {
  return await kvCommand('DEL', key);
}

module.exports = {
  isKVConfigured,
  kvCommand,
  kvGet,
  kvSet,
  kvDel,
};
