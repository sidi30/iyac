import { Component, OnInit, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BreakingNewsComponent } from '../breaking-news/breaking-news';
import { ThemeService, ThemeMode } from '../../services/theme.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule, BreakingNewsComponent],
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class HeaderComponent implements OnInit {
  isMenuOpen = false;
  isScrolled = false;
  
  // Observables pour le thème
  currentTheme$: Observable<'light' | 'dark'>;
  currentMode$: Observable<ThemeMode>;
  
  constructor(private themeService: ThemeService) {
    this.currentTheme$ = this.themeService.currentTheme$;
    this.currentMode$ = this.themeService.currentMode$;
  }

  ngOnInit() {
    // Le thème est maintenant géré par le service
  }

  @HostListener('window:scroll')
  onScroll() {
    this.isScrolled = window.scrollY > 50;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  // Méthodes utilitaires pour le template
  isDarkMode(): boolean {
    return this.themeService.isDarkMode();
  }

  isAutoMode(): boolean {
    return this.themeService.isAutoMode();
  }

  getThemeIcon(): string {
    if (this.isAutoMode()) {
      return 'fas fa-adjust';
    }
    return this.isDarkMode() ? 'fas fa-sun' : 'fas fa-moon';
  }

  getThemeTitle(): string {
    if (this.isAutoMode()) {
      return 'Mode automatique';
    }
    return this.isDarkMode() ? 'Mode clair' : 'Mode sombre';
  }

  openNewsletterModal() {
    // Cette fonction sera implémentée pour ouvrir la modal de newsletter
    console.log('Ouvrir modal newsletter');
  }
}
