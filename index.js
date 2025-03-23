const express = require('express');
const mongoose = require('mongoose');
const shortid = require('shortid');
const validUrl = require('valid-url');
require('dotenv').config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const urlSchema = new mongoose.Schema({
  longUrl: { type: String, required: true },
  shortCode: { type: String, unique: true, required: true },
  clicks: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  expiryDate: { type: Date },
});
const URL = mongoose.model('URL', urlSchema);

// Shorten URL Endpoint
app.post('/shorten', async (req, res) => {
  const { longUrl, alias, expiry } = req.body;

  if (!validUrl.isUri(longUrl)) {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  let shortCode = alias || shortid.generate();
  if (alias) {
    const existingAlias = await URL.findOne({ shortCode: alias });
    if (existingAlias) {
      return res.status(400).json({ error: 'Alias already in use' });
    }
  }

  let expiryDate = expiry ? new Date(Date.now() + expiry * 1000) : null;

  let url = await URL.findOne({ longUrl });
  if (!url) {
    url = new URL({ longUrl, shortCode, expiryDate });
    await url.save();
  }

  res.json({ shortUrl: `${req.protocol}://${req.get('host')}/${shortCode}` });
});

// Redirect Endpoint
app.get('/:shortCode', async (req, res) => {
  const { shortCode } = req.params;
  const url = await URL.findOne({ shortCode });

  if (!url) {
    return res.status(404).json({ error: 'Short URL not found' });
  }
  if (url.expiryDate && url.expiryDate < new Date()) {
    return res.status(410).json({ error: 'Short URL expired' });
  }

  url.clicks++;
  await url.save();
  res.redirect(url.longUrl);
});

// Statistics Endpoint
app.get('/stats/:shortCode', async (req, res) => {
  const { shortCode } = req.params;
  const url = await URL.findOne({ shortCode });

  if (!url) {
    return res.status(404).json({ error: 'Short URL not found' });
  }

  res.json({ longUrl: url.longUrl, shortCode: url.shortCode, clicks: url.clicks, expiryDate: url.expiryDate });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));