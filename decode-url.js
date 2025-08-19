// Script para decodificar la URL hexadecimal
const hexUrl = "\\x68747470733a2f2f746c646a62746666796d766d73787970687a696f2e73757061626173652e636f2f73746f726167652f76312f6f626a6563742f7075626c69632f696d616765732f626c6f672d696d616765732f313735353630353731373433362d696a6570753173776561632e706e67";

// Convertir de hex a string
function hexToString(hex) {
  let result = '';
  // Remover \x prefijos y convertir pares hex a caracteres
  const cleanHex = hex.replace(/\\x/g, '');
  for (let i = 0; i < cleanHex.length; i += 2) {
    result += String.fromCharCode(parseInt(cleanHex.substr(i, 2), 16));
  }
  return result;
}

const decodedUrl = hexToString(hexUrl);
console.log('Decoded URL:', decodedUrl);
