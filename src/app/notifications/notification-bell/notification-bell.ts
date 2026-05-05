import { Component, DestroyRef, ElementRef, HostListener, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NotificationCategory, NotificationResponseDTO } from '../notifications-models';
import { NotificationService } from '../services/notification-service';
import { interval, switchMap } from 'rxjs';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-notification-bell',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './notification-bell.html',
  styleUrl: './notification-bell.css',
})
export class NotificationBell {
  private readonly notifService = inject(NotificationService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly elRef = inject(ElementRef);

  protected readonly NotificationCategory = NotificationCategory;

  isOpen = signal(false);
  loading = signal(false);
  activeCategory = signal<NotificationCategory | null>(null);
  notifications = signal<NotificationResponseDTO[]>([]);
  unreadCount = signal(0);

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
}
