import { Component, inject, Input, OnInit } from '@angular/core';
import { CheckListResponseDTO } from '../checklist-models';
import { Pageable } from '../../hateoas/hateoas-models';
import { ChecklistStore } from '../services/checklist-store';
import { Router, RouterLink } from '@angular/router';
import { SecurityStore } from '../../security/services/security-store';
import { Pagination } from '../../hateoas/Pagination/pagination/pagination';
import { DecimalPipe } from '@angular/common';
import { TripStore } from '../../trips/services/trip-store';
import { CheckListFilterDTO } from '../checklist-models';

@Component({
  selector: 'app-checklist-list',
  imports: [RouterLink, Pagination, DecimalPipe],
  templateUrl: './checklist-list.html',
  styleUrl: './checklist-list.css',
})
export class ChecklistList implements OnInit {
  public readonly store = inject(ChecklistStore);
  public readonly router = inject(Router);
  private readonly tripStore = inject(TripStore);
  public readonly security = inject(SecurityStore);
  public pageable: Pageable = { page: 0, size: 9, sort: 'id,desc' };

  @Input() mode: 'admin-all' | 'user-own' = 'user-own';

  ngOnInit(): void {
    if (this.security.auth().isAdmin) {
      this.mode = 'admin-all';
    } else {
      this.mode = 'user-own';
      const userId = this.security.getId();
      if (userId) {
        this.tripStore.loadTripsByUserId(userId, {}, { page: 0, size: 10 });
      }
    }

    this.loadChecklists();
  }

  loadChecklists() {
    const filters: CheckListFilterDTO = {
      completed: false,
      active: true,
    };
    if (this.mode === 'admin-all') {
      this.store.loadAll(this.pageable);
    } else {
      const currentId = this.security.getId();
      if (currentId !== null) {
        this.store.loadByUser(currentId, filters, this.pageable);
      } else {
        console.error('Error: Usuario no autenticado.');
      }
    }
  }

  onPageChange(newPage: number): void {
    this.pageable.page = newPage;
    this.loadChecklists();
  }

  onDelete(id: number): void {
    if (confirm('¿Estas seguro/a de eliminar esta checklist?')) {
      this.store.delete(id).subscribe({
        next: () => {
          this.loadChecklists();
        },
        error: (err) => console.error('Error al eliminar la checklist: ', err),
      });
    }
  }

  goToCreate(): void {
    this.router.navigateByUrl('/checklists/create');
  }

  goToDetails(id: number): void {
    this.router.navigateByUrl('/checklists/create');
  }

  getProgress(checklist: any): number {
    const total = checklist.items?.length ?? 0;
    const done = checklist.items?.filter((i: any) => i.status)?.length ?? 0;
    return total ? (done * 100) / total : 0;
  }

  getTripName(tripId: number): string {
    const trip = this.tripStore.trips().list.find((t) => t.id === tripId);
    return trip ? trip.name : 'Sin viaje asociado';
  }
}
