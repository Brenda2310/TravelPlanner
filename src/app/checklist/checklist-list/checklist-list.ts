import { Component, inject, Input, OnInit } from '@angular/core';
import { CheckListResponseDTO } from '../checklist-models';
import { Pageable } from '../../hateoas/hateoas-models';
import { ChecklistStore } from '../services/checklist-store';
import { Router, RouterLink } from '@angular/router';
import { SecurityStore } from '../../security/services/security-store';
import { Pagination } from '../../hateoas/Pagination/pagination/pagination';

@Component({
  selector: 'app-checklist-list',
  imports: [RouterLink, Pagination],
  templateUrl: './checklist-list.html',
  styleUrl: './checklist-list.css'
})
export class ChecklistList implements OnInit{

  public readonly store = inject(ChecklistStore);
  public readonly router = inject(Router);
  public readonly security = inject(SecurityStore);
  public pageable: Pageable = {page: 0, size: 10, sort: 'id,desc'};

  @Input() mode: 'admin-all' | 'user-own' = 'user-own';

  ngOnInit(): void {
    this.loadChecklists();
  }

  loadChecklists(){
    if(this.mode === 'admin-all'){
      this.store.loadAll(this.pageable);
    } else {
      const currentId = this.security.getId();
      if(currentId !== null){
        const filters = {};
        this.store.loadByUser(currentId, filters, this.pageable);
      } else {
        console.error("Error: Usuario no autenticado.")
      }
    }
  }

  onPageChange(newPage: number): void{
    this.pageable.page = newPage;
    this.loadChecklists();
  }

  onDelete(id: number): void{
    if(confirm("¿Estas seguro/a de eliminar esta checklist?")) {
      this.store.delete(id).subscribe({
        error: (err) => console.error("Error al eliminar la checklist: ", err)
      });
    }
  }

  goToCreate(): void{
    this.router.navigateByUrl("/checklists/create");
  }

  goToDetails(id: number): void{
    this.router.navigateByUrl("/checklists/create");
  }

}
