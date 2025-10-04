import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type ThemeMode = 'light' | 'dark' | 'auto';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'liberteiyac-theme';
  private readonly THEME_MODE_KEY = 'liberteiyac-theme-mode';
  
  private currentThemeSubject = new BehaviorSubject<'light' | 'dark'>('light');
  private currentModeSubject = new BehaviorSubject<ThemeMode>('auto');
  
  public currentTheme$ = this.currentThemeSubject.asObservable();
  public currentMode$ = this.currentModeSubject.asObservable();

  constructor() {
    this.initializeTheme();
  }

  private initializeTheme(): void {
    // Charger le mode sauvegardé
    const savedMode = localStorage.getItem(this.THEME_MODE_KEY) as ThemeMode || 'auto';
    this.currentModeSubject.next(savedMode);
    
    // Déterminer le thème actuel
    const actualTheme = this.determineActualTheme(savedMode);
    this.currentThemeSubject.next(actualTheme);
    
    // Appliquer le thème
    this.applyTheme(actualTheme);
    
    // Écouter les changements de préférence système
    if (savedMode === 'auto') {
      this.listenToSystemThemeChanges();
    }
  }

  private determineActualTheme(mode: ThemeMode): 'light' | 'dark' {
    switch (mode) {
      case 'light':
        return 'light';
      case 'dark':
        return 'dark';
      case 'auto':
      default:
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
  }

  private listenToSystemThemeChanges(): void {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', (e) => {
      if (this.currentModeSubject.value === 'auto') {
        const newTheme = e.matches ? 'dark' : 'light';
        this.currentThemeSubject.next(newTheme);
        this.applyTheme(newTheme);
      }
    });
  }

  public setThemeMode(mode: ThemeMode): void {
    this.currentModeSubject.next(mode);
    localStorage.setItem(this.THEME_MODE_KEY, mode);
    
    const actualTheme = this.determineActualTheme(mode);
    this.currentThemeSubject.next(actualTheme);
    this.applyTheme(actualTheme);
    
    // Réinitialiser l'écoute des changements système
    if (mode === 'auto') {
      this.listenToSystemThemeChanges();
    }
  }

  public toggleTheme(): void {
    const currentMode = this.currentModeSubject.value;
    const currentTheme = this.currentThemeSubject.value;
    
    if (currentMode === 'auto') {
      // Si en mode auto, basculer vers le mode opposé au système
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      const newMode = systemTheme === 'light' ? 'dark' : 'light';
      this.setThemeMode(newMode);
    } else {
      // Si en mode manuel, basculer entre light et dark
      const newMode = currentTheme === 'light' ? 'dark' : 'light';
      this.setThemeMode(newMode);
    }
  }

  private applyTheme(theme: 'light' | 'dark'): void {
    const body = document.body;
    const html = document.documentElement;
    
    // Supprimer les classes existantes
    body.classList.remove('light-theme', 'dark-theme');
    html.classList.remove('light-theme', 'dark-theme');
    
    // Ajouter la nouvelle classe
    body.classList.add(`${theme}-theme`);
    html.classList.add(`${theme}-theme`);
    
    // Mettre à jour les variables CSS personnalisées
    this.updateCSSVariables(theme);
  }

  private updateCSSVariables(theme: 'light' | 'dark'): void {
    const root = document.documentElement;
    
    if (theme === 'dark') {
      // Variables pour le mode sombre
      root.style.setProperty('--bg-primary', '#0f172a');
      root.style.setProperty('--bg-secondary', '#1e293b');
      root.style.setProperty('--bg-tertiary', '#334155');
      root.style.setProperty('--bg-accent', '#1e293b');
      
      root.style.setProperty('--text-dark', '#f8fafc');
      root.style.setProperty('--text-medium', '#e2e8f0');
      root.style.setProperty('--text-light', '#cbd5e1');
      root.style.setProperty('--text-muted', '#94a3b8');
      root.style.setProperty('--text-subtle', '#64748b');
      
      root.style.setProperty('--border-color', '#334155');
      root.style.setProperty('--border-light', '#475569');
      root.style.setProperty('--border-accent', '#64748b');
      
      // Ombres adaptées au mode sombre
      root.style.setProperty('--shadow-sm', '0 1px 2px 0 rgb(0 0 0 / 0.3)');
      root.style.setProperty('--shadow-md', '0 4px 6px -1px rgb(0 0 0 / 0.4), 0 2px 4px -2px rgb(0 0 0 / 0.4)');
      root.style.setProperty('--shadow-lg', '0 10px 15px -3px rgb(0 0 0 / 0.4), 0 4px 6px -4px rgb(0 0 0 / 0.4)');
      root.style.setProperty('--shadow-xl', '0 20px 25px -5px rgb(0 0 0 / 0.4), 0 8px 10px -6px rgb(0 0 0 / 0.4)');
      root.style.setProperty('--shadow-2xl', '0 25px 50px -12px rgb(0 0 0 / 0.5)');
    } else {
      // Variables pour le mode clair
      root.style.setProperty('--bg-primary', '#ffffff');
      root.style.setProperty('--bg-secondary', '#f8fafc');
      root.style.setProperty('--bg-tertiary', '#f1f5f9');
      root.style.setProperty('--bg-accent', '#f0f9ff');
      
      root.style.setProperty('--text-dark', '#0f172a');
      root.style.setProperty('--text-medium', '#334155');
      root.style.setProperty('--text-light', '#64748b');
      root.style.setProperty('--text-muted', '#94a3b8');
      root.style.setProperty('--text-subtle', '#cbd5e1');
      
      root.style.setProperty('--border-color', '#e2e8f0');
      root.style.setProperty('--border-light', '#f1f5f9');
      root.style.setProperty('--border-accent', '#cbd5e1');
      
      // Ombres pour le mode clair
      root.style.setProperty('--shadow-sm', '0 1px 2px 0 rgb(0 0 0 / 0.05)');
      root.style.setProperty('--shadow-md', '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)');
      root.style.setProperty('--shadow-lg', '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)');
      root.style.setProperty('--shadow-xl', '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)');
      root.style.setProperty('--shadow-2xl', '0 25px 50px -12px rgb(0 0 0 / 0.25)');
    }
  }

  public getCurrentTheme(): 'light' | 'dark' {
    return this.currentThemeSubject.value;
  }

  public getCurrentMode(): ThemeMode {
    return this.currentModeSubject.value;
  }

  public isDarkMode(): boolean {
    return this.getCurrentTheme() === 'dark';
  }

  public isLightMode(): boolean {
    return this.getCurrentTheme() === 'light';
  }

  public isAutoMode(): boolean {
    return this.getCurrentMode() === 'auto';
  }
}
