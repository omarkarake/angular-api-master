// src/app/interceptor/auth.interceptor.spec.ts

import { TestBed } from '@angular/core/testing';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthInterceptor } from './auth.interceptor';

describe('AuthInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    httpMock.verify(); // Ensure no outstanding requests remain
  });

  it('should add an Authorization header', () => {
    httpClient.get('/test').subscribe(response => {
      expect(response).toBeTruthy();
    });

    const httpRequest = httpMock.expectOne('/test');

    expect(httpRequest.request.headers.has('Authorization')).toBeTruthy();
    expect(httpRequest.request.headers.get('Authorization')).toBe('Bearer mock-token');
  });

  it('should log the outgoing request and incoming response', () => {
    const consoleSpy = jest.spyOn(console, 'log');

    httpClient.get('/test').subscribe(response => {
      expect(response).toBeTruthy();
    });

    const httpRequest = httpMock.expectOne('/test');
    httpRequest.flush({ data: 'test data' });

    expect(consoleSpy).toHaveBeenCalledWith('Outgoing request:', expect.anything());
    expect(consoleSpy).toHaveBeenCalledWith('Incoming response:', expect.anything());
  });

  it('should log error responses', () => {
    const consoleSpy = jest.spyOn(console, 'error');

    httpClient.get('/test').subscribe({
      next: () => fail('should have failed with the 500 error'),
      error: (error) => {
        expect(error.status).toBe(500);
      },
    });

    const httpRequest = httpMock.expectOne('/test');
    httpRequest.flush('Error', { status: 500, statusText: 'Server Error' });

    expect(consoleSpy).toHaveBeenCalledWith('Error response:', expect.anything());
  });
});
