import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ValidDirective } from '../../directives/valid.directive';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, ValidDirective],
  templateUrl: './input.component.html',
  styleUrl: './input.component.css'
})
export class InputComponent {
  title: string = "";
  validMessage: string = "";
  id: string = "";
  hashtag: string = "#section"
}
