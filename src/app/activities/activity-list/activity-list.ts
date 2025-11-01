import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivityCompanyResponseDTO } from '../activity-models';
import { ActivityCard } from "../activity-card/activity-card";
import { Pagination } from "../../hateoas/Pagination/pagination/pagination";

@Component({
  selector: 'app-activity-list',
  standalone: true,
  imports: [ActivityCard],
  templateUrl: './activity-list.html',
  styleUrl: './activity-list.css'
})
export class ActivityList {
  @Input() activities: ActivityCompanyResponseDTO[] = [];
  @Output() addToItinerary = new EventEmitter<number>();

}
