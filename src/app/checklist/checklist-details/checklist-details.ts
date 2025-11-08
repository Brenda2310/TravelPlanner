import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChecklistStore } from '../services/checklist-store';
import { CheckListItem } from '../checklistItem/check-list-item/check-list-item';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-checklist-details',
  imports: [CommonModule, CheckListItem],
  templateUrl: './checklist-details.html',
  styleUrl: './checklist-details.css'
})
export class ChecklistDetails {

  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(ChecklistStore);

  public checklist = this.store.currentChecklist;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.store.loadChecklistById(id);
    }
  }

}
