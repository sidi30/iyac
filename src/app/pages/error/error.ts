import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [],
  templateUrl: './error.html',
  styleUrls: ['./error.scss']
})
export class ErrorComponent implements OnInit {
  countdown = 'Quelques minutes';

  constructor(private router: Router) {}

  ngOnInit() {
    this.startCountdown();
  }

  retry() {
    window.location.reload();
  }

  goHome() {
    this.router.navigate(['/']);
  }

  private startCountdown() {
    let minutes = 5;
    const interval = setInterval(() => {
      if (minutes > 0) {
        this.countdown = `${minutes} minute${minutes > 1 ? 's' : ''}`;
        minutes--;
      } else {
        this.countdown = 'Bientôt disponible';
        clearInterval(interval);
      }
    }, 60000); // Mise à jour chaque minute
  }
}
