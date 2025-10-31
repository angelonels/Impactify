async function stats(_req, res) {
  return res.json({ users: 0, datasets: 0 });
}

async function users(_req, res) {
  return res.json({ items: [] });
}

module.exports = { stats, users };


