// src/truncate.pipe.spec.ts

import { TruncatePipe } from './truncate.pipe';

describe('TruncatePipe', () => {
  let pipe: TruncatePipe;

  beforeEach(() => {
    pipe = new TruncatePipe();
  });

  it('should create an instance of TruncatePipe', () => {
    expect(pipe).toBeTruthy();
  });

  it('should truncate text longer than the limit and append the default trail', () => {
    const longText = 'This is a very long string that needs to be truncated because it exceeds the limit.';
    const result = pipe.transform(longText, 20);
    expect(result).toBe('This is a very long ...');
  });

  it('should truncate text and append a custom trail', () => {
    const longText = 'Another example of a long string that needs truncation.';
    const result = pipe.transform(longText, 25, ' >>>');
    expect(result).toBe('Another example of a long s >>>');
  });

  it('should not truncate text shorter than the limit', () => {
    const shortText = 'Short text';
    const result = pipe.transform(shortText, 20);
    expect(result).toBe('Short text');
  });

  it('should handle empty strings', () => {
    const emptyText = '';
    const result = pipe.transform(emptyText, 20);
    expect(result).toBe('');
  });

  it('should handle limit of zero', () => {
    const text = 'Some text';
    const result = pipe.transform(text, 0);
    expect(result).toBe('...');
  });

  it('should handle non-string inputs gracefully', () => {
    const result = pipe.transform(123 as any, 10); // Type assertion to bypass type check for testing
    expect(result).toBe('123'); // The updated implementation will convert non-string input to a string
  });
});
