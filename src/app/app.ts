import { Component, OnInit, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, CommonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class AppComponent implements OnInit {
  title = 'Liberté IYAC - Journal';
  showScrollButton = false;
  currentYear = new Date().getFullYear();

  ngOnInit() {
    // Initialisation
  }

  @HostListener('window:scroll')
  onScroll() {
    this.showScrollButton = window.scrollY > 300;
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  openNewsletterModal() {
    // Fonction pour ouvrir la modal newsletter
    console.log('Ouvrir modal newsletter');
  }
}
