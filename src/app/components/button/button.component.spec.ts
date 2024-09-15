// src/component/button/button.component.spec.ts

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonComponent } from './button.component';
import { By } from '@angular/platform-browser';

describe('ButtonComponent', () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the button component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the default text', () => {
    const buttonElement = fixture.debugElement.query(
      By.css('button')
    ).nativeElement;
    expect(buttonElement.textContent.trim()).toBe('Button');
  });

  it('should apply the type attribute', () => {
    component.type = 'submit';
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(
      By.css('button')
    ).nativeElement;
    expect(buttonElement.getAttribute('type')).toBe('submit');
  });

  it('should apply additional classes', () => {
    component.additionalClasses = 'btn-primary';
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(
      By.css('button')
    ).nativeElement;
    expect(buttonElement.classList).toContain('btn-primary');
  });

  it('should disable the button when disabled input is true', () => {
    component.disabled = true;
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(
      By.css('button')
    ).nativeElement;
    expect(buttonElement.disabled).toBe(true);
  });

  it('should reflect the text input correctly', () => {
    component.text = 'Submit';
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(
      By.css('button')
    ).nativeElement;
    expect(buttonElement.textContent.trim()).toBe('Submit');
  });
});
