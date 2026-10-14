// api/auth.js
const crypto = require('crypto');
const { isKVConfigured, kvGet, kvSet } = require('./_kv');

function hashPin(pin) {
  return crypto.createHash('sha256').update(String(pin) + '_myplan_cartridge_salt_1989').digest('hex');
}

function generateToken() {
  return crypto.randomBytes(24).toString('hex');
}

function normalizeUsername(name) {
  return String(name || '').trim().toLowerCase();
}

module.exports = async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'METHOD_NOT_ALLOWED' });
  }

  if (!isKVConfigured()) {
    return res.status(503).json({
      success: false,
      error: 'KV_NOT_CONFIGURED',
      message: 'Vercel KV 스토리지 연결이 필요합니다. Vercel 대시보드의 Storage 탭에서 KV를 연결해주세요.',
    });
  }

  try {
    const { action, username, pin, token, initialState } = req.body || {};
    const normUser = normalizeUsername(username);
    const OWNER_USERNAMES = ['udd43', 'jongwon', 'jangjongwon', 'admin', 'master'];
    const isOwnerUser = OWNER_USERNAMES.includes(normUser);

    // 1. Session Token Validation (Auto login check)
    if (action === 'check') {
      if (!normUser || !token) {
        return res.status(400).json({ success: false, error: 'MISSING_PARAMS' });
      }
      const user = await kvGet(`user:${normUser}`);
      if (!user || user.token !== token) {
        return res.status(401).json({ success: false, error: 'INVALID_SESSION' });
      }
      const userMode = user.mode || (isOwnerUser ? 'workout' : 'custom');
      return res.status(200).json({
        success: true,
        username: user.username,
        mode: userMode,
      });
    }

    // 2. Register (신규 세이브 생성)
    if (action === 'register') {
      if (!normUser || normUser.length < 2 || normUser.length > 20) {
        return res.status(400).json({
          success: false,
          error: 'INVALID_USERNAME',
          message: '아이디는 2자 이상 20자 이하로 입력해주세요.',
        });
      }
      if (!pin || String(pin).length < 4) {
        return res.status(400).json({
          success: false,
          error: 'INVALID_PIN',
          message: '비밀번호(PIN)는 4자리 이상이어야 합니다.',
        });
      }

      const existingUser = await kvGet(`user:${normUser}`);
      if (existingUser) {
        return res.status(409).json({
          success: false,
          error: 'USER_ALREADY_EXISTS',
          message: '이미 존재하는 아이디입니다. 로드(로그인)를 진행해주세요.',
        });
      }

      const sessionToken = generateToken();
      const userMode = req.body.mode || (isOwnerUser ? 'workout' : 'custom');
      const newUser = {
        username: String(username).trim(),
        hash: hashPin(pin),
        token: sessionToken,
        mode: userMode,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      await kvSet(`user:${normUser}`, newUser);

      // Save initial state if provided
      if (initialState) {
        await kvSet(`data:${normUser}`, {
          state: initialState,
          updatedAt: Date.now(),
        });
      }

      return res.status(200).json({
        success: true,
        username: newUser.username,
        token: sessionToken,
        mode: userMode,
        isNew: true,
      });
    }

    // 3. Login (기존 세이브 로드)
    if (action === 'login') {
      if (!normUser || !pin) {
        return res.status(400).json({
          success: false,
          error: 'MISSING_CREDENTIALS',
          message: '아이디와 비밀번호를 모두 입력해주세요.',
        });
      }

      const user = await kvGet(`user:${normUser}`);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'USER_NOT_FOUND',
          message: '존재하지 않는 아이디입니다. 신규 세이브 생성을 진행해주세요.',
        });
      }

      const expectedHash = hashPin(pin);
      if (user.hash !== expectedHash) {
        return res.status(401).json({
          success: false,
          error: 'WRONG_PIN',
          message: '비밀번호(PIN)가 일치하지 않습니다.',
        });
      }

      // Refresh token
      const sessionToken = generateToken();
      user.token = sessionToken;
      user.updatedAt = Date.now();
      const userMode = user.mode || (isOwnerUser ? 'workout' : 'custom');
      user.mode = userMode;
      await kvSet(`user:${normUser}`, user);

      // Get user cloud data
      const cloudData = await kvGet(`data:${normUser}`);

      return res.status(200).json({
        success: true,
        username: user.username,
        token: sessionToken,
        mode: userMode,
        data: cloudData ? cloudData.state : null,
        updatedAt: cloudData ? cloudData.updatedAt : null,
      });
    }

    // 4. Update Mode (모드 변경)
    if (action === 'update_mode') {
      if (!normUser || !token) {
        return res.status(400).json({ success: false, error: 'MISSING_PARAMS' });
      }
      const user = await kvGet(`user:${normUser}`);
      if (!user || user.token !== token) {
        return res.status(401).json({ success: false, error: 'INVALID_SESSION' });
      }
      const targetMode = req.body.mode === 'workout' ? 'workout' : 'custom';
      user.mode = targetMode;
      user.updatedAt = Date.now();
      await kvSet(`user:${normUser}`, user);
      return res.status(200).json({ success: true, mode: targetMode });
    }

    return res.status(400).json({ success: false, error: 'UNKNOWN_ACTION' });
  } catch (err) {
    console.error('Auth handler error:', err);
    return res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: err.message || '인증 처리 중 오류가 발생했습니다.',
    });
  }
};
