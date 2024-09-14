import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrl: './button.component.css',
})
export class ButtonComponent {
  @Input() text: string = 'Button';
  @Input() type: string = 'button';
  @Input() additionalClasses: string = '';
  @Input() disabled: boolean = false;
}
