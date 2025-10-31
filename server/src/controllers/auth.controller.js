async function login(req, res) {
  return res.json({ token: 'stub', user: { id: 'stub', email: req.body.email } });
}

async function signup(req, res) {
  return res.status(201).json({ id: 'stub', email: req.body.email });
}

module.exports = { login, signup };


