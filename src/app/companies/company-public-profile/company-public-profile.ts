import { CommonModule, CurrencyPipe } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CompanyService } from '../services/company-service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-company-public-profile',
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './company-public-profile.html',
  styleUrl: './company-public-profile.css'
})
export class CompanyPublicProfile implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly companyService = inject(CompanyService);
  private readonly cdr = inject(ChangeDetectorRef);

  public company: any = null;
  public loading: boolean = true;
  public errorMessage: string | null = null;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get("id");
    if (id) {
      this.companyService.getPublicProfile(+id).subscribe({
        next: (data) => {
          this.company = data;
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.errorMessage = "Error al cargar el perfil de la empresa.";
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
    }
  }
}