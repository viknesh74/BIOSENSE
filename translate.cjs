const fs = require('fs');
const https = require('https');

// Read keys
const keys = JSON.parse(fs.readFileSync('english_keys.json', 'utf8'));

// Read env
const envContent = fs.readFileSync('.env', 'utf8');
const apiKeyMatch = envContent.match(/VITE_GROQ_API_KEY=(.*)/);
if (!apiKeyMatch) {
  console.error("No Groq API key found in .env");
  process.exit(1);
}
const apiKey = apiKeyMatch[1].trim();

// Prepare prompt
const prompt = `You are a professional translator translating an Indian dairy farming app into Hindi.
Translate the following English strings into natural, easy-to-understand Hindi suitable for farmers. 
Return ONLY a valid JSON object where keys are the exact English strings, and values are the Hindi translations. No markdown, no explanations, just pure JSON.

Strings to translate:
` + JSON.stringify(keys);

const data = JSON.stringify({
  model: 'llama-3.3-70b-versatile',
  messages: [{ role: 'user', content: prompt }],
  temperature: 0.2,
  max_tokens: 8192,
  response_format: { type: 'json_object' }
});

const options = {
  hostname: 'api.groq.com',
  port: 443,
  path: '/openai/v1/chat/completions',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`,
    'Content-Length': Buffer.byteLength(data)
  }
};

console.log("Calling Groq API to translate " + keys.length + " strings...");

const req = https.request(options, res => {
  let body = '';
  res.on('data', chunk => { body += chunk; });
  res.on('end', () => {
    if (res.statusCode !== 200) {
      console.error("API Error: ", body);
      process.exit(1);
    }
    const responseData = JSON.parse(body);
    const content = responseData.choices[0].message.content;
    try {
      const translations = JSON.parse(content);
      fs.writeFileSync('src/context/hindiDictionary.json', JSON.stringify(translations, null, 2));
      console.log("Saved translations to src/context/hindiDictionary.json");
    } catch (e) {
      console.error("Failed to parse JSON response:", e);
      console.log("Raw content:", content);
    }
  });
});

req.on('error', e => {
  console.error("Request failed: " + e.message);
});

req.write(data);
req.end();
