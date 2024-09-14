import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, retry, tap } from 'rxjs/operators';
import { Post } from '../models/post.model';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class ApiClientService {
  private readonly API_URL = 'https://jsonplaceholder.typicode.com/posts';

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

  constructor(private http: HttpClient, private toastr: ToastrService) {}

  // GET: Fetch all posts
  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.API_URL).pipe(
      retry(3), // Retry up to 3 times before failing
      catchError(this.handleError.bind(this))
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

  // GET: Fetch a single post by ID
  getPost(id: number): Observable<Post> {
    return this.http
      .get<Post>(`${this.API_URL}/${id}`)
      .pipe(retry(3), catchError(this.handleError.bind(this)));
  }

  // POST: Create a new post
  createPost(post: Post): Observable<Post> {
    return this.http
      .post<Post>(this.API_URL, post, this.httpOptions)
      .pipe(
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

  // Error handling
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    this.toastr.error(errorMessage, 'Error');
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}