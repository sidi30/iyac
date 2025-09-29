import { Component, OnInit, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BreakingNewsComponent } from '../breaking-news/breaking-news';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule, BreakingNewsComponent],
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class HeaderComponent implements OnInit {
  isMenuOpen = false;
  isDarkMode = false;
  isScrolled = false;

  ngOnInit() {
    // Charger le thème sauvegardé
    this.loadTheme();
    // Appliquer le thème initial
    this.applyTheme();
  }

  @HostListener('window:scroll')
  onScroll() {
    this.isScrolled = window.scrollY > 50;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    this.applyTheme();
    this.saveTheme();
  }

  private loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.isDarkMode = savedTheme === 'dark';
    } else {
      // Utiliser la préférence système
      this.isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
  }

  private saveTheme() {
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
  }

  private applyTheme() {
    const body = document.body;
    if (this.isDarkMode) {
      body.classList.add('dark-theme');
    } else {
      body.classList.remove('dark-theme');
    }
  }

  openNewsletterModal() {
    // Cette fonction sera implémentée pour ouvrir la modal de newsletter
    console.log('Ouvrir modal newsletter');
  }
}
