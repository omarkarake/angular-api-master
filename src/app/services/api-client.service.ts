import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, retry, map } from 'rxjs/operators';
import { Post } from '../models/post.model';

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

  constructor(private http: HttpClient) {}

  // GET: Fetch all posts
  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.API_URL).pipe(
      retry(3), // Retry up to 3 times before failing
      catchError(this.handleError)
    );
  }

  // GET: Fetch a single post by ID
  getPost(id: number): Observable<Post> {
    return this.http
      .get<Post>(`${this.API_URL}/${id}`)
      .pipe(retry(3), catchError(this.handleError));
  }

  // GET: Fetch paginated posts
  getPaginatedPosts(page: number, pageSize: number): Observable<Post[]> {
    return this.getPosts().pipe(
      map((posts) => {
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return posts.slice(startIndex, endIndex);
      })
    );
  }

  // POST: Create a new post
  createPost(post: Post): Observable<Post> {
    return this.http
      .post<Post>(this.API_URL, post, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  // PUT: Update an existing post
  updatePost(id: number, post: Post): Observable<Post> {
    return this.http
      .put<Post>(`${this.API_URL}/${id}`, post, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  // DELETE: Delete a post by ID
  deletePost(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.API_URL}/${id}`, this.httpOptions)
      .pipe(catchError(this.handleError));
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
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
