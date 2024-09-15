// src/app/services/error-handler.service.spec.ts

import { TestBed } from '@angular/core/testing';
import { ErrorHandlerService } from './error-handler.service';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

describe('ErrorHandlerService', () => {
  let service: ErrorHandlerService;
  let toastrService: ToastrService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ErrorHandlerService,
        {
          provide: ToastrService,
          useValue: {
            error: jest.fn(),
          },
        },
      ],
    });

    service = TestBed.inject(ErrorHandlerService);
    toastrService = TestBed.inject(ToastrService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('handleError', () => {
    it('should handle client-side errors', () => {
      const clientError = new ErrorEvent('Network error', {
        message: 'Client-side error occurred',
      });
      const httpError = new HttpErrorResponse({
        error: clientError,
        status: 0,
        statusText: 'Unknown Error',
      });

      service.handleError(httpError).subscribe({
        error: (error) => {
          expect(error.message).toBe('Error: Client-side error occurred');
        },
      });

      expect(toastrService.error).toHaveBeenCalledWith(
        'Error: Client-side error occurred',
        'Error'
      );
    });

    it('should handle server-side errors', () => {
      const httpError = new HttpErrorResponse({
        error: 'Server-side error',
        status: 500,
        statusText: 'Internal Server Error',
        url: '(unknown url)', // Simulating an unknown URL
      });

      service.handleError(httpError).subscribe({
        error: (error) => {
          expect(error.message).toBe(
            'Error Code: 500\nMessage: Http failure response for (unknown url): 500 Internal Server Error'
          );
        },
      });

      expect(toastrService.error).toHaveBeenCalledWith(
        'Error Code: 500\nMessage: Http failure response for (unknown url): 500 Internal Server Error',
        'Error'
      );
    });

    it('should handle unknown errors', () => {
      const httpError = new HttpErrorResponse({
        error: null,
        status: 0,
        statusText: '',
        url: '(unknown url)', // Add this to simulate an unknown URL case
      });

      service.handleError(httpError).subscribe({
        error: (error) => {
          expect(error.message).toBe(
            'Error Code: 0\nMessage: Http failure response for (unknown url): 0 '
          );
        },
      });

      expect(toastrService.error).toHaveBeenCalledWith(
        'Error Code: 0\nMessage: Http failure response for (unknown url): 0 ',
        'Error'
      );
    });
  });
});
