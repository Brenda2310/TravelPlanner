import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivityCompanyResponseDTO } from '../activity-models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-activity-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './activity-card.html',
  styleUrl: './activity-card.css'
})
export class ActivityCard {
  @Input() activity!: ActivityCompanyResponseDTO;
  @Output() reservate = new EventEmitter<number>();

  onAdd(): void {
    this.reservate.emit(this.activity.id);
  }
}
