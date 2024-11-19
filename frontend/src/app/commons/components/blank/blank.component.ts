import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RoutesModel } from './models/routes.model';

@Component({
  selector: 'app-blank',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './blank.component.html',
  styleUrl: './blank.component.css'
})
export class BlankComponent {
  @Input() title: string = "Blank Page";
  @Input() routes: RoutesModel[] = [];
  @Input() sectionTitle: string = "";
}
