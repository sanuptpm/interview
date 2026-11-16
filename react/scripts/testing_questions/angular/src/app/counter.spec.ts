import { TestBed } from '@angular/core/testing'
import { Counter } from './counter'

describe('Counter', () => {
  it('increments when the button is clicked', async () => {
    const fixture = TestBed.createComponent(Counter)
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button')

    button.click()
    button.click()
    await fixture.whenStable()

    expect(button.textContent).toBe('Count: 2')
  })
})
