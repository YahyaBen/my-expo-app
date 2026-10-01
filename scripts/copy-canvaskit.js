const fs = require('node:fs');
const path = require('node:path');

const source = require.resolve('canvaskit-wasm/bin/full/canvaskit.wasm', {
  paths: [require.resolve('@shopify/react-native-skia')],
});
const destination = path.join(__dirname, '..', 'public', 'canvaskit.wasm');

fs.mkdirSync(path.dirname(destination), { recursive: true });
fs.copyFileSync(source, destination);
