const http = require('http');
const fs = require('fs').promises;
const path = require('path');
const spawn = require('child_process').spawn;
const iconv = require('iconv-lite');

http
  .createServer(async (req, res) => {
    try {
      console.log(req.method, req.url); // REST Method, url 출력

      if (req.method === 'GET') {
        if (req.url === '/') {
          const data = await fs.readFile(path.join(__dirname, '/client/index.html'));

          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          return res.end(data);
        }

        try {
          const data = await fs.readFile(path.join(__dirname, `/client${req.url}`));

          return res.end(data);
        } catch (err) {
          //404 Not Found
          console.log(`${req.url}: Not Found`);

          res.writeHead(404);
          res.end(err.message);
        }
      } else if (req.method === 'POST') {
        if (req.url === '/data') {
          let body = '';

          req.on('data', (data) => {
            body += data;
          });

          req.on('end', async () => {
            const { data } = JSON.parse(body);

            console.log(`Web Data: ${data}`);

            const python = spawn('python', [path.join(__dirname, '/python/python.py'), `${data}`]); // Python 파일 호출

            python.stdout.on('data', (data) => {
              const pythonData = iconv.decode(data, 'EUC-KR').toString(); // 파이썬 한글 깨짐 해결 코드

              console.log(`Python Data: ${pythonData}`);

              res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
              res.end(pythonData);
            });

            python.stderr.on('data', (err) => {
              console.error(err.toString());
            });
          });
        } else if (req.url === '/data-http') {
          let body = '';

          req.on('data', (data) => {
            body += data;
          });

          req.on('end', async () => {
            const pythonHttpData = body.split('=')[1];

            console.log(`Python Http Data: ${pythonHttpData}`);

            res.end(pythonHttpData);
          });
        }
      }
    } catch (err) {
      // Server Error
      console.error(err);

      res.writeHead(500);
      res.end(err.message);
    }
  })
  .listen(8080, () => {
    console.log('8080번 포트에서 서버 실행 중...');
  });
