export default function middleware(req) {
  // Get the request headers
  const headers = new Headers(req.headers);
  
  // Add the ngrok skip browser warning header
  headers.set('ngrok-skip-browser-warning', 'true');
  
  // Clone the request with the modified headers
  return new Request(req.url, {
    headers,
    method: req.method,
    body: req.body,
    redirect: req.redirect,
    credentials: req.credentials
  });
}