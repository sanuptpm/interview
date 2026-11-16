import { ShortenPipe } from './shorten.pipe'

describe('ShortenPipe', () => {
  const pipe = new ShortenPipe()

  it('cuts long text', () => {
    expect(pipe.transform('Hello Angular world', 5)).toBe('Hello...')
  })

  it('keeps short text', () => {
    expect(pipe.transform('Hi')).toBe('Hi')
  })
})
