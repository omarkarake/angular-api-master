// src/component/button/navigation.component.spec.ts

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavigationComponent } from './navigation.component';
import { Router, NavigationEnd } from '@angular/router';
import { of, Subject } from 'rxjs';
import { ApiClientService } from '../../services/api-client.service';
import { By } from '@angular/platform-browser';

describe('NavigationComponent', () => {
  let component: NavigationComponent;
  let fixture: ComponentFixture<NavigationComponent>;
  let router: Router;
  let apiClientService: ApiClientService;
  let routerEventsSubject: Subject<any>;

  beforeEach(async () => {
    routerEventsSubject = new Subject();

    const routerMock = {
      events: routerEventsSubject.asObservable(),
      navigate: jest.fn(),
    };

    const apiClientServiceMock = {
      openModal: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [NavigationComponent],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: ApiClientService, useValue: apiClientServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NavigationComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    apiClientService = TestBed.inject(ApiClientService);
    fixture.detectChanges();
  });

  it('should create the navigation component', () => {
    expect(component).toBeTruthy();
  });

  it('should set activeLink to "home" on /home route', () => {
    routerEventsSubject.next(new NavigationEnd(1, '/home', '/home'));
    fixture.detectChanges();
    expect(component.activeLink).toBe('home');
  });

  it('should set activeLink to "single" on /view-post route', () => {
    routerEventsSubject.next(new NavigationEnd(1, '/view-post', '/view-post'));
    fixture.detectChanges();
    expect(component.activeLink).toBe('single');
  });

  it('should call openModal method of ApiClientService when openModal is invoked', () => {
    component.openModal();
    expect(apiClientService.openModal).toHaveBeenCalled();
  });

  it('should update activeLink when setActiveLink is called', () => {
    component.setActiveLink('about');
    expect(component.activeLink).toBe('about');
  });
});
