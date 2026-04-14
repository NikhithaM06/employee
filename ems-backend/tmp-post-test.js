const http = require('http');
const data = JSON.stringify({
  name:'Test User',
  age:25,
  experience:2,
  salary:50000,
  previousCompany:'ABC Technologies',
  domain:'Developer',
  skills:['MERN(FULLSTACK)'],
  image:'https://via.placeholder.com/150',
  status:'active'
});
const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/employees',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};
const req = http.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => { body += chunk; });
  res.on('end', () => {
    console.log('STATUS', res.statusCode);
    console.log(body);
  });
});
req.on('error', (e) => console.error('ERROR', e));
req.write(data);
req.end();