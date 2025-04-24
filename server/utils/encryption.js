const crypto = require("crypto");
require("dotenv").config();

const rawKey = process.env.ENCRYPTION_KEY;
const ENCRYPTION_KEY = crypto.createHash("sha256").update(rawKey).digest(); // Clave de 32 bytes
const IV_LENGTH = 16; // Longitud del IV (vector de inicialización)

const encryptImage = (buffer) => {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY), iv);
    
    let encrypted = cipher.update(buffer);
    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return { iv: iv.toString("hex"), data: encrypted.toString("hex") };
};

const decryptImage = (iv, encryptedData) => {
    const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY), Buffer.from(iv, "hex"));

    let decrypted = decipher.update(Buffer.from(encryptedData, "hex"));
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted;
};
module.exports = { encryptImage, decryptImage };