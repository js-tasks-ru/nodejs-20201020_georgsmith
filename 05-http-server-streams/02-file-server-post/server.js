const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();

server.on('request', (req, res) => {
  let pathname = url.parse(req.url).pathname.slice(1);

  if(!pathname) {
    res.statusCode = 400;
    res.end("Please provide file name");
    return;
  }

  try {
    pathname = decodeURIComponent(pathname);
  } catch(err) {
    res.statusCode = 400;
    res.end("Bad request");
  }

  if(pathname.includes("\0") || pathname.includes("/")) {
    res.statusCode = 400;
    res.end("Bad request");
    return;
  }

  switch (req.method) {
    case 'POST':
      const filePath = path.join(__dirname, 'files', pathname);
      const ws = fs.createWriteStream(filePath, { flags: 'wx' });
      const ls = new LimitSizeStream({ limit: 1000000 });

      req.pipe(ls).pipe(ws);

      ws.on("error", (err) => {
        if(err.code === 'EEXIST') {
          res.statusCode = 409;
          res.end("File already exists");
        } else {
          res.statusCode = 500;
          res.end("Internal server error");
        }
      });

      ws.on("close", () => {
        res.statusCode = 201;
        res.end("Success");
      })

      ls.on("error", (err) => {
        if(err.code === 'LIMIT_EXCEEDED') {
          res.statusCode = 413;
          res.end('File is too big');

          fs.unlink(filePath, () => {})
        }
      });

      res.on("close", () => {
        if (res.finished) return;
        res.end('Connection interrupted');
        fs.unlink(filePath, () => {})
      })

      break;
    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
