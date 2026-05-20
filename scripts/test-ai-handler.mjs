import { handler } from '../api/ai.js';

async function runTests() {
  console.log('Test 1: missing prompt -> expect 400');
  let res = await handler({ httpMethod: 'POST', body: JSON.stringify({}) }, {});
  console.log('Status:', res.statusCode, 'Body:', res.body);

  console.log('\nTest 2: invalid GROQ endpoint -> expect 502 or 504, but no exception');
  process.env.GROQ_API_KEY = 'test-key';
  process.env.GROQ_API_BASE = 'https://httpbin.org'; // will 404 on /chat/completions
  res = await handler(
    { httpMethod: 'POST', body: JSON.stringify({ prompt: 'Hello world' }), headers: {} },
    {}
  );
  console.log('Status:', res.statusCode, 'Body:', res.body);
}

runTests().catch((e) => { console.error('Test runner error', e); process.exit(1); });
