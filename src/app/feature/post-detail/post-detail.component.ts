import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from '../../models/post.model';
import { ApiClientService } from '../../services/api-client.service';
import { PostDetailResolver } from './post-detail-resolver.service';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css'],
})
export class PostDetailComponent implements OnInit {
  post: Post | undefined;
  isLoading: boolean = false;
  id: number | undefined;
  deletingPostId: number | null = null; // Track the deleting state for each post

  constructor(
    private route: ActivatedRoute,
    private router: Router, // Inject Router service
    private apiClientService: ApiClientService,
    private resolver: PostDetailResolver
  ) {}

  ngOnInit(): void {
    this.resolver.loading$.subscribe((loading) => {
      this.isLoading = loading;
      this.id = this.resolver.id;
    });
    this.route.data.subscribe((data) => {
      this.post = data['post'];
    });
    console.log(this.post);
  }

  deletePost(postId: number): void {
    this.deletingPostId = postId;
    this.apiClientService.deletePost(postId).subscribe(() => {
      this.deletingPostId = null;
      this.router.navigate(['/home']); // Navigate to home page after successful deletion
    });
  }

  openModal(post: Post | null = null): void {
    this.apiClientService.openModal(post);
  }
}