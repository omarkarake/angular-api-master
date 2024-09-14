import { Component, OnInit } from '@angular/core';
import { Post } from '../../models/post.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css'], // Corrected 'styleUrl' to 'styleUrls'
})
export class PostDetailComponent implements OnInit {
  post: Post | undefined;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.post = data['post'];
    });
    console.log(this.post);
  }
}
