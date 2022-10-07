# Everything you need to know about JWT in 10 Minutes

This is a back to basics recap. I tend to forget all the things I learned after a while. And then, months later I
scratch my head and wonder: what was JWT all about again?

To summarize: JWT stands for JSON Web Token. You can debug or view JWT easily on https://jwt.io
One of the most common forms is using it in http headers as `Authorization: Bearer MI...`.

It is used for the authentication of users or clients. Secure communication is its goal. It is using cryptographic
methods. It is used within the OAuth 2.0 flow, which is the de-facto web auth standard. There is a unified language
for the methods of the process like sign and verify.

The token itself is just a plain, base64 encoded string. It is neither encrypted nor secure. It has a signature attached anyhow so
that receivers can verify the issuer of the token. Anyone can read the content of the token.

## Why would you need it?
For a very simple web application the Users "live" probably in the database. What if you have
multiple applications that your user need access to? There will be a central service storing user data and handling
the authentication. How does it transmit the information

## How does the auth flow work?
Someone issues a token and this someone is the Auth Server. This process is called SIGN. It therefore uses a private key from a
X509 certificate. This is asymmetric encryption with public and private key.

The Auth Server needs to know the user, identify them and hand out a short-lived token to the user.
Now the user authenticate their http calls with given token in the
Authorization header. To add some confusion, the header is called Authorization but first authenticates the user.

Now the web server gets the request. It decodes the token. The server uses a public key to VERIFY the signature of the JWT.

## Sign and verify from scratch with Typescript
You first generate a self signed certificate and its private key:
Use option `-nodes` (no des) to generate private key without passphrase
Use `-subj '/CN=localhost'` to suppress questions
```
mkdir cert && cd cert
openssl req -x509 -newkey rsa:4096 -keyout private-key.pem -out cert.pem -days 365 -nodes -subj '/CN=localhost'
openssl rsa -in private-key.pem -pubout -out public-key.pem
cd ../
```
This is not strictly necessary. You could use a simple "secret" here, which is a string. However, this will not be
sufficient if your Auth server is different from your application server. For the sake of this tutorial both methods
happen on the same script. Just keep in mind that this does not have to be the case.

Now you can sign token. You can have a private key with (first option) or without passphrase (second option)
```
const token = jwt.sign(payload, {key: privateKey, passphrase: 'my-passphrase'}, { algorithm: 'RS256', expiresIn: "1ms"})
const token = jwt.sign(payload, privateKey, { algorithm: 'RS256', expiresIn: "1ms"})
```

Verifying the token is simple
```
const verify = jwt.verify(token, publicKey,{ignoreExpiration: true});
```

Run the code `npm run dev`. 

## Conclusion
Sign and verify are two seperated processes. The certificate and private should never ever be exposed to the public.
The public key in contrast is available to anyone who receives potentially token. In applications like Keycloak the
public key for a realm is exposed on a json endpoint.
