const {
  SHA256
} = require('crypto-js');
const jwt = require('jsonwebtoken');

var data = {
  id: 10
};
var token = jwt.sign(data, '123abc');
console.log(token);

var decoded = jwt.verify(token , '123abc');
console.log('decoded', decoded);
// var msg = 'I am user 3';
// var hash = SHA256(msg).toString();
//
// console.log(msg);
// console.log(hash);
//
// var data = {
//   id: 6
// };
//
// var token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// };
//
// token.data.id = 6;
// token.hash = SHA256(JSON.stringify(token.data)).toString();
//
// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();
// if (resultHash == token.hash) {
//   console.log('Data was not changed');
// } else {
//   console.log('Data was changed. Do not trust!');
// }
