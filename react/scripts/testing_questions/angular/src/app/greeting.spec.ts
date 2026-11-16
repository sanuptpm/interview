import { TestBed } from '@angular/core/testing'
import { Greeting } from './greeting'

describe('Greeting', () => {
  it('shows the name input and emits liked', async () => {
    const fixture = TestBed.createComponent(Greeting)
    fixture.componentRef.setInput('name', 'Ann')
    await fixture.whenStable()

    const likedSpy = vi.fn()
    fixture.componentInstance.liked.subscribe(likedSpy)
    fixture.nativeElement.querySelector('button').click()

    expect(fixture.nativeElement.querySelector('h1').textContent).toBe('Hello Ann')
    expect(likedSpy).toHaveBeenCalledWith('Ann')
  })
})
