// src/feature/post-detail-resolver.service.spec.ts

import { TestBed } from '@angular/core/testing';
import { PostDetailResolver } from './post-detail-resolver.service';
import { ApiClientService } from '../../services/api-client.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Post } from '../../models/post.model';
import { Comment } from '../../models/comment.model';

describe('PostDetailResolver', () => {
  let resolver: PostDetailResolver;
  let apiClientService: ApiClientService;

  const mockPost: Post = {
    userId: 1,
    id: 1,
    title: 'Test Post',
    body: 'This is a test post',
  };
  const mockComments: Comment[] = [
    {
      postId: 1,
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      body: 'Great post!',
    },
  ];

  beforeEach(() => {
    const apiClientServiceMock = {
      getPost: jest.fn().mockReturnValue(of(mockPost)),
      getComments: jest.fn().mockReturnValue(of(mockComments)),
    };

    TestBed.configureTestingModule({
      providers: [
        PostDetailResolver,
        { provide: ApiClientService, useValue: apiClientServiceMock },
      ],
    });

    resolver = TestBed.inject(PostDetailResolver);
    apiClientService = TestBed.inject(ApiClientService);
  });

  it('should resolve post data', (done) => {
    const route = new ActivatedRouteSnapshot();
    route.params = { id: '1' };

    resolver.resolve(route, {} as RouterStateSnapshot).subscribe((post) => {
      expect(post).toEqual(mockPost);
      done();
    });

    expect(apiClientService.getPost).toHaveBeenCalledWith(1);
    expect(resolver.comments).toBeDefined();
  });

  it('should handle errors during post fetching', (done) => {
    jest
      .spyOn(apiClientService, 'getPost')
      .mockReturnValue(throwError(() => new Error('Error fetching post')));

    const route = new ActivatedRouteSnapshot();
    route.params = { id: '1' };

    resolver.resolve(route, {} as RouterStateSnapshot).subscribe({
      next: () => fail('Expected an error, but got data'),
      error: (error) => {
        expect(error).toBeTruthy();
        done();
      },
    });
  });
});
