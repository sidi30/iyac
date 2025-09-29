import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-leader-showcase',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './leader-showcase.html',
  styleUrls: ['./leader-showcase.scss']
})
export class LeaderShowcaseComponent {
  @Input() showLeaderImages: boolean = true;
}
