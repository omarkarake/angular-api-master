import { Component, OnInit } from '@angular/core';
import { Post } from '../../models/post.model';
import { ActivatedRoute } from '@angular/router';
import { PostDetailResolver } from './post-detail-resolver.service';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css'], // Corrected 'styleUrl' to 'styleUrls'
})
export class PostDetailComponent implements OnInit {
  post: Post | undefined;
  isLoading: boolean = false;
  id: number | undefined;

  constructor(
    private route: ActivatedRoute,
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
}
