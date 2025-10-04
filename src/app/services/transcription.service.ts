import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface TranscriptionResult {
  text: string;
  confidence: number;
  timestamp: number;
  isFinal: boolean;
}

export interface TranscriptionState {
  isListening: boolean;
  isSupported: boolean;
  language: string;
  results: TranscriptionResult[];
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TranscriptionService {
  private recognition: any;
  private transcriptionStateSubject = new BehaviorSubject<TranscriptionState>({
    isListening: false,
    isSupported: false,
    language: 'fr-FR',
    results: []
  });

  constructor() {
    this.initializeSpeechRecognition();
  }

  private initializeSpeechRecognition(): void {
    // Vérifier si l'API est supportée
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      this.transcriptionStateSubject.next({
        ...this.transcriptionStateSubject.value,
        isSupported: false,
        error: 'Speech Recognition API non supportée par ce navigateur'
      });
      return;
    }

    // Initialiser la reconnaissance vocale
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();

    // Configuration
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'fr-FR';
    this.recognition.maxAlternatives = 1;

    // Événements
    this.recognition.onstart = () => {
      this.transcriptionStateSubject.next({
        ...this.transcriptionStateSubject.value,
        isListening: true,
        error: undefined
      });
    };

    this.recognition.onresult = (event: any) => {
      const results = Array.from(event.results).map((result: any) => ({
        text: result[0].transcript,
        confidence: result[0].confidence,
        timestamp: Date.now(),
        isFinal: result.isFinal
      }));

      this.transcriptionStateSubject.next({
        ...this.transcriptionStateSubject.value,
        results: results
      });
    };

    this.recognition.onerror = (event: any) => {
      this.transcriptionStateSubject.next({
        ...this.transcriptionStateSubject.value,
        isListening: false,
        error: `Erreur de reconnaissance: ${event.error}`
      });
    };

    this.recognition.onend = () => {
      this.transcriptionStateSubject.next({
        ...this.transcriptionStateSubject.value,
        isListening: false
      });
    };

    this.transcriptionStateSubject.next({
      ...this.transcriptionStateSubject.value,
      isSupported: true
    });
  }

  // Démarrer la transcription
  startTranscription(language: string = 'fr-FR'): void {
    if (!this.recognition || !this.transcriptionStateSubject.value.isSupported) {
      return;
    }

    this.recognition.lang = language;
    this.recognition.start();
  }

  // Arrêter la transcription
  stopTranscription(): void {
    if (this.recognition) {
      this.recognition.stop();
    }
  }

  // Obtenir l'état de la transcription
  getTranscriptionState(): Observable<TranscriptionState> {
    return this.transcriptionStateSubject.asObservable();
  }

  // Obtenir le texte final de la transcription
  getFinalTranscription(): string {
    const state = this.transcriptionStateSubject.value;
    return state.results
      .filter(result => result.isFinal)
      .map(result => result.text)
      .join(' ');
  }

  // Obtenir le texte en cours (interim)
  getInterimTranscription(): string {
    const state = this.transcriptionStateSubject.value;
    const interimResults = state.results.filter(result => !result.isFinal);
    return interimResults.map(result => result.text).join(' ');
  }

  // Obtenir le texte complet (final + interim)
  getCompleteTranscription(): string {
    const final = this.getFinalTranscription();
    const interim = this.getInterimTranscription();
    return final + (interim ? ' ' + interim : '');
  }

  // Réinitialiser la transcription
  resetTranscription(): void {
    this.transcriptionStateSubject.next({
      isListening: false,
      isSupported: this.transcriptionStateSubject.value.isSupported,
      language: 'fr-FR',
      results: [],
      error: undefined
    });
  }

  // Changer la langue
  setLanguage(language: string): void {
    this.transcriptionStateSubject.next({
      ...this.transcriptionStateSubject.value,
      language: language
    });
  }

