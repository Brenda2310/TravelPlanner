import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExpenseStore } from '../../../expenses/services/expense-store';
import { Pageable } from '../../../hateoas/hateoas-models';
import { TripStore } from '../../services/trip-store';
import { FriendService } from '../../../friends/services/friend-service';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, switchMap, of, map, timer } from 'rxjs';
import { UserResumeDTO } from '../../../friends/friend-models';
import { TripInvitationService } from '../../services/tripInvitation/trip-invitation-service';
import { HttpClient } from '@angular/common/http';
import { TripInvitationDTO } from '../../trip-models';
@Component({
  selector: 'app-trip-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './trip-details.html',
  styleUrl: './trip-details.css',
})
export class TripDetails implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly friendService = inject(FriendService);
  private readonly inviteSubject = new Subject<string>();
  private readonly tripInvitationService = inject(TripInvitationService);
  private readonly http = inject(HttpClient);

  public readonly store = inject(TripStore);
  public readonly expenses = inject(ExpenseStore);
  public readonly router = inject(Router);

  public inviteQuery: string = '';
  public inviteResults: UserResumeDTO[] = [];
  public inviteLoading: boolean = false;
  public sentInvitations: TripInvitationDTO[] = [];
  public expensePageable: Pageable = { page: 0, size: 10, sort: 'date,desc' };
  public inviteErrorMessage: string | null = null;

  private friends: UserResumeDTO[] = [];
  private readonly cdr = inject(ChangeDetectorRef);

  public tripId: number | null = null;
  public currentTrip$ = this.store.currentTrip;

  public calculations = this.expenses.calculations;

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');

      if (id) {
        this.tripId = +id;

        this.store.loadTripById(this.tripId);

        this.tripInvitationService.getSentInvitations(this.tripId).subscribe({
          next: (invitations) => (this.sentInvitations = invitations),
          error: () => {},
        });

        this.loadExpenses();
        this.loadTripExpenses();
      }
    });

    this.friendService.getFriends().subscribe({
      next: (friends) => (this.friends = friends),
      error: () => {},
    });

    this.inviteSubject
      .pipe(
        distinctUntilChanged(),
        switchMap((query) => {
          const trimmed = query?.trim();
          if (!trimmed) {
            this.inviteResults = [];
            this.inviteLoading = false;
            this.cdr.detectChanges();
            return of(null);
          }

          this.inviteLoading = true;
          this.cdr.detectChanges();

          return timer(200).pipe(switchMap(() => this.friendService.searchUsers(trimmed)));
        }),
      )
      .subscribe({
        next: (response: any) => {
          if (!response) return;

          const searchResults: UserResumeDTO[] = response.content || [];

          const friendIds = new Set(this.friends.map((f) => f.id));

          const tripUserIds = new Set(this.currentTrip$()?.users?.map((u) => u.id) || []);

          this.inviteResults = searchResults.filter(
            (user: UserResumeDTO) => friendIds.has(user.id) && !tripUserIds.has(user.id),
          );

          this.inviteLoading = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.inviteLoading = false;
          this.inviteResults = [];
          this.cdr.detectChanges();
        },
      });
  }

  loadTripExpenses() {
    if (this.tripId !== null) {
      this.expenses.loadTotalExpensesByTrip(this.tripId);
      this.expenses.loadAverageExpensesByTrip(this.tripId);
    }
  }

  loadExpenses() {
    if (this.tripId !== null) {
      this.expenses.loadExpensesByTripId(this.tripId, this.expensePageable);
    }
  }

  onExpensePageChange(newPage: number): void {
    if (this.tripId !== null) {
      this.expensePageable.page = newPage;
      this.expenses.loadExpensesByTripId(this.tripId, this.expensePageable);
    }
  }

  onDeleteTrip(): void {
    if (this.tripId && confirm('¿Eliminar viaje completo?')) {
      this.store.deleteTrip(this.tripId).subscribe({
        next: () => this.router.navigate(['/trips']),
      });
    }
  }

  get name() {
    return this.currentTrip$()?.name;
  }

  onInviteSearch(): void {
    this.inviteSubject.next(this.inviteQuery);
  }

  sendInvitation(receiverId: number): void {
    if (!this.tripId) return;
    this.tripInvitationService.sendInvitation(this.tripId, receiverId).subscribe({
      next: () => {
        this.inviteErrorMessage = null;
        this.inviteQuery = '';
        this.inviteResults = [];
        this.tripInvitationService.getSentInvitations(this.tripId!).subscribe({
          next: (invitations) => {
            this.sentInvitations = invitations;
          },
          error: () => {},
        });
      },
    });
  }

  isInvited(userId: number): boolean {
    return this.sentInvitations.some(
      (i) => i.receiverId === userId && i.tripInvitationStatus === 'PENDING',
    );
  }

  downloadPdf(): void {
    if (!this.tripId) return;
    this.http
      .get(`http://localhost:8080/trips/${this.tripId}/pdf`, {
        responseType: 'blob',
      })
      .subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${this.name}.pdf`;
          a.click();
          window.URL.revokeObjectURL(url);
        },
        error: () => alert('Error al descargar el PDF.'),
      });
  }
}
