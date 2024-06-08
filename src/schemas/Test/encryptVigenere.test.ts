import { encryptVigenere } from '../../vigenere';

test('Encrypts text using Vigenere cipher', () => {
  // Prueba 1: Texto y clave válidos
  expect(encryptVigenere({ text: 'HELLO', key: 'KEY' })).toBe('RIJVS');

  // Prueba 2: Texto con caracteres no alfabéticos
  expect(encryptVigenere({ text: 'password123', key: 'AGROBOOST' })).toBe('pgjgxcfv241');

  //Prueba 3: Texto con caracteres especiales
  expect(encryptVigenere({ text: 'Hello!Howareyou?', key: 'KEY' })).toBe('Rijvs!Rsukvciss?');
});
