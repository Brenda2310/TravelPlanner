import { DatePipe, NgClass } from '@angular/common';
import { Component, DestroyRef, ElementRef, HostListener, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { interval, switchMap } from 'rxjs';
import {
  NotificationCategory,
  NotificationResponseDTO,
  NotificationType,
} from '../notifications-models';
import { NotificationService } from '../services/notification-service';
import { TripInvitationService } from '../../trips/services/tripInvitation/trip-invitation-service';
import { Router } from '@angular/router';
import { not } from 'rxjs/internal/util/not';

@Component({
  selector: 'app-notification-bell',
  standalone: true,
  imports: [DatePipe, NgClass],
  templateUrl: './notification-bell.html',
  styleUrl: './notification-bell.css',
})
export class NotificationBell {
  private readonly notifService = inject(NotificationService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly elRef = inject(ElementRef);
  private readonly tripInvitationService = inject(TripInvitationService);
  private readonly router = inject (Router);

  protected readonly NotificationCategory = NotificationCategory;

  isOpen = signal(false);
  loading = signal(false);
  activeCategory = signal<NotificationCategory | null>(null);
  notifications = signal<NotificationResponseDTO[]>([]);
  unreadCount = signal(0);

  private readonly ICON_PATHS = {
    location:
      'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
    warning:
      'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z',
    check: 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z',
    error:
      'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z',
    people:
      'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z',
    calendar:
      'M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z',
    bell: 'M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6V11c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z',
  };

  ngOnInit() {
    this.fetchUnreadCount();

    interval(60_000)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap(() => this.notifService.getUnreadCount()),
      )
      .subscribe(({ unreadCount }) => this.unreadCount.set(unreadCount));
  }

  togglePanel() {
    this.isOpen.update((v) => !v);
    if (this.isOpen()) this.loadNotifications();
  }

  setCategory(cat: NotificationCategory | null) {
    this.activeCategory.set(cat);
    this.loadNotifications();
  }

  loadNotifications() {
    this.loading.set(true);
    this.notifService.getNotifications(this.activeCategory() ?? undefined).subscribe({
      next: ({ notifications, unreadCount }) => {
        
        console.log(notifications);
        
        this.notifications.set(notifications);
        this.unreadCount.set(unreadCount);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  onMarkAsRead(notif: NotificationResponseDTO) {
    if (notif.read) return;
    this.notifService.markAsRead(notif.id).subscribe(() => {
      this.notifications.update((list) =>
        list.map((n) => (n.id === notif.id ? { ...n, read: true } : n)),
      );
      this.unreadCount.update((c) => Math.max(0, c - 1));
    });
  }

  onMarkAllAsRead() {
    this.notifService.markAllAsRead().subscribe(() => {
      this.notifications.update((list) => list.map((n) => ({ ...n, read: true })));
      this.unreadCount.set(0);
    });
  }

  openNotification(notif: NotificationResponseDTO): void {

    if (!notif.read) {
      this.onMarkAsRead(notif);
    }

    switch (notif.type) {

      case NotificationType.TRIP_INVITE:
        if(notif.tripId){
          this.router.navigate(["/trips", notif.tripId]);
        }
        break;

      case NotificationType.TRIP_INVITE_ACCEPTED:
        this.router.navigate(['/trips', notif.relatedEntityId]);
        break;

      case NotificationType.FRIEND_REQUEST:
      case NotificationType.FRIEND_REQUEST_ACCEPTED:
        this.router.navigate(['/friends']);
        break;

      default:
        break;
    }

    this.isOpen.set(false);
  }

  acceptInvitation(notif: NotificationResponseDTO, event: MouseEvent): void {
    event.stopPropagation();
    if (!notif.relatedEntityId) return;
    this.tripInvitationService.acceptInvitation(notif.relatedEntityId).subscribe({
      next: (tripId) => {
        this.onMarkAsRead(notif);
        this.loadNotifications();
        //this.router.navigate(["/trips", tripId]) NO SE SI DEJARLO O NO...
      },
      error: (err) => {
        alert(err.error.message);}
    });
  }

  denyInvitation(notif: NotificationResponseDTO, event: MouseEvent): void {
    event.stopPropagation();
    if (!notif.relatedEntityId) return;
    this.tripInvitationService.denyInvitation(notif.relatedEntityId).subscribe({
      next: () => {
        this.onMarkAsRead(notif);
        this.loadNotifications();
      },
      error: () => alert('Error al rechazar la invitación.')
    });
  }

  private fetchUnreadCount() {
    this.notifService
      .getUnreadCount()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(({ unreadCount }) => this.unreadCount.set(unreadCount));
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  }

  getIconConfig(type: NotificationType): { path: string; cssClass: string } {
    const map: Partial<Record<NotificationType, { path: string; cssClass: string }>> = {
      [NotificationType.TRIP_REMINDER]: { path: this.ICON_PATHS.location, cssClass: 'icon-trip' },
      [NotificationType.TRIP_INVITE]: { path: this.ICON_PATHS.location, cssClass: 'icon-trip' },
      [NotificationType.TRIP_INVITE_ACCEPTED]: {
        path: this.ICON_PATHS.location,
        cssClass: 'icon-trip',
      },
      [NotificationType.BUDGET_EXCEEDED]: {
        path: this.ICON_PATHS.warning,
        cssClass: 'icon-budget',
      },
      [NotificationType.BUDGET_HALF_SPENT]: {
        path: this.ICON_PATHS.warning,
        cssClass: 'icon-budget',
      },
      [NotificationType.PAYMENT_CONFIRMED]: {
        path: this.ICON_PATHS.check,
        cssClass: 'icon-pay-ok',
      },
      [NotificationType.PAYMENT_FAILED]: { path: this.ICON_PATHS.error, cssClass: 'icon-pay-fail' },
      [NotificationType.RESERVATION_CONFIRMED]: {
        path: this.ICON_PATHS.check,
        cssClass: 'icon-pay-ok',
      },
      [NotificationType.RESERVATION_CANCELLED]: {
        path: this.ICON_PATHS.error,
        cssClass: 'icon-pay-fail',
      },
      [NotificationType.FRIEND_REQUEST]: { path: this.ICON_PATHS.people, cssClass: 'icon-social' },
      [NotificationType.FRIEND_REQUEST_ACCEPTED]: {
        path: this.ICON_PATHS.people,
        cssClass: 'icon-social',
      },
      [NotificationType.SHARED_EXPENSE_ASSIGNED]: {
        path: this.ICON_PATHS.warning,
        cssClass: 'icon-budget',
      },
      [NotificationType.SHARED_EXPENSE_SETTLED]: {
        path: this.ICON_PATHS.check,
        cssClass: 'icon-pay-ok',
      },
      [NotificationType.ACTIVITY_REMINDER]: {
        path: this.ICON_PATHS.calendar,
        cssClass: 'icon-activity',
      },
    };
    return map[type] ?? { path: this.ICON_PATHS.bell, cssClass: 'icon-trip' };
  }
}
