import { TestBed } from '@angular/core/testing'
import { SearchService } from './search'

describe('SearchService (debounce)', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('searches once, 300 ms after the last keystroke', () => {
    const search = TestBed.inject(SearchService)
    search.type('a')
    search.type('an')
    search.type('ang')
    vi.advanceTimersByTime(299)
    expect(search.searches()).toEqual([])        // still typing

    vi.advanceTimersByTime(1)
    expect(search.searches()).toEqual(['ang'])   // only the last value
  })
})
