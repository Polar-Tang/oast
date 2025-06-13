const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
  // Parse the URL
  const parsedUrl = url.parse(req.url, true);
  
  // Log request details to console
  console.log('=== Incoming Request ===');
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  console.log('Path:', parsedUrl.pathname);
  console.log('Query Parameters:', parsedUrl.query);
  console.log('Headers:', req.headers);
  console.log('User Agent:', req.headers['user-agent']);
  console.log('IP Address:', req.connection.remoteAddress || req.socket.remoteAddress);
  console.log('Timestamp:', new Date().toISOString());
  
  // Handle POST/PUT requests with body
  if (req.method === 'POST' || req.method === 'PUT') {
    let body = '';
    
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      console.log('Request Body:', body);
      console.log('========================\n');
      
      // Send response
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        message: 'Request received and logged',
        method: req.method,
        url: req.url,
        timestamp: new Date().toISOString()
      }));
    });
  } else {
    console.log('========================\n');
    
    // Send response for GET and other methods
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      message: 'Request received and logged',
      method: req.method,
      url: req.url,
      timestamp: new Date().toISOString()
    }));
  }
});

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`You can test it by visiting: http://localhost:${PORT}`);
  console.log('All incoming requests will be logged to this console.\n');
});

// Handle server errors
server.on('error', (err) => {
  console.error('Server error:', err);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down server...');
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});
