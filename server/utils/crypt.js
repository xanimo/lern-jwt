const crypto = require('node:crypto'),
    base58 = require('bs58');

/*
Store the calculated ciphertext and IV here, so we can decrypt the message later.
*/
let ciphertext;
let iv;

/*
Import an AES secret key from an ArrayBuffer containing the raw bytes.
Takes an ArrayBuffer string containing the bytes, and returns a Promise
that will resolve to a CryptoKey representing the secret key.
*/
async function importSecretKey(rawKey) {
    return await crypto.webcrypto.subtle.importKey(
        "raw",
        rawKey,
        "AES-CBC",
        true,
        ["encrypt", "decrypt"]
    );
}

/*
Get the encoded message, encrypt it and display a representation
of the ciphertext in the "Ciphertext" element.
*/
async function encryptMessage(key, message) {
    let encoded = TextEncoder.prototype["encode"] = message;
    console.log(encoded);

    // The iv must never be reused with a given key.
    iv = Buffer.from(crypto.webcrypto.getRandomValues(new Uint8Array(16)));
    key = await importSecretKey(key);
    ciphertext = await crypto.webcrypto.subtle.encrypt({ name: "AES-CBC", iv }, key, encoded );
    console.log('encrypt iv', iv);
    let buffer = new Uint8Array(ciphertext, 0);
    console.log(`${buffer}...[${ciphertext.byteLength} bytes total]`);
    return iv.toString('hex') + ':' + base58.encode(buffer);
}

/*
Fetch the ciphertext and decrypt it.
Write the decrypted message into the "Decrypted" box.
*/
const decryptMessage = async (key, ciphertext) => {
    console.log('ciphertext', ciphertext);
    console.log('iv', iv);
    const parts = ciphertext.split(':');
    console.log(parts[0]);
    console.log(parts[1]);
    iv = Buffer.from(parts[0], 'hex');
    console.log('iv', iv);
    console.log();
    ciphertext = base58.decode(parts[1]);
    console.log('ciphertext updated:', ciphertext);
    key = await importSecretKey(key);
    console.log('key', key);
    let decrypted = await crypto.webcrypto.subtle.decrypt(
        {
            name: "AES-CBC",
            iv
        },
        key,
        ciphertext
    );
    console.log(decrypted);
    let dec = new TextDecoder();
    return await dec.decode(decrypted);
}

module.exports = {
    encryptMessage,
    decryptMessage
}
