const {SHA256}=require('crypto-js');
const jwt=require('jsonwebtoken');
const bcrypt =require('bcryptjs');

var password='123abc';

bcrypt.genSalt(10,(err,salt)=>{
bcrypt.hash(password,salt,(err,hash)=>{
  console.log(hash);
});

});


// var data={
//   id:10
// };
//
// var token=jwt.sign(data,'secret123');
// console.log(token.toString());
//
// var decode=jwt.verify(token,'secret123');
// console.log('decode:',decode);








//
// var message="I am a new user";
// var hash=SHA256(message).toString();
//
// console.log(message);
// console.log(hash);
//
// var data={
//   id:4
// };
//
// var token={
//   data,
//   hash:SHA256(JSON.stringify(data)+'someone').toString()
// }
// token.data=5;
// token.hash=SHA256(JSON.stringify(data)).toString();
// var resulthash=SHA256(JSON.stringify(token.data)+'someone').toString();
//
// if(resulthash===token.hash){
//   console.log('Data is same');
// }else{
//   console.log('data is not same');
// }
