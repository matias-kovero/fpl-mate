const basic_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36';
const base = 'https://fpl-server.vercel.app';
// Naive cache - cross session?
const cache = new Map();

function checkCache(key) {
  if (cache.has(key)) {
    console.log('[Cache]', key);
    return cache.get(key);
  }
  return false;
}

function addCache(key, data) {
  // Somehow timestamp stuff.
  cache.set(key, data);
}

// @ts-ignore
async function send({ method, path, data, token }) {
  const opts = { method, headers: {} };
  //console.log(`[GET] /${path}`);
  opts.headers['User-Agent'] = basic_UA;

  if (data) {
    opts.headers['Content-Type'] = 'application/json';
    opts.body = JSON.stringify(data);
  } 
  if (token) {
    opts.headers['Authorization'] = `Token ${token}`;
  }

  return fetch(`${base}/${path}`, opts)
  .then((r) => r.text())
  .then(json => {
    try { 
      return JSON.parse(json);
    } catch (err) {
      return json;
    }
  });
}

// @ts-ignore
export async function get(path, token, cache) {
  // https://stackoverflow.com/questions/64092593/svelte-is-there-a-way-to-cache-the-api-result-in-a-way-that-it-wont-trigger-th
  // https://www.reddit.com/r/sveltejs/comments/moehvi/confused_with_different_ways_to_fetch_api/
  if (cache) {
    let cached = checkCache(path);
    if (cached) return cached;
    // @ts-ignore
    let data = await send({ method: 'GET', path, token });
    addCache(path, data);
    return data;
  }
  // @ts-ignore
  return send({ method: 'GET', path, token, cache });
}

export function del(path, token) {
  // @ts-ignore
  return send({ method: 'DELETE', path, token });
}

export function post(path, data, token) {
  // @ts-ignore
  return send({ method: 'POST', path, data, token });
}
export function put(path, data, token) {
  // @ts-ignore
  return send({ method: 'PUT', path, data, token });
}