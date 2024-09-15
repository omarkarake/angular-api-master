// src/app/pagination/pagination.component.spec.ts

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaginationComponent } from './pagination.component';
import { By } from '@angular/platform-browser';
import { Component, Input, Output, EventEmitter } from '@angular/core';

// Mock app-button component
@Component({
  selector: 'app-button',
  template: '<button [disabled]="disabled">{{ text }}</button>',
})
class MockButtonComponent {
  @Input() text: string = '';
  @Input() additionalClasses: string = '';
  @Input() disabled: boolean = false;
}

describe('PaginationComponent', () => {
  let component: PaginationComponent;
  let fixture: ComponentFixture<PaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaginationComponent, MockButtonComponent], // Include mock component
    }).compileComponents();

    fixture = TestBed.createComponent(PaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the pagination component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct current page and total pages', () => {
    component.currentPage = 2;
    component.totalPages = 5;
    fixture.detectChanges();

    const pageDisplay = fixture.debugElement.query(By.css('span.text-xs'));
    expect(pageDisplay).toBeTruthy();

    const pageDisplayElement = pageDisplay.nativeElement;
    expect(pageDisplayElement.textContent).toContain('Page 2 of 5');
  });

  it('should emit pageChange event when goToPage is called with a valid page number', () => {
    // Correct spy setup on EventEmitter
    jest.spyOn(component.pageChange, 'emit');

    // Call the goToPage method with a valid page number
    component.goToPage(3);

    // Check that emit was called with the correct page number
    expect(component.pageChange.emit).toHaveBeenCalledWith(3);
  });

  it('should not emit pageChange event when goToPage is called with an invalid page number', () => {
    const pageChangeSpy = jest.spyOn(component.pageChange, 'emit');

    component.goToPage(0); // Invalid page number (less than 1)
    expect(pageChangeSpy).not.toHaveBeenCalled();

    component.goToPage(6); // Invalid page number (greater than totalPages)
    expect(pageChangeSpy).not.toHaveBeenCalled();
  });

  it('should disable previous button on the first page', () => {
    component.currentPage = 1;
    fixture.detectChanges();

    // Query the first app-button which corresponds to the 'Previous' button
    const prevButtonDebugElement = fixture.debugElement.queryAll(By.directive(MockButtonComponent))[0];
    const prevButtonInstance = prevButtonDebugElement.componentInstance as MockButtonComponent;
    
    expect(prevButtonInstance.disabled).toBe(true);
  });

  it('should disable next button on the last page', () => {
    component.currentPage = 5;
    component.totalPages = 5;
    fixture.detectChanges();

    // Query the second app-button which corresponds to the 'Next' button
    const nextButtonDebugElement = fixture.debugElement.queryAll(By.directive(MockButtonComponent))[1];
    const nextButtonInstance = nextButtonDebugElement.componentInstance as MockButtonComponent;
    
    expect(nextButtonInstance.disabled).toBe(true);
  });

  it('should enable previous and next buttons on middle pages', () => {
    component.currentPage = 3;
    component.totalPages = 5;
    fixture.detectChanges();

    const prevButtonDebugElement = fixture.debugElement.queryAll(By.directive(MockButtonComponent))[0];
    const prevButtonInstance = prevButtonDebugElement.componentInstance as MockButtonComponent;
    
    const nextButtonDebugElement = fixture.debugElement.queryAll(By.directive(MockButtonComponent))[1];
    const nextButtonInstance = nextButtonDebugElement.componentInstance as MockButtonComponent;

    expect(prevButtonInstance.disabled).toBe(false);
    expect(nextButtonInstance.disabled).toBe(false);
  });
});
