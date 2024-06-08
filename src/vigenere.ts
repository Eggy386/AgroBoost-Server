export function encryptVigenere({text, key}: {text: string, key: string}): string {
    let result = '';
    const keyLength = key.length; // Longitud de la clave
    for (let i = 0; i < text.length; i++) {
        const char = text.charAt(i); // Carácter actual del texto
        const keyChar = key.charAt(i % keyLength); // Carácter correspondiente en la clave (cíclico)
        const charCode = char.charCodeAt(0); // Código ASCII del carácter actual
        const keyCharCode = keyChar.charCodeAt(0); // Código ASCII del carácter en la clave
        let encryptedCharCode; // Código ASCII del carácter cifrado

        if ((char >= 'A' && char <= 'Z') || (char >= 'a' && char <= 'z')) { // Si es una letra
            const baseCharCode = char >= 'a' && char <= 'z' ? 97 : 65; // Obtener el código ASCII base (mayúscula o minúscula)
            encryptedCharCode = ((charCode - baseCharCode + (keyCharCode - 65)) % 26) + baseCharCode; // Aplicar cifrado Vigenère
        } else if (char >= '0' && char <= '9') { // Si es un número
            encryptedCharCode = ((charCode - 48 + (keyCharCode - 65)) % 10) + 48; // Aplicar cifrado Vigenère a los números
        } else { // Si es un símbolo especial
            // Deja los caracteres especiales sin cifrar
            encryptedCharCode = charCode;
        }

        result += String.fromCharCode(encryptedCharCode); // Agregar el carácter cifrado al resultado
    }
    return result; // Devolver el texto cifrado
}

export function decryptVigenere({text, key}: {text: string, key: string}): string {
    let result = '';
    const keyLength = key.length; // Longitud de la clave
    for (let i = 0; i < text.length; i++) {
        const char = text.charAt(i); // Carácter actual del texto cifrado
        const keyChar = key.charAt(i % keyLength); // Carácter correspondiente en la clave (cíclico)
        const charCode = char.charCodeAt(0); // Código ASCII del carácter actual cifrado
        const keyCharCode = keyChar.charCodeAt(0); // Código ASCII del carácter en la clave
        let decryptedCharCode; // Código ASCII del carácter descifrado

        if ((char >= 'A' && char <= 'Z') || (char >= 'a' && char <= 'z')) { // Si es una letra
            const baseCharCode = char >= 'a' && char <= 'z' ? 97 : 65; // Obtener el código ASCII base (mayúscula o minúscula)
            decryptedCharCode = ((charCode - baseCharCode - (keyCharCode - 65) + 26) % 26) + baseCharCode; // Aplicar descifrado Vigenère
        } else if (char >= '0' && char <= '9') { // Si es un número
            decryptedCharCode = ((charCode - 48 - (keyCharCode - 65)) % 10); // Aplicar descifrado Vigenère a los números
            if (decryptedCharCode < 0) {
                decryptedCharCode += 10; // Asegurar que el resultado sea positivo para los números
            }
            decryptedCharCode += 48; // Ajuste para obtener el código ASCII correcto del número
        } else {
            // Símbolos especiales (no se modifican)
            decryptedCharCode = charCode;
        }

        result += String.fromCharCode(decryptedCharCode); // Agregar el carácter descifrado al resultado
    }
    return result; // Devolver el texto descifrado
}
