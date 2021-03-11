import { obfuscate, deobfuscate } from '../RawParser'

describe('obfuscate', () => {
  it('obfuscates', () => {
    const input = '[T44C   |G   |C   |G   Z';
    const output = '1r34LbKcu7[T44CXyQ|GXyQ|CXyQ|GXyQZ';

    expect(obfuscate(input)).toEqual(output);
  })
});

describe('deobfuscate', () => {
  it('deobfuscates', () => {
    const input = '1r34LbKcu7[T44CXyQ|GXyQ|CXyQ|GXyQZ';
    const output = '[T44C   |G   |C   |G   Z';

    expect(deobfuscate(input)).toEqual(output);
  })
});