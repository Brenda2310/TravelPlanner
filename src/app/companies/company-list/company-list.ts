import { Component, inject, OnInit } from '@angular/core';
import { CompanyStore } from '../services/company-store';
import { Router } from '@angular/router';
import { Pageable } from '../../hateoas/hateoas-models';
import { Pagination } from "../../hateoas/Pagination/pagination/pagination";

@Component({
  selector: 'app-company-list',
  standalone:true,
  imports: [Pagination],
  templateUrl: './company-list.html',
  styleUrl: './company-list.css'
})
export class CompanyList implements OnInit{
  public readonly store = inject(CompanyStore);
  public readonly router = inject(Router);

    public pageable: Pageable = { page: 0, size: 10, sort: 'username,asc' }; 

    ngOnInit(): void {
        this.loadCompanies();
    }

    loadCompanies(): void {
        this.store.loadAllCompanies(this.pageable);
    }

    onPageChange(newPage: number): void {
        this.pageable.page = newPage;
        this.loadCompanies();
    }

    onDelete(id: number): void {
        if (confirm('¿Confirmar eliminación de esta compañía?')) {
            this.store.deleteCompany(id).subscribe({
                error: (err) => console.error('Error al eliminar compañía:', err)
            });
        }
    }
}