  // Obtenir les langues supportées
  getSupportedLanguages(): string[] {
    return [
      'fr-FR', // Français
      'en-US', // Anglais américain
      'en-GB', // Anglais britannique
      'es-ES', // Espagnol
      'de-DE', // Allemand
      'it-IT', // Italien
      'pt-PT', // Portugais
      'ar-SA', // Arabe
      'zh-CN', // Chinois
      'ja-JP', // Japonais
      'ko-KR', // Coréen
      'ru-RU', // Russe
      'hi-IN', // Hindi
      'th-TH', // Thaï
      'vi-VN', // Vietnamien
      'nl-NL', // Néerlandais
      'sv-SE', // Suédois
      'no-NO', // Norvégien
      'da-DK', // Danois
      'fi-FI', // Finnois
      'pl-PL', // Polonais
      'tr-TR', // Turc
      'he-IL', // Hébreu
      'cs-CZ', // Tchèque
      'sk-SK', // Slovaque
      'hu-HU', // Hongrois
      'ro-RO', // Roumain
      'bg-BG', // Bulgare
      'hr-HR', // Croate
      'sr-RS', // Serbe
      'sl-SI', // Slovène
      'et-EE', // Estonien
      'lv-LV', // Letton
      'lt-LT', // Lituanien
      'uk-UA', // Ukrainien
      'be-BY', // Biélorusse
      'mk-MK', // Macédonien
      'sq-AL', // Albanais
      'mt-MT', // Maltais
      'is-IS', // Islandais
      'ga-IE', // Irlandais
      'cy-GB', // Gallois
      'eu-ES', // Basque
      'ca-ES', // Catalan
      'gl-ES', // Galicien
      'af-ZA', // Afrikaans
      'sw-KE', // Swahili
      'am-ET', // Amharique
      'ha-NG', // Haoussa
      'ig-NG', // Igbo
      'yo-NG', // Yoruba
      'zu-ZA', // Zoulou
      'xh-ZA', // Xhosa
      'st-ZA', // Sotho
      'tn-ZA', // Tswana
      'ss-ZA', // Swati
      'nr-ZA', // Ndebele
      've-ZA', // Venda
      'ts-ZA', // Tsonga
      'nso-ZA' // Pedi
    ];
  }

  // Formater la transcription avec timestamps
  formatTranscriptionWithTimestamps(): string {
    const state = this.transcriptionStateSubject.value;
    const finalResults = state.results.filter(result => result.isFinal);
    
    return finalResults.map((result, index) => {
      const timestamp = this.formatTimestamp(result.timestamp);
      return `[${timestamp}] ${result.text}`;
    }).join('\n');
  }

  private formatTimestamp(timestamp: number): string {
    const date = new Date(timestamp);
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  }

  // Exporter la transcription en format texte
  exportTranscription(format: 'txt' | 'srt' | 'vtt' = 'txt'): string {
    const finalText = this.getFinalTranscription();
    
    switch (format) {
      case 'txt':
        return finalText;
      
      case 'srt':
        return this.generateSRT(finalText);
      
      case 'vtt':
        return this.generateVTT(finalText);
      
      default:
        return finalText;
    }
  }

  private generateSRT(text: string): string {
    // Génération simple de SRT (peut être améliorée)
    const sentences = text.split(/[.!?]+/).filter(s => s.trim());
    let srtContent = '';
    
    sentences.forEach((sentence, index) => {
      const startTime = this.formatSRTTime(index * 3);
      const endTime = this.formatSRTTime((index + 1) * 3);
      
      srtContent += `${index + 1}\n`;
      srtContent += `${startTime} --> ${endTime}\n`;
      srtContent += `${sentence.trim()}\n\n`;
    });
    
    return srtContent;
  }

  private generateVTT(text: string): string {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim());
    let vttContent = 'WEBVTT\n\n';
    
    sentences.forEach((sentence, index) => {
      const startTime = this.formatVTTTime(index * 3);
      const endTime = this.formatVTTTime((index + 1) * 3);
      
      vttContent += `${startTime} --> ${endTime}\n`;
      vttContent += `${sentence.trim()}\n\n`;
    });
    
    return vttContent;
  }

  private formatSRTTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')},000`;
  }

  private formatVTTTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.000`;
  }
}
