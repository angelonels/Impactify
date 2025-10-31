async function upload(req, res) {
  return res.status(201).json({ datasetId: 'stub' });
}

async function profile(req, res) {
  return res.json({ status: 'profiling-started' });
}

async function commit(req, res) {
  return res.json({ status: 'ready' });
}

module.exports = { upload, profile, commit };


