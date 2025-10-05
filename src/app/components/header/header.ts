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
  isScrolled = false;
  
  constructor() {}

  ngOnInit() {
    // Initialisation simple
  }

  @HostListener('window:scroll')
  onScroll() {
    this.isScrolled = window.scrollY > 50;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  openNewsletterModal() {
    // Cette fonction sera implémentée pour ouvrir la modal de newsletter
    console.log('Ouvrir modal newsletter');
  }
}
