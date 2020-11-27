const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  let pathname = url.parse(req.url).pathname.slice(1);

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

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'GET':
      const rs = fs.createReadStream(filepath);

      rs.on("error", (err) => {
        if(err.code === "ENOENT") {
          res.statusCode = 404;
          res.end("File not found");
        } else {
          res.statusCode = 500;
          res.end("Server error");
        }
      });

      rs.on("end", () => {
        res.statusCode = 200;
        res.end();
      })

      rs.pipe(res);

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
