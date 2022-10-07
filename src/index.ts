import  * as jwt from 'jsonwebtoken';
import * as fs from "fs";

const payload = {username: 'harry', sub: 1}

const privateKey = fs.readFileSync('cert/private-key.pem');
const token = jwt.sign(payload, privateKey, { algorithm: 'RS256', expiresIn: "60s"})
console.log("token", token);

const publicKey = fs.readFileSync('cert/public-key.pem');
const verify = jwt.verify(token, publicKey,{ignoreExpiration: true});
console.log("verify", verify);
