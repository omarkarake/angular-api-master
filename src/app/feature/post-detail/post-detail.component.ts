import { Component, OnInit } from '@angular/core';
import { Post } from '../../models/post.model';
import { ActivatedRoute, Router } from '@angular/router';
import { PostDetailResolver } from './post-detail-resolver.service';
import { ApiClientService } from '../../services/api-client.service';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css'], // Corrected 'styleUrl' to 'styleUrls'
})
export class PostDetailComponent implements OnInit {
  post: Post | undefined;
  isLoading: boolean = false;
  id: number | undefined;
  deletingPostId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private resolver: PostDetailResolver,
    private apiClientService: ApiClientService
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
    this.apiClientService.deletePost(postId).subscribe({
      next: () => {
        this.deletingPostId = null;
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('Error deleting post:', err);
        this.deletingPostId = null;
      },
    });
  }
}
