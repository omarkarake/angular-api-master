import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { ApiClientService } from '../../services/api-client.service';
import { Post } from '../../models/post.model';

@Injectable({
  providedIn: 'root',
})
export class PostDetailResolver implements Resolve<Post> {
  constructor(private apiClientService: ApiClientService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Post> {
    const postId = route.paramMap.get('id');
    return this.apiClientService.getPost(+postId!);
  }
}
