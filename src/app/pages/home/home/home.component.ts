import { Component, OnInit } from '@angular/core';
import { ApiClientService } from '../../../services/api-client.service';
import { Post } from '../../../models/post.model';
import { PostDetailResolver } from '../../../feature/post-detail/post-detail-resolver.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'], // Corrected 'styleUrl' to 'styleUrls'
})
export class HomeComponent implements OnInit {
  paginatedPosts: Post[] = [];
  currentPage = 1;
  totalPages = 1;
  pageSize = 5;
  isLoading: boolean = false;
  loadingPostId: number | null = null; // Track the loading state for each post

  constructor(
    private apiClientService: ApiClientService,
    private resolver: PostDetailResolver
  ) {}

  ngOnInit(): void {
    this.apiClientService.initializePosts();
    this.apiClientService.getPaginatedPosts().subscribe((posts) => {
      this.paginatedPosts = posts;
      this.totalPages = Math.ceil(100 / this.pageSize); // Replace 100 with the actual total number of posts
    });

    this.resolver.loading$.subscribe((loading) => {
      this.isLoading = loading;
      this.loadingPostId = this.resolver.id ?? null;
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.apiClientService.goToPage(page);
  }
}
