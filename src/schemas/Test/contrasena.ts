import { encryptVigenere } from "../../vigenere";

const texto = "12345678";
const clave = "AGROBOOST";

const textoCifrado = encryptVigenere({ text: texto, key: clave });
console.log(textoCifrado);