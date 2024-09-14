import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';
import { ApiClientService } from '../../services/api-client.service';
import { Post } from '../../models/post.model';

@Injectable({
  providedIn: 'root',
})
export class PostDetailResolver implements Resolve<Post> {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();
  id: number | undefined;

  constructor(private apiClientService: ApiClientService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Post> {
    const postId = route.paramMap.get('id');
    this.id = +postId!;
    console.log(this.id, ": in resolver");
    this.loadingSubject.next(true); // Set loading state to true

    return this.apiClientService.getPost(+postId!).pipe(
      tap(() => this.loadingSubject.next(false)), // Set loading state to false on success
      finalize(() => this.loadingSubject.next(false)) // Ensure loading state is false on completion
    );
  }
}
