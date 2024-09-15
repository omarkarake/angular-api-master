import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InputsComponent } from './inputs.component';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { By } from '@angular/platform-browser';

describe('InputsComponent', () => {
  let component: InputsComponent;
  let fixture: ComponentFixture<InputsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InputsComponent],
      imports: [ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(InputsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the inputs component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the default placeholder', () => {
    component.placeholder = 'Enter text';
    fixture.detectChanges();
    const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
    expect(inputElement.getAttribute('placeholder')).toBe('Enter text');
  });

  it('should bind the form control to the input', () => {
    component.control = new FormControl('Initial value');
    fixture.detectChanges();
    const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
    expect(inputElement.value).toBe('Initial value');

    // Change the value in the form control and verify the change in the input element
    component.control.setValue('New value');
    fixture.detectChanges();
    expect(inputElement.value).toBe('New value');
  });

  it('should update the form control when the input value changes', () => {
    const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
    inputElement.value = 'Updated value';
    inputElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(component.control.value).toBe('Updated value');
  });
});
