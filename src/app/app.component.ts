import { Component, OnInit } from '@angular/core';
import { ApiClientService } from './services/api-client.service';
import { Post } from './models/post.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isModalOpen: boolean = false;
  postToUpdate: Post | null = null;

  constructor(private apiClientService: ApiClientService) {}

  ngOnInit(): void {
    this.apiClientService.getModalState().subscribe((isOpen) => {
      this.isModalOpen = isOpen;
      if (isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'auto';
      }
    });

    this.apiClientService.getPostToUpdate().subscribe((post) => {
      this.postToUpdate = post;
    });
  }

  openModal(post: Post | null = null): void {
    this.apiClientService.openModal(post);
  }

  closeModal(): void {
    this.apiClientService.closeModal();
  }
}