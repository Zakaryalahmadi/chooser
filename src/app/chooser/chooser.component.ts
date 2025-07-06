import { Component, ElementRef, ViewChild, OnDestroy } from '@angular/core';

type TouchPoint = {
  x: number;
  y: number;
  color: string;
};

@Component({
  selector: 'app-chooser',
  standalone: true,
  imports: [],
  templateUrl: './chooser.component.html',
  styleUrl: './chooser.component.scss',
})
export default class ChooserComponent implements OnDestroy {
  @ViewChild('touchCanvas', { static: true })
  canvasRef!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;
  private touches: { [id: string]: TouchPoint } = {};
  private selectedTouchId: string | null = null;
  private selectionTimer: any = null;
  private animationStartTime: number | null = null;
  private animationFrameId: number | null = null;
  private baseRadius: number = 70;
  private isAnimating: boolean = false;

  // Timer variables
  private countdownValue: number = 5;
  private isCountdownActive: boolean = false;
  private textScale: number = 1;
  private textAnimationStart: number = 0;

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;

    this.setupCanvas();

    // Handle window resize
    window.addEventListener('resize', () => {
      this.setupCanvas();
      this.drawTouches();
    });

    canvas.addEventListener('touchstart', this.handleTouchStart.bind(this));
    canvas.addEventListener('touchmove', this.handleTouchMove.bind(this));
    canvas.addEventListener('touchend', this.handleTouchEnd.bind(this));
  }

  private setupCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    const devicePixelRatio = window.devicePixelRatio || 1;

    // Obtenir les dimensions d'affichage
    const displayWidth = window.innerWidth;
    const displayHeight = window.innerHeight;

    // Définir les dimensions CSS du canvas
    canvas.style.width = displayWidth + 'px';
    canvas.style.height = displayHeight + 'px';

    // Définir les dimensions physiques du canvas en tenant compte du devicePixelRatio
    canvas.width = displayWidth * devicePixelRatio;
    canvas.height = displayHeight * devicePixelRatio;

    // Ajuster l'échelle du contexte pour compenser le devicePixelRatio
    this.ctx.scale(devicePixelRatio, devicePixelRatio);

    this.clearCanvas();
  }

  private handleTouchStart(e: TouchEvent): void {
    e.preventDefault();
    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();

    for (let t of Array.from(e.touches)) {
      const x = t.clientX - rect.left;
      const y = t.clientY - rect.top;

      this.touches[t.identifier] = {
        x: x,
        y: y,
        color: 'white',
      };
    }
    this.drawTouches();
    this.resetSelectionTimer();
  }

  private clearCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
  }

  private handleTouchMove(e: TouchEvent): void {
    e.preventDefault();
    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();

    for (let t of Array.from(e.touches)) {
      if (this.touches[t.identifier]) {
        this.touches[t.identifier].x = t.clientX - rect.left;
        this.touches[t.identifier].y = t.clientY - rect.top;
      }
    }
    this.drawTouches();
  }

  private handleTouchEnd(e: TouchEvent): void {
    for (let t of Array.from(e.changedTouches)) {
      // Si le cercle sélectionné est retiré, on réinitialise la sélection
      if (this.selectedTouchId === t.identifier.toString()) {
        this.selectedTouchId = null;
      }
      delete this.touches[t.identifier];
    }
    this.drawTouches();
    this.resetSelectionTimer();
  }

  private getCurrentRadius(): number {
    if (!this.isAnimating) {
      return this.baseRadius;
    }

    // Animation continue - oscillation constante
    const time = Date.now() / 1000; // Temps en secondes
    const scale = 1 - 0.2 * Math.sin(time * 4); // Oscillation rapide
    return this.baseRadius * scale;
  }

  private drawTouches(): void {
    // Clear canvas
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

    const currentRadius = this.getCurrentRadius();

    // Draw all touches
    Object.entries(this.touches).forEach(([id, touch]) => {
      this.ctx.beginPath();
      this.ctx.arc(touch.x, touch.y, currentRadius, 0, Math.PI * 2);
      // Utiliser la couleur rouge si c'est le cercle sélectionné, sinon blanc
      this.ctx.fillStyle = this.selectedTouchId === id ? 'red' : 'white';
      this.ctx.fill();
    });

    // Draw countdown text if active
    if (this.isCountdownActive) {
      this.drawCountdownText();
    }
  }

  private drawCountdownText(): void {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    // Animation de scale
    const currentTime = Date.now();
    const elapsed = currentTime - this.textAnimationStart;
    const duration = 1000; // 1 seconde par chiffre

    let scale = 1;
    if (elapsed < duration) {
      // Animation: commence grand, devient petit, puis disparaît
      const progress = elapsed / duration;
      if (progress < 0.3) {
        // Phase d'apparition (0 à 0.3)
        scale = 1 + (progress / 0.3) * 0.5; // De 1 à 1.5
      } else if (progress < 0.7) {
        // Phase stable (0.3 à 0.7)
        scale = 1.5;
      } else {
        // Phase de disparition (0.7 à 1)
        const fadeProgress = (progress - 0.7) / 0.3;
        scale = 1.5 - fadeProgress * 1.5; // De 1.5 à 0
      }
    }

    if (scale > 0) {
      this.ctx.save();
      this.ctx.translate(centerX, centerY);
      this.ctx.scale(scale, scale);

      // Dessiner un fond semi-transparent pour améliorer la visibilité
      this.ctx.beginPath();
      this.ctx.arc(0, 0, 80, 0, Math.PI * 2);
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      this.ctx.fill();

      // Style du texte
      this.ctx.font = 'bold 100px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';

      // Dessiner le texte avec un contour noir épais pour plus de contraste
      this.ctx.strokeStyle = 'black';
      this.ctx.lineWidth = 6;
      this.ctx.strokeText(this.countdownValue.toString(), 0, 0);

      // Dessiner le texte en blanc par-dessus
      this.ctx.fillStyle = 'white';
      this.ctx.fillText(this.countdownValue.toString(), 0, 0);

      this.ctx.restore();
    }
  }

  private startContinuousAnimation(): void {
    this.isAnimating = true;
    this.animateFrame();
  }

  private stopAnimation(): void {
    this.isAnimating = false;
    this.isCountdownActive = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  private animateFrame(): void {
    if (!this.isAnimating && !this.isCountdownActive) return;

    this.drawTouches();
    this.animationFrameId = requestAnimationFrame(() => this.animateFrame());
  }

  private resetSelectionTimer(): void {
    // Annuler le timer précédent s'il existe
    if (this.selectionTimer) {
      clearTimeout(this.selectionTimer);
    }

    // Arrêter l'animation précédente
    this.stopAnimation();

    // Réinitialiser la sélection et le countdown
    this.selectedTouchId = null;
    this.isCountdownActive = false;
    this.countdownValue = 5;
    this.drawTouches();

    // Démarrer un nouveau timer si il y a des cercles et que le countdown n'est pas déjà actif
    const touchIds = Object.keys(this.touches);
    if (touchIds.length > 0 && !this.isCountdownActive) {
      this.startCountdown();
    } else if (touchIds.length === 0) {
      // Arrêter le countdown s'il n'y a plus de cercles
      this.stopAnimation();
    }
  }

  private startCountdown(): void {
    this.isCountdownActive = true;
    this.countdownValue = 5;
    this.textAnimationStart = Date.now();

    // Démarrer l'animation frame pour le texte
    this.animateFrame();

    // Fonction récursive pour le countdown
    const countdownStep = () => {
      if (this.countdownValue > 0) {
        this.textAnimationStart = Date.now();
        this.selectionTimer = setTimeout(() => {
          this.countdownValue--;
          countdownStep();
        }, 1000);
      } else {
        // Fin du countdown
        this.isCountdownActive = false;
        this.drawTouches();

        // Commencer l'animation des cercles
        this.startContinuousAnimation();

        // Attendre 3 secondes avant de faire la sélection
        this.selectionTimer = setTimeout(() => {
          this.selectRandomCircle();
          this.stopAnimation();
        }, 3000);
      }
    };

    countdownStep();
  }

  private selectRandomCircle(): void {
    const touchIds = Object.keys(this.touches);

    if (touchIds.length === 0) {
      this.selectedTouchId = null;
      return;
    }

    // Sélectionner un cercle au hasard
    const randomIndex = Math.floor(Math.random() * touchIds.length);
    this.selectedTouchId = touchIds[randomIndex];

    // Redessiner le canvas
    this.drawTouches();
  }

  ngOnDestroy(): void {
    // Nettoyer le timer lors de la destruction du composant
    if (this.selectionTimer) {
      clearTimeout(this.selectionTimer);
    }

    // Nettoyer l'animation
    this.stopAnimation();
  }
}
