import { Component, OnInit } from '@angular/core';
import { ApiClientService } from '../../../services/api-client.service';
import { Post } from '../../../models/post.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  paginatedPosts: Post[] = [];
  currentPage = 1;
  totalPages = 1;
  pageSize = 5;

  constructor(private apiClientService: ApiClientService) {}

  ngOnInit(): void {
    this.apiClientService.initializePosts();
    this.apiClientService.getPaginatedPosts().subscribe((posts) => {
      this.paginatedPosts = posts;
      this.totalPages = Math.ceil(100 / this.pageSize); // Replace 100 with the actual total number of posts
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.apiClientService.goToPage(page);
  }
}
