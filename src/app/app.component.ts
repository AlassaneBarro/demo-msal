import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { MsalService, MsalBroadcastService, MSAL_GUARD_CONFIG, MsalGuardConfiguration } from '@azure/msal-angular';
import { InteractionStatus, RedirectRequest } from '@azure/msal-browser';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  template: `
    <div class="app-container">
      <header *ngIf="isLoggedIn" class="header">
        <div class="header-content">
          <h2>🔐 Demo MSAL</h2>
          <nav class="nav">
            <a routerLink="/" class="nav-link">Accueil</a>
            <a *ngIf="hasAnyRole(['Task.Reader', 'Task.Writer'])" routerLink="/lecture" class="nav-link">📖 Lecture</a>
            <a *ngIf="hasRole('Task.Writer')" routerLink="/ecriture" class="nav-link">✏️ Écriture</a>
          </nav>
          <div class="user-info">
            <span class="user-name">{{ userName }}</span>
            <button (click)="logout()" class="btn btn-logout">Déconnexion</button>
          </div>
        </div>
      </header>

      <main class="main-content">
        <router-outlet></router-outlet>
        
        <div *ngIf="isHomePage" class="container">
          <h1>🔐 Demo MSAL - Azure AD</h1>
          
          <div *ngIf="!isLoggedIn" class="card login-section">
            <p>Vous n'êtes pas connecté</p>
            <button (click)="login()" class="btn btn-primary">
              Se connecter avec Azure AD
            </button>
          </div>
          
          <div *ngIf="isLoggedIn" class="card welcome-section">
            <div class="avatar">{{ getInitials() }}</div>
            <h2>Bienvenue !</h2>
            <p class="name">{{ userName }}</p>
            <p class="email">{{ userEmail }}</p>
            
            <div class="roles-section">
              <h3>Vos rôles :</h3>
              <div class="roles-list">
                <span *ngFor="let role of userRoles" class="role-badge" [ngClass]="getRoleBadgeClass(role)">
                  {{ getRoleDisplayName(role) }}
                </span>
                <span *ngIf="userRoles.length === 0" class="no-role">
                  Aucun rôle assigné
                </span>
              </div>
            </div>

            <div class="quick-links">
              <h3>Accès rapide :</h3>
              <div class="links">
                <a *ngIf="hasAnyRole(['Task.Reader', 'Task.Writer'])" routerLink="/lecture" class="link-card">
                  <span class="link-icon">📖</span>
                  <span class="link-text">Page Lecture</span>
                </a>
                <a *ngIf="hasRole('Task.Writer')" routerLink="/ecriture" class="link-card">
                  <span class="link-icon">✏️</span>
                  <span class="link-text">Page Écriture</span>
                </a>
              </div>
              <p *ngIf="userRoles.length === 0" class="no-access">
                Aucun accès disponible. Contactez votre administrateur.
              </p>
            </div>

            <button (click)="logout()" class="btn btn-danger">
              Se déconnecter
            </button>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      background: #f0f2f5;
    }
    .header {
      background: white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      padding: 0 20px;
    }
    .header-content {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 60px;
    }
    .header h2 {
      margin: 0;
      color: #0078d4;
      font-size: 18px;
    }
    .nav {
      display: flex;
      gap: 10px;
    }
    .nav-link {
      text-decoration: none;
      color: #333;
      padding: 8px 16px;
      border-radius: 6px;
      transition: all 0.2s;
    }
    .nav-link:hover {
      background: #f0f2f5;
      color: #0078d4;
    }
    .user-info {
      display: flex;
      align-items: center;
      gap: 15px;
    }
    .user-name {
      color: #666;
      font-size: 14px;
    }
    .btn-logout {
      background: #f0f2f5;
      color: #333;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
    }
    .btn-logout:hover {
      background: #e0e2e5;
    }
    .main-content {
      padding: 20px;
    }
    .container {
      max-width: 500px;
      margin: 40px auto;
      padding: 20px;
      font-family: 'Segoe UI', Arial, sans-serif;
    }
    h1 {
      color: #0078d4;
      text-align: center;
      margin-bottom: 30px;
    }
    .card {
      background: white;
      border-radius: 12px;
      padding: 30px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      text-align: center;
    }
    .avatar {
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, #0078d4, #00bcf2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 20px;
      color: white;
      font-size: 28px;
      font-weight: bold;
    }
    .name {
      font-size: 24px;
      font-weight: 600;
      color: #333;
      margin: 10px 0 5px;
    }
    .email {
      color: #666;
      font-size: 14px;
      margin-bottom: 20px;
    }
    .roles-section {
      margin: 20px 0;
      padding: 15px;
      background: #f8f9fa;
      border-radius: 8px;
    }
    .roles-section h3 {
      margin: 0 0 10px 0;
      font-size: 14px;
      color: #666;
    }
    .roles-list {
      display: flex;
      justify-content: center;
      gap: 10px;
      flex-wrap: wrap;
    }
    .role-badge {
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 500;
    }
    .role-badge.reader {
      background: #e3f2fd;
      color: #1565c0;
    }
    .role-badge.writer {
      background: #e8f5e9;
      color: #2e7d32;
    }
    .no-role {
      color: #999;
      font-style: italic;
    }
    .quick-links {
      margin: 20px 0;
    }
    .quick-links h3 {
      margin: 0 0 15px 0;
      font-size: 14px;
      color: #666;
    }
    .links {
      display: flex;
      justify-content: center;
      gap: 15px;
    }
    .link-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 15px 25px;
      background: #f8f9fa;
      border-radius: 8px;
      text-decoration: none;
      color: #333;
      transition: all 0.2s;
    }
    .link-card:hover {
      background: #e9ecef;
      transform: translateY(-2px);
    }
    .link-icon {
      font-size: 24px;
      margin-bottom: 5px;
    }
    .link-text {
      font-size: 13px;
    }
    .no-access {
      color: #999;
      font-style: italic;
      margin-top: 10px;
    }
    .btn {
      border: none;
      padding: 14px 28px;
      font-size: 16px;
      cursor: pointer;
      border-radius: 6px;
      font-weight: 500;
      transition: all 0.2s;
    }
    .btn-primary {
      background: #0078d4;
      color: white;
    }
    .btn-primary:hover {
      background: #005a9e;
    }
    .btn-danger {
      background: #d83b01;
      color: white;
      margin-top: 20px;
    }
    .btn-danger:hover {
      background: #a52c00;
    }
  `]
})
export class AppComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  userName = '';
  userEmail = '';
  userRoles: string[] = [];
  private readonly destroying$ = new Subject<void>();

  constructor(
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private msalService: MsalService,
    private msalBroadcastService: MsalBroadcastService,
    private router: Router
  ) {}

  get isHomePage(): boolean {
    return this.router.url === '/' || this.router.url === '';
  }

  ngOnInit(): void {
    this.msalService.instance.initialize().then(() => {
      this.msalService.instance.handleRedirectPromise().then((response) => {
        if (response) {
          this.msalService.instance.setActiveAccount(response.account);
        }
        this.setLoginDisplay();
      });
    });

    this.msalBroadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.None),
        takeUntil(this.destroying$)
      )
      .subscribe(() => {
        this.setLoginDisplay();
      });
  }

  setLoginDisplay(): void {
    const accounts = this.msalService.instance.getAllAccounts();
    this.isLoggedIn = accounts.length > 0;
    
    if (this.isLoggedIn) {
      const account = accounts[0];
      this.msalService.instance.setActiveAccount(account);
      this.userName = account.name || 'Utilisateur';
      this.userEmail = account.username || '';
      
      const idTokenClaims = account.idTokenClaims as { roles?: string[] };
      this.userRoles = idTokenClaims?.roles || [];
      
      console.log('[ROLES] Rôles bruts:', this.userRoles);
      console.log('[ROLES] hasRole(Task.Writer):', this.hasRole('Task.Writer'));
      console.log('[ROLES] hasRole(Task.Reader):', this.hasRole('Task.Reader'));
    }
  }

  hasRole(role: string): boolean {
    return this.userRoles.includes(role);
  }

  hasAnyRole(roles: string[]): boolean {
    return roles.some(role => this.userRoles.includes(role));
  }

  getRoleBadgeClass(role: string): string {
    if (role === 'Task.Reader') return 'reader';
    if (role === 'Task.Writer') return 'writer';
    return role.toLowerCase();
  }

  getRoleDisplayName(role: string): string {
    if (role === 'Task.Reader') return '📖 Lecture';
    if (role === 'Task.Writer') return '✏️ Écriture';
    return role;
  }

  getInitials(): string {
    if (!this.userName) return '?';
    return this.userName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  login(): void {
    console.log('[LOGIN] Démarrage de la connexion...');
    const authRequest = this.msalGuardConfig.authRequest as RedirectRequest;
    this.msalService.loginRedirect(authRequest);
  }

  logout(): void {
    this.msalService.logoutRedirect();
  }

  ngOnDestroy(): void {
    this.destroying$.next();
    this.destroying$.complete();
  }
}