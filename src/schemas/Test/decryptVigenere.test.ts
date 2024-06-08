import { decryptVigenere } from '../../vigenere';

test('Decrypts text using Vigenere cipher', () => {
  // Prueba 1: Texto y clave válidos
  expect(decryptVigenere({ text: 'RIJVS', key: 'KEY' })).toBe('HELLO');

  // Prueba 2: Texto con caracteres no alfabéticos
  expect(decryptVigenere({ text: 'pgjgxcfv241', key: 'AGROBOOST' })).toBe('password345');

  // Prueba 3: Texto con caracteres especiales
  expect(decryptVigenere({ text: 'Rijvs!Rsukvciss?', key: 'KEY' })).toBe('Hello!Howareyou?');
});
