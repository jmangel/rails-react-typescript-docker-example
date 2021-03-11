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

  it('deobfuscates more', () => {
    const input = '1r34LbKcu7QyXZL4C, EQyX|D,C|,E ,DB[*  ,C|,B,A,GZL,LZXyQ3TA*{ZLQyXLZXyQZLQyXZLQyXZLQyZXLQyXA*[] QyXZLXyQLZQyXZLXyQLZXyQ Z';
    const output = "{*AT34C, E, |G,A,B,|C,  [*BD, E,|C,D|    |    |    |    |    |    ][*A    |    |    |    |    |    |    |    Z";
    expect(deobfuscate(input)).toEqual(output);
  })
});