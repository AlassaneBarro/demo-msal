import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ecriture',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="container">
      <div class="card">
        <div class="icon">✏️</div>
        <h1>Page Écriture</h1>
        <p class="description">
          Cette page est accessible uniquement aux utilisateurs avec le rôle <strong>Writer</strong>.
        </p>
        
        <div class="content">
          <h3>Créer un nouveau document</h3>
          <form (ngSubmit)="onSubmit()">
            <div class="form-group">
              <label for="title">Titre</label>
              <input 
                type="text" 
                id="title" 
                [(ngModel)]="document.title" 
                name="title"
                placeholder="Entrez le titre du document"
              >
            </div>
            <div class="form-group">
              <label for="content">Contenu</label>
              <textarea 
                id="content" 
                [(ngModel)]="document.content" 
                name="content"
                rows="4"
                placeholder="Entrez le contenu du document"
              ></textarea>
            </div>
            <button type="submit" class="btn btn-success">
              💾 Enregistrer
            </button>
          </form>

          <div *ngIf="saved" class="success-message">
            ✅ Document enregistré avec succès !
          </div>
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
      color: #107c10;
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
    .form-group {
      margin-bottom: 15px;
    }
    .form-group label {
      display: block;
      margin-bottom: 5px;
      font-weight: 500;
      color: #333;
    }
    .form-group input,
    .form-group textarea {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 14px;
      box-sizing: border-box;
    }
    .form-group input:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: #107c10;
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
      margin: 5px;
    }
    .btn-success {
      background: #107c10;
      color: white;
    }
    .btn-success:hover {
      background: #0b5a0b;
    }
    .btn-secondary {
      background: #6c757d;
      color: white;
    }
    .btn-secondary:hover {
      background: #545b62;
    }
    .success-message {
      background: #d4edda;
      color: #155724;
      padding: 15px;
      border-radius: 6px;
      margin-top: 15px;
    }
  `]
})
export class EcritureComponent {
  document = {
    title: '',
    content: ''
  };
  saved = false;

  onSubmit(): void {
    console.log('Document enregistré:', this.document);
    this.saved = true;
    setTimeout(() => {
      this.saved = false;
      this.document = { title: '', content: '' };
    }, 3000);
  }
}