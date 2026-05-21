const jwt = require('jsonwebtoken');

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'uzafo-service-admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin_1234';
const JWT_SECRET = process.env.JWT_SECRET || 'uzafo_secret_key';

const login = async (req, res) => {
  const { username, password } = req.body;

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const token = jwt.sign({ username, role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
    return res.json({ 
      success: true, 
      token,
      user: { username, role: 'admin' }
    });
  }

  return res.status(401).json({ success: false, message: 'Noto\'g\'ri login yoki parol' });
};

const verify = async (req, res) => {
  // If middleware passed, token is valid
  res.json({ success: true, user: req.user });
};

module.exports = {
  login,
  verify
};
