import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { ArticleDetailComponent } from './pages/article-detail/article-detail';
import { PodcastsComponent } from './pages/podcasts/podcasts';
import { VideosComponent } from './pages/videos/videos';
import { DocumentsComponent } from './pages/documents/documents';
import { ErrorComponent } from './pages/error/error';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'article/:id', component: ArticleDetailComponent },
  { path: 'podcasts', component: PodcastsComponent },
  { path: 'videos', component: VideosComponent },
  { path: 'documents', component: DocumentsComponent },
  { path: 'error', component: ErrorComponent },
  { path: '**', redirectTo: 'error' }
];
