import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { ApiClientService } from '../../../services/api-client.service';
import { PostDetailResolver } from '../../../feature/post-detail/post-detail-resolver.service';
import { of, Subject } from 'rxjs';
import { Post } from '../../../models/post.model';
import { TruncatePipe } from '../../../../pipe/truncate.pipe';
import { PaginationComponent } from '../../../pagination/pagination/pagination.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let apiClientService: ApiClientService;
  let resolver: PostDetailResolver;

  const mockPosts: Post[] = [
    { userId: 1, id: 1, title: 'Post 1', body: 'Post body 1' },
    { userId: 1, id: 2, title: 'Post 2', body: 'Post body 2' },
  ];

  beforeEach(async () => {
    const apiClientServiceMock = {
      initializePosts: jest.fn(),
      getPaginatedPosts: jest.fn().mockReturnValue(of(mockPosts)),
      loadingPosts$: of(false),
      goToPage: jest.fn(),
      deletePost: jest.fn().mockReturnValue(of(null)),
    };

    const resolverMock = {
      loading$: of(false),
      id: 1,
    };

    await TestBed.configureTestingModule({
      declarations: [HomeComponent, TruncatePipe, PaginationComponent],
      providers: [
        { provide: ApiClientService, useValue: apiClientServiceMock },
        { provide: PostDetailResolver, useValue: resolverMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    apiClientService = TestBed.inject(ApiClientService);
    resolver = TestBed.inject(PostDetailResolver);
    fixture.detectChanges();
  });

  it('should create the home component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize posts on ngOnInit', () => {
    expect(apiClientService.initializePosts).toHaveBeenCalled();
  });

  it('should set paginated posts and calculate total pages', () => {
    expect(component.paginatedPosts).toEqual(mockPosts);
    expect(component.totalPages).toBe(20); // Assuming pageSize is 5 and total items are 100
  });

  it('should update isLoading and loadingPostId from resolver', () => {
    expect(component.isLoading).toBe(false);
    expect(component.loadingPostId).toBe(1);
  });

  it('should call goToPage on page change', () => {
    component.onPageChange(2);
    expect(component.currentPage).toBe(2);
    expect(apiClientService.goToPage).toHaveBeenCalledWith(2);
  });

  it('should delete a post and update the paginated posts', () => {
    component.deletePost(1);
    expect(apiClientService.deletePost).toHaveBeenCalledWith(1);
    expect(component.paginatedPosts.length).toBe(1); // One post removed
    expect(component.paginatedPosts).not.toContain(mockPosts[0]);
    expect(component.deletingPostId).toBeNull();
  });
});
