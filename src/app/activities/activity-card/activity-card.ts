import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { ActivityCompanyResponseDTO } from '../activity-models';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-activity-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './activity-card.html',
  styleUrl: './activity-card.css'
})
export class ActivityCard {
  private readonly router = inject(Router);
  @Input() activity!: ActivityCompanyResponseDTO;
  @Output() reservate = new EventEmitter<number>();
  @Input() type: 'user' | 'company' = 'user';



  onAdd(): void {
    this.reservate.emit(this.activity.id);
  }

  toDetails(){
    this.router.navigateByUrl(`/activities/${this.activity.id}`);
  }
}
