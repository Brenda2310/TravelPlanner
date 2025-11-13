import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChecklistItemStore } from '../../services/checklistItem/checklist-item-store';
import { ChecklistItemService } from '../../services/checklistItem/checklist-item-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-check-list-item',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './check-list-item.html',
  styleUrl: './check-list-item.css'
})
export class CheckListItem implements OnInit {

  public readonly store = inject(ChecklistItemStore);
  private readonly service = inject(ChecklistItemService);
  private readonly formBuilder = inject(FormBuilder);
  protected readonly router = inject(Router);

  @Input() checklistId!: number;

  public itemForm = this.formBuilder.group({
    description: ['', [Validators.required, Validators.maxLength(100)]],
  });

  public errorMessage: string | null = null;

  ngOnInit(): void {
      console.log('Checklist ID recibido:', this.checklistId);
    if (this.checklistId) {
      this.store.loadItemsByChecklistId(this.checklistId, { page: 0, size: 10 });
    }
  }

  createItem() {
    if (this.itemForm.invalid) return;

    const dto = {
      description: this.itemForm.value.description!,
      checklistId: this.checklistId,
    };

    this.store.createItem(dto).subscribe({
      next: () => {
        this.itemForm.reset();
      },
      error: (err) => {
        this.errorMessage = 'Error al crear el ítem.';
        console.error(err);
      },
    });
  }

  deleteItem(itemId: number){
    if(!confirm('¿Desea eliminar este item?')){
      return;
    }

    this.store.deleteItem(itemId).subscribe();
  }


  get items() {
    return this.store.checklistItem().list;
  }

  get loading() {
    return this.store.loading();
  }
}
