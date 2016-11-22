const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = '123abc!';

// bcrypt.genSalt(10, (err, salt) => {
//     bcrypt.hash(password, salt, (err, hash) => {
//         console.log(hash);
//     })
// });

var hashedPassword = '$2a$10$34DZeNtjKziCtTElAgYYDuSq9ZYd5DgwHBowXsUHUpVtxVszYKSIm';

bcrypt.compare(password, hashedPassword, (err, result) => {
    console.log(result);
})

// var data = {
//     id: 4
// };
// var token = jwt.sign(data, '123abc');
// console.log(token);

// var decoded = jwt.verify(token, '123abc');
// console.log(decoded);

// var message = 'I am user 5';
// var hash = SHA256(message).toString();

// console.log(`Message: ${message}`);
// console.log(`Hash: ${hash}`);

// var data = {
//     id: 4
// };

// var token = {
//     data: data,
//     hash: SHA256(JSON.stringify(data) + 'salt').toString()
// };

// var newHash = SHA256(JSON.stringify(token.data) + 'salt').toString();

// if (newHash === token.hash) {
//     console.log("Good");
// } else {
//     console.log("bad token");
// }