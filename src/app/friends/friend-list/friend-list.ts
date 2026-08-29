import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FriendService } from '../services/friend-service';
import { FriendRequestDTO, UserResumeDTO } from '../friend-models';
import { SecurityStore } from '../../security/services/security-store';
import { Subject, of, timer } from 'rxjs';
import { distinctUntilChanged, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-friend-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './friend-list.html',
  styleUrl: './friend-list.css',
})
export class FriendList implements OnInit {
  private readonly friendService = inject(FriendService);
  private readonly security = inject(SecurityStore);
  private readonly cdr = inject(ChangeDetectorRef);
  private searchSubject = new Subject<string>();

  public searchQuery: string = '';
  public searchResults: UserResumeDTO[] = [];
  public pendingRequests: FriendRequestDTO[] = [];
  public friends: UserResumeDTO[] = [];
  public loading: boolean = false;
  public errorMessage: string | null = null;

  ngOnInit(): void {
    this.loadPendingRequests();
    this.loadFriends();

    this.searchSubject
      .pipe(
        distinctUntilChanged(),
        tap((query) => {
          this.errorMessage = null;
          if (!query) {
            this.searchResults = [];
            this.loading = false;
          } else {
            this.loading = true;
          }
          this.cdr.detectChanges();
        }),
        switchMap((query) => {
          if (!query) {
            return of({ content: [] as UserResumeDTO[] });
          }
          return timer(300).pipe(switchMap(() => this.friendService.searchUsers(query)));
        }),
      )
      .subscribe({
        next: (response: any) => {
          this.searchResults = (response.content || []).filter(
            (u: UserResumeDTO) => u.id !== this.security.getId(),
          );
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.errorMessage = 'Error al buscar.';
          this.loading = false;
          this.cdr.detectChanges();
        },
      });
  }

  loadPendingRequests(): void {
    this.friendService.getPendingRequest().subscribe({
      next: (requests) => {
        this.pendingRequests = requests;
        this.cdr.detectChanges();
      },
      error: () => (this.errorMessage = 'Error al cargar las solicitudes.'),
    });
  }

  loadFriends(): void {
    this.friendService.getFriends().subscribe({
      next: (friends) => {
        this.friends = friends;
        this.cdr.detectChanges();
      },
      error: () => (this.errorMessage = 'Error al cargar amigos.'),
    });
  }

  onSearch(): void {
    this.searchSubject.next(this.searchQuery.trim());
  }

  sendRequest(receiverId: number): void {
    this.friendService.sendRequest(receiverId).subscribe({
      next: () => {
        alert('Solicitud enviada!');
        this.searchResults = [];
        this.searchQuery = '';
        this.cdr.detectChanges();
      },
      error: () => (this.errorMessage = 'Error al enviar la solicitud.'),
    });
  }

  acceptRequest(requestId: number): void {
    this.friendService.acceptRequest(requestId).subscribe({
      next: () => {
        this.loadPendingRequests();
        this.loadFriends();
      },
      error: () => (this.errorMessage = 'Error al aceptar la solicitud.'),
    });
  }

  rejectRequest(requestId: number): void {
    this.friendService.rejectRequest(requestId).subscribe({
      next: () => this.loadPendingRequests(),
      error: () => (this.errorMessage = 'Error al rechazar la solicitud.'),
    });
  }

  isFriend(userId: number): boolean {
    return this.friends.some((f) => f.id === userId);
  }
}
