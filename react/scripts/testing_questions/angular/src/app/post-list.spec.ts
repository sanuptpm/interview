import { TestBed } from '@angular/core/testing'
import { of } from 'rxjs'
import { PostList } from './post-list'
import { PostService } from './post.service'

describe('PostList', () => {
  it('renders posts from a mocked PostService', async () => {
    const fakePosts = [
      { id: 1, title: 'sunt aut facere' },
      { id: 2, title: 'qui est esse' },
    ]
    TestBed.configureTestingModule({
      providers: [{ provide: PostService, useValue: { getPosts: () => of(fakePosts) } }],
    })

    const fixture = TestBed.createComponent(PostList)
    await fixture.whenStable()

    const items = fixture.nativeElement.querySelectorAll('li')
    expect(items.length).toBe(2)
    expect(items[0].textContent).toBe('sunt aut facere')
  })
})
