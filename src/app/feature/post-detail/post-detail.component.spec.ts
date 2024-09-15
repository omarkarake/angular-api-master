// src/feature/post-detail-component.spec.ts

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of, Subject } from 'rxjs';
import { ApiClientService } from '../../services/api-client.service';
import { PostDetailResolver } from './post-detail-resolver.service';
import { Post } from '../../models/post.model';
import { Comment } from '../../models/comment.model';
import { PostDetailComponent } from './post-detail.component';

describe('PostDetailComponent', () => {
  let component: PostDetailComponent;
  let fixture: ComponentFixture<PostDetailComponent>;
  let apiClientService: ApiClientService;
  let router: Router;
  let resolver: PostDetailResolver;
  let route: ActivatedRoute;

  const mockPost: Post = { userId: 1, id: 1, title: 'Test Post', body: 'This is a test post' };
  const mockComments: Comment[] = [
    { postId: 1, id: 1, name: 'John Doe', email: 'john@example.com', body: 'Great post!' },
  ];

  beforeEach(async () => {
    const apiClientServiceMock = {
      deletePost: jest.fn().mockReturnValue(of(null)),
      openModal: jest.fn(),
    };

    const routerMock = {
      navigate: jest.fn(),
    };

    const resolverMock = {
      loading$: of(false),
      id: mockPost.id,
      comments: of(mockComments),
    };

    const routeMock = {
      data: of({ post: mockPost }),
    };

    await TestBed.configureTestingModule({
      declarations: [PostDetailComponent],
      providers: [
        { provide: ApiClientService, useValue: apiClientServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: PostDetailResolver, useValue: resolverMock },
        { provide: ActivatedRoute, useValue: routeMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PostDetailComponent);
    component = fixture.componentInstance;
    apiClientService = TestBed.inject(ApiClientService);
    router = TestBed.inject(Router);
    resolver = TestBed.inject(PostDetailResolver);
    route = TestBed.inject(ActivatedRoute);
    fixture.detectChanges();
  });

  it('should create the post detail component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize post data from resolver', () => {
    expect(component.post).toEqual(mockPost);
  });

  it('should update isLoading state from resolver', () => {
    expect(component.isLoading).toBe(false);
  });

  it('should set comments observable from resolver', (done) => {
    component.comments?.subscribe((comments) => {
      expect(comments).toEqual(mockComments);
      done();
    });
  });

  it('should call deletePost on ApiClientService and navigate to home on delete', () => {
    component.deletePost(mockPost.id);
    expect(apiClientService.deletePost).toHaveBeenCalledWith(mockPost.id);
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should call openModal on ApiClientService when openModal is called', () => {
    component.openModal(mockPost);
    expect(apiClientService.openModal).toHaveBeenCalledWith(mockPost);
  });
});
