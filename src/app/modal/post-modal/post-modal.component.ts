import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Post } from '../../models/post.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiClientService } from '../../services/api-client.service';

@Component({
  selector: 'app-post-modal',
  templateUrl: './post-modal.component.html',
  styleUrl: './post-modal.component.css',
})
export class PostModalComponent implements OnInit {
  @Input() post: Post | null = null;
  @Output() closeModal = new EventEmitter<void>();
  postForm: FormGroup;
  isUpdateMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private apiClientService: ApiClientService
  ) {
    this.postForm = this.fb.group({
      title: ['', Validators.required],
      body: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.post) {
      this.isUpdateMode = true;
      this.postForm.patchValue(this.post);
    }
  }

  onSubmit(): void {
    if (this.postForm.valid) {
      if (this.isUpdateMode && this.post) {
        this.apiClientService
          .updatePost(this.post.id, this.postForm.value)
          .subscribe(() => {
            this.closeModal.emit();
          });
      } else {
        this.apiClientService.createPost(this.postForm.value).subscribe(() => {
          this.closeModal.emit();
        });
      }
    }
  }

  onClose(): void {
    this.closeModal.emit();
  }
}
