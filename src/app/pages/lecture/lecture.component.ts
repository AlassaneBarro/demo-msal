import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-lecture',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container">
      <div class="card">
        <div class="icon">📖</div>
        <h1>Page Lecture</h1>
        <p class="description">
          Cette page est accessible aux utilisateurs avec le rôle <strong>Reader</strong> ou <strong>Writer</strong>.
        </p>
        
        <div class="content">
          <h3>Contenu en lecture seule</h3>
          <ul>
            <li>📄 Document 1 - Rapport mensuel</li>
            <li>📄 Document 2 - Statistiques</li>
            <li>📄 Document 3 - Guide utilisateur</li>
          </ul>
        </div>

        <a routerLink="/" class="btn btn-secondary">← Retour à l'accueil</a>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 600px;
      margin: 40px auto;
      padding: 20px;
      font-family: 'Segoe UI', Arial, sans-serif;
    }
    .card {
      background: white;
      border-radius: 12px;
      padding: 30px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      text-align: center;
    }
    .icon {
      font-size: 48px;
      margin-bottom: 15px;
    }
    h1 {
      color: #0078d4;
      margin-bottom: 10px;
    }
    .description {
      color: #666;
      margin-bottom: 20px;
    }
    .content {
      background: #f5f5f5;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
      text-align: left;
    }
    .content h3 {
      margin-top: 0;
      color: #333;
    }
    .content ul {
      list-style: none;
      padding: 0;
    }
    .content li {
      padding: 10px;
      border-bottom: 1px solid #ddd;
    }
    .content li:last-child {
      border-bottom: none;
    }
    .btn {
      display: inline-block;
      text-decoration: none;
      border: none;
      padding: 12px 24px;
      font-size: 14px;
      cursor: pointer;
      border-radius: 6px;
      font-weight: 500;
      transition: all 0.2s;
    }
    .btn-secondary {
      background: #6c757d;
      color: white;
    }
    .btn-secondary:hover {
      background: #545b62;
    }
  `]
})
export class LectureComponent {}