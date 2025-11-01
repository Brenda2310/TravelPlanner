import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivityCategory, CompanyActivityFilterParams } from '../activity-models';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-activity-filters',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './activity-filters.html',
  styleUrl: './activity-filters.css'
})
export class ActivityFilters {
  @Input() categoryList: ActivityCategory[] = [];
  @Input() form!: FormGroup;
  @Output() filtersApplied = new EventEmitter<CompanyActivityFilterParams>();

  onSubmit(): void {
    this.filtersApplied.emit(this.form.value as CompanyActivityFilterParams);
  }
}
