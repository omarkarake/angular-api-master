// src/app/services/api-client.service.spec.ts

import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ApiClientService } from './api-client.service';
import { ToastrService } from 'ngx-toastr';
import { ErrorHandlerService } from './error-handler.service';
import { Post } from '../models/post.model';
import { Comment } from '../models/comment.model';
import { environment } from '../../environments/environment';
import { of, throwError } from 'rxjs';

describe('ApiClientService', () => {
  let service: ApiClientService;
  let httpMock: HttpTestingController;
  let toastrService: ToastrService;
  let errorHandler: ErrorHandlerService;

  // Mock data for Posts and Comments using the provided interfaces
  const mockPosts: Post[] = [
    { userId: 1, id: 1, title: 'Post 1', body: 'Post body 1' },
    { userId: 1, id: 2, title: 'Post 2', body: 'Post body 2' },
  ];

  const mockComments: Comment[] = [
    {
      postId: 1,
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      body: 'Great post!',
    },
    {
      postId: 1,
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      body: 'Very informative.',
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ApiClientService,
        ErrorHandlerService,
        {
          provide: ToastrService,
          useValue: {
            success: jest.fn(),
            error: jest.fn(),
          },
        },
      ],
    });

    service = TestBed.inject(ApiClientService);
    httpMock = TestBed.inject(HttpTestingController);
    toastrService = TestBed.inject(ToastrService);
    errorHandler = TestBed.inject(ErrorHandlerService);
  });

  afterEach(() => {
    httpMock.verify(); // Verifies that no unmatched requests are outstanding
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#getPosts', () => {
    it('should fetch posts and cache them', () => {
      service.getPosts().subscribe((posts) => {
        expect(posts).toEqual(mockPosts);
      });

      const req = httpMock.expectOne(environment.apiUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockPosts);

      // Test caching functionality
      const cachedPosts = service['getCachedResponse'](environment.apiUrl);
      expect(cachedPosts).toEqual(mockPosts);
    });

    it('should return cached posts if available', () => {
      service['setCache'](environment.apiUrl, mockPosts);

      service.getPosts().subscribe((posts) => {
        expect(posts).toEqual(mockPosts);
      });

      // No HTTP request should be made if the data is cached
      httpMock.expectNone(environment.apiUrl);
    });

    it('should handle errors and call ErrorHandlerService', () => {
      jest.spyOn(errorHandler, 'handleError').mockReturnValue(throwError(() => new Error('Error occurred')));

      service.getPosts().subscribe({
        error: (error) => {
          expect(error.message).toBe('Error occurred');
        },
      });

      const req = httpMock.expectOne(environment.apiUrl);
      req.flush('Error occurred', { status: 500, statusText: 'Server Error' });

      expect(errorHandler.handleError).toHaveBeenCalled();
    });
  });

  describe('#getPost', () => {
    it('should fetch a single post by ID and cache it', () => {
      const postId = 1;
      const mockPost = mockPosts[0];

      service.getPost(postId).subscribe((post) => {
        expect(post).toEqual(mockPost);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/${postId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockPost);

      // Test caching functionality
      const cachedPost = service['getCachedResponse'](`${environment.apiUrl}/${postId}`);
      expect(cachedPost).toEqual(mockPost);
    });

    it('should return cached post if available', () => {
      const postId = 1;
      const mockPost = mockPosts[0];
      service['setCache'](`${environment.apiUrl}/${postId}`, mockPost);

      service.getPost(postId).subscribe((post) => {
        expect(post).toEqual(mockPost);
      });

      // No HTTP request should be made if the data is cached
      httpMock.expectNone(`${environment.apiUrl}/${postId}`);
    });
  });

  describe('#getComments', () => {
    it('should fetch comments for a post', () => {
      const postId = 1;

      service.getComments(postId).subscribe((comments) => {
        expect(comments).toEqual(mockComments);
      });

      const req = httpMock.expectOne(`${environment.commentsUrl}?postId=${postId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockComments);
    });

    it('should handle empty response as empty array for comments', () => {
      const postId = 1;

      service.getComments(postId).subscribe((comments) => {
        expect(comments).toEqual([]);
      });

      const req = httpMock.expectOne(`${environment.commentsUrl}?postId=${postId}`);
      req.flush(null);
    });
  });

  describe('#createPost', () => {
    it('should create a new post and show a success message', () => {
      const newPost: Post = { userId: 1, id: 3, title: 'Post 3', body: 'Post body 3' };

      service.createPost(newPost).subscribe((post) => {
        expect(post).toEqual(newPost);
      });

      const req = httpMock.expectOne(environment.apiUrl);
      expect(req.request.method).toBe('POST');
      req.flush(newPost);

      expect(toastrService.success).toHaveBeenCalledWith('Post created successfully!');
    });
  });

  describe('#updatePost', () => {
    it('should update a post and show a success message', () => {
      const updatedPost: Post = { userId: 1, id: 1, title: 'Updated Post', body: 'Updated body' };

      service.updatePost(updatedPost.id, updatedPost).subscribe((post) => {
        expect(post).toEqual(updatedPost);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/${updatedPost.id}`);
      expect(req.request.method).toBe('PUT');
      req.flush(updatedPost);

      expect(toastrService.success).toHaveBeenCalledWith('Post updated successfully!');
    });
  });

  describe('#deletePost', () => {
    it('should delete a post and show a success message', () => {
      const postId = 1;

      service.deletePost(postId).subscribe(() => {
        expect(toastrService.success).toHaveBeenCalledWith('Post deleted successfully!');
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/${postId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush({});
    });
  });

  describe('#clearCache', () => {
    it('should clear the cache', () => {
      service['setCache'](environment.apiUrl, mockPosts);
      expect(service['cache'].size).toBeGreaterThan(0);

      service.clearCache();
      expect(service['cache'].size).toBe(0);
    });
  });
});
