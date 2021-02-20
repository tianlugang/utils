import { Random } from './random';

let uuid4 = (): string => {
  const bytes = new Uint8Array(16);
  const lut = new Array<string>(256);

  for (let i = 0; i < 16; ++i) {
    lut[i] = '0' + i.toString(16);
  }

  for (let i = 16; i < 256; ++i) {
    lut[i] = i.toString(16);
  }

  uuid4 = (): string => {
    Random.getRandomValues(bytes);
    bytes[6] = 0x40 | (bytes[6] & 0x0F);
    bytes[8] = 0x80 | (bytes[8] & 0x3F);

    return (
      lut[bytes[0]] +
      lut[bytes[1]] +
      lut[bytes[2]] +
      lut[bytes[3]] +
      '-' +
      lut[bytes[4]] +
      lut[bytes[5]] +
      '-' +
      lut[bytes[6]] +
      lut[bytes[7]] +
      '-' +
      lut[bytes[8]] +
      lut[bytes[9]] +
      '-' +
      lut[bytes[10]] +
      lut[bytes[11]] +
      lut[bytes[12]] +
      lut[bytes[13]] +
      lut[bytes[14]] +
      lut[bytes[15]]
    );
  }

  return uuid4()
}

export namespace UUID {
  export const v4 = uuid4;
}