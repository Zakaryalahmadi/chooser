import { Component, ElementRef, ViewChild } from '@angular/core';

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
export default class ChooserComponent {
  @ViewChild('touchCanvas', { static: true })
  canvasRef!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;
  private touches: { [id: string]: TouchPoint } = {};

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    this.clearCanvas();

    // Handle window resize
    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      this.drawTouches();
    });

    canvas.addEventListener('touchstart', this.handleTouchStart.bind(this));
    canvas.addEventListener('touchmove', this.handleTouchMove.bind(this));
    canvas.addEventListener('touchend', this.handleTouchEnd.bind(this));
  }

  private handleTouchStart(e: TouchEvent): void {
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
  }

  private clearCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  private handleTouchMove(e: TouchEvent): void {
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
      delete this.touches[t.identifier];
    }
    this.drawTouches();
  }

  private drawTouches(): void {
    const canvas = this.canvasRef.nativeElement;
    // Clear canvas
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw all touches
    Object.values(this.touches).forEach((touch) => {
      this.ctx.beginPath();
      this.ctx.arc(touch.x, touch.y, 50, 0, Math.PI * 2);
      this.ctx.fillStyle = touch.color;
      this.ctx.fill();
    });
  }
}
