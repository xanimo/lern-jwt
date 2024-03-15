import base58 from 'bs58';

/*
Import an AES secret key from an ArrayBuffer containing the raw bytes.
Takes an ArrayBuffer string containing the bytes, and returns a Promise
that will resolve to a CryptoKey representing the secret key.
*/
async function importSecretKey(rawKey) {
    return await window.crypto.subtle.importKey(
        "raw",
        rawKey,
        "AES-CBC",
        true,
        ["encrypt", "decrypt"]
    );
}

/*
Store the calculated ciphertext and IV here, so we can decrypt the message later.
*/
let ciphertext;
let iv;

async function encryptMessage(key, message) {
    let encoded = TextEncoder.prototype["encode"] = message;
    // The iv must never be reused with a given key.
    iv = Buffer.from(window.crypto.getRandomValues(new Uint8Array(16)));
    key = await importSecretKey(key);
    ciphertext = await window.crypto.subtle.encrypt(
        {
            name: "AES-CBC",
            iv
        },
        key,
        encoded
    );
    let buffer = new Uint8Array(ciphertext, 0);
    console.log(`${buffer}...[${ciphertext.byteLength} bytes total]`);
    return iv.toString('hex') + ':' + base58.encode(buffer);
}

/*
Fetch the ciphertext and decrypt it.
Write the decrypted message into the "Decrypted" box.
*/
async function decryptMessage(key, ciphertext) {
    const parts = ciphertext.split(':');
    iv = Buffer.from(parts[0], 'hex');
    ciphertext = base58.decode(parts[1]);
    key = await importSecretKey(key);
    let decrypted = await window.crypto.subtle.decrypt(
        {
            name: "AES-CBC",
            iv
        },
        key,
        ciphertext
    );

    let dec = new TextDecoder();
    return dec.decode(decrypted);
}

export {
    encryptMessage,
    decryptMessage
}
