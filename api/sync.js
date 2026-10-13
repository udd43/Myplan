// api/sync.js
const { isKVConfigured, kvGet, kvSet } = require('./_kv');

function normalizeUsername(name) {
  return String(name || '').trim().toLowerCase();
}

module.exports = async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

  if (!isKVConfigured()) {
    return res.status(503).json({
      success: false,
      error: 'KV_NOT_CONFIGURED',
      message: 'Vercel KV 스토리지 연결이 필요합니다.',
    });
  }

  try {
    // 1. GET: Cloud state fetch
    if (req.method === 'GET') {
      const { username, token } = req.query || {};
      const normUser = normalizeUsername(username);

      if (!normUser || !token) {
        return res.status(400).json({ success: false, error: 'MISSING_PARAMS' });
      }

      const user = await kvGet(`user:${normUser}`);
      if (!user || user.token !== token) {
        return res.status(401).json({ success: false, error: 'UNAUTHORIZED' });
      }

      const cloudData = await kvGet(`data:${normUser}`);
      return res.status(200).json({
        success: true,
        username: user.username,
        data: cloudData ? cloudData.state : null,
        updatedAt: cloudData ? cloudData.updatedAt : null,
      });
    }

    // 2. POST: Cloud state save / sync
    if (req.method === 'POST') {
      const { username, token, state } = req.body || {};
      const normUser = normalizeUsername(username);

      if (!normUser || !token) {
        return res.status(400).json({ success: false, error: 'MISSING_PARAMS' });
      }

      const user = await kvGet(`user:${normUser}`);
      if (!user || user.token !== token) {
        return res.status(401).json({ success: false, error: 'UNAUTHORIZED', message: '로그인 세션이 만료되었습니다.' });
      }

      if (!state || typeof state !== 'object') {
        return res.status(400).json({ success: false, error: 'INVALID_STATE' });
      }

      const updatedAt = Date.now();
      await kvSet(`data:${normUser}`, {
        state,
        updatedAt,
      });

      return res.status(200).json({
        success: true,
        updatedAt,
      });
    }

    return res.status(405).json({ success: false, error: 'METHOD_NOT_ALLOWED' });
  } catch (err) {
    console.error('Sync handler error:', err);
    return res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: err.message || '데이터 동기화 중 오류가 발생했습니다.',
    });
  }
};
