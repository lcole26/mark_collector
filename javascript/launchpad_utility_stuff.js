function colorKeys(key, clr) {
  device && device.send([0x90, key, clr]); // note on
}

function colorAll() {
  for (let i = 0; i < 100; i++) {
    colorKeys(i, i);
  }
}


function clearAll() {
  for (let i = 0; i < 100; i++) {
    colorKeys(i, 0);
  }
}