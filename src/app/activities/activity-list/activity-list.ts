import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { ActivityCompanyResponseDTO } from '../activity-models';
import { ActivityCard } from "../activity-card/activity-card";
import { Pagination } from "../../hateoas/Pagination/pagination/pagination";
import { Router } from '@angular/router';

@Component({
  selector: 'app-activity-list',
  standalone: true,
  imports: [ActivityCard],
  templateUrl: './activity-list.html',
  styleUrl: './activity-list.css'
})
export class ActivityList {
  private readonly router = inject(Router);
  @Input() activities: ActivityCompanyResponseDTO[] = [];
  @Output() reservate = new EventEmitter<number>();

  toDetails(id: number){
    this.router.navigateByUrl(`/activities/${id}`);
  }
}
