async function translate(req, res) {
  return res.json({ sql: 'SELECT 1', chartType: 'bar' });
}

async function execute(req, res) {
  return res.json({ data: [], chartType: req.body.chartType || 'bar' });
}

module.exports = { translate, execute };


