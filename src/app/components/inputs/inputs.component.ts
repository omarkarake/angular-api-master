import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-inputs',
  templateUrl: './inputs.component.html',
  styleUrl: './inputs.component.css',
})
export class InputsComponent {
  @Input() placeholder: string = ''; // Placeholder text input
  @Input() control: FormControl = new FormControl(); // FormControl input
}
