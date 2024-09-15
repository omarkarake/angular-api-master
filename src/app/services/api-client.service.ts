// src/app/services/api-client.service.ts

import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, of } from 'rxjs';
import { catchError, finalize, map, retry, tap } from 'rxjs/operators';
import { Post } from '../models/post.model';
import { ToastrService } from 'ngx-toastr';
import { Comment } from '../models/comment.model';
import { ErrorHandlerService } from './error-handler.service';
import { environment } from '../../environments/environment';

interface CacheEntry {
  data: any;
  expiration: number;
}

@Injectable({
  providedIn: 'root',
})
export class ApiClientService {
  // private readonly API_URL = 'https://jsonplaceholder.typicode.com/posts';
  private readonly API_URL = environment.apiUrl;
  // private readonly COMMENTS_URL =
  //   'https://jsonplaceholder.typicode.com/comments';
  private readonly COMMENTS_URL = environment.commentsUrl;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  private postsSubject = new BehaviorSubject<Post[]>([]);
  private paginatedPostsSubject = new BehaviorSubject<Post[]>([]);
  private currentPage = 1;
  private pageSize = 5;
  private modalOpenSubject = new BehaviorSubject<boolean>(false);
  private postToUpdateSubject = new BehaviorSubject<Post | null>(null);
  private loadingPostSubject = new BehaviorSubject<boolean>(false);
  loadingPosts$ = this.loadingPostSubject.asObservable();

  private cache = new Map<string, CacheEntry>();
  private cacheDuration = 300000; // Cache duration in milliseconds (5 minutes)

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private errorHandler: ErrorHandlerService
  ) {}

  // GET: Fetch all posts with caching
  getPosts(): Observable<Post[]> {
    const cacheKey = this.API_URL;
    const cachedResponse = this.getCachedResponse(cacheKey);
    if (cachedResponse) {
      return of(cachedResponse);
    }

    this.loadingPostSubject.next(true);
    return this.http.get<Post[]>(this.API_URL).pipe(
      retry(3), // Retry up to 3 times before failing
      tap((posts) => this.setCache(cacheKey, posts)), // Cache the response
      catchError(this.handleError.bind(this)), // Handle errors
      finalize(() => this.loadingPostSubject.next(false)) // Set loading state to false on success
    );
  }

  // Initialize data fetching
  initializePosts(): void {
    this.getPosts().subscribe(
      (posts) => {
        this.postsSubject.next(posts);
        this.paginatePosts();
      },
      (error) => {
        console.error('Error fetching posts', error);
      }
    );
  }

  // GET: Fetch paginated posts
  getPaginatedPosts(): Observable<Post[]> {
    return this.paginatedPostsSubject.asObservable();
  }

  // Handle pagination logic
  goToPage(page: number): void {
    this.currentPage = page;
    this.paginatePosts();
  }

  private paginatePosts(): void {
    const posts = this.postsSubject.getValue();
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    const paginatedPosts = posts.slice(startIndex, endIndex);
    this.paginatedPostsSubject.next(paginatedPosts);
  }

  // GET: Fetch a single post by ID with caching
  getPost(id: number): Observable<Post> {
    const cacheKey = `${this.API_URL}/${id}`;
    const cachedResponse = this.getCachedResponse(cacheKey);
    if (cachedResponse) {
      return of(cachedResponse);
    }

    return this.http.get<Post>(cacheKey).pipe(
      retry(3), // Retry up to 3 times before failing
      tap((post) => this.setCache(cacheKey, post)), // Cache the response
      catchError(this.handleError.bind(this)) // Handle errors
    );
  }

  // GET: Fetch comments for a post
  getComments(postId: number): Observable<Comment[]> {
    return this.http
      .get<Comment[]>(`${this.COMMENTS_URL}?postId=${postId}`)
      .pipe(
        retry(3), // Retry the request up to 3 times on failure
        map((comments) => (Array.isArray(comments) ? comments : [])), // Emit empty array if response is not an array
        catchError((error) => {
          console.error('Error fetching comments:', error);
          return of([]); // Emit empty array in case of error
        })
      );
  }

  // POST: Create a new post
  createPost(post: Post): Observable<Post> {
    return this.http.post<Post>(this.API_URL, post, this.httpOptions).pipe(
      tap(() => this.toastr.success('Post created successfully!')),
      catchError(this.handleError.bind(this))
    );
  }

  // PUT: Update an existing post
  updatePost(id: number, post: Post): Observable<Post> {
    return this.http
      .put<Post>(`${this.API_URL}/${id}`, post, this.httpOptions)
      .pipe(
        tap(() => this.toastr.success('Post updated successfully!')),
        catchError(this.handleError.bind(this))
      );
  }

  // DELETE: Delete a post by ID
  deletePost(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.API_URL}/${id}`, this.httpOptions)
      .pipe(
        tap(() => this.toastr.success('Post deleted successfully!')),
        catchError(this.handleError.bind(this))
      );
  }

  // Modal state management
  openModal(post: Post | null = null): void {
    this.postToUpdateSubject.next(post);
    this.modalOpenSubject.next(true);
  }

  closeModal(): void {
    this.modalOpenSubject.next(false);
  }

  getModalState(): Observable<boolean> {
    return this.modalOpenSubject.asObservable();
  }

  getPostToUpdate(): Observable<Post | null> {
    return this.postToUpdateSubject.asObservable();
  }

  // Caching helper methods
  private setCache(key: string, data: any): void {
    const expiration = Date.now() + this.cacheDuration;
    this.cache.set(key, { data, expiration });
  }

  private getCachedResponse(key: string): any | null {
    const cached = this.cache.get(key);
    if (cached && cached.expiration > Date.now()) {
      console.log('Returning cached response for:', key);
      return cached.data;
    }
    return null;
  }

  // Method to clear the cache
  clearCache(): void {
    this.cache.clear();
    console.log('Cache cleared');
  }

  // Error handling
  private handleError(error: HttpErrorResponse) {
    return this.errorHandler.handleError(error);
  }
}
