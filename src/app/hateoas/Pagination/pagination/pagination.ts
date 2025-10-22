import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  imports: [],
  templateUrl: './pagination.html',
  styleUrl: './pagination.css'
})
export class Pagination implements OnInit {
  @Input() currentPage: number = 0;
  @Input() totalPages: number = 0;
  @Input() maxPagesToShow: number = 5;

  @Output() pageChange = new EventEmitter<number>();

  public pages: number[] = [];

  ngOnInit(): void {
    this.generatePageArray();
  }

  private generatePageArray(): void {
    this.pages = [];
    if (this.totalPages === 0) return;

    let startPage = Math.max(0, this.currentPage - Math.floor(this.maxPagesToShow / 2));
    let endPage = Math.min(this.totalPages - 1, startPage + this.maxPagesToShow - 1);

    if (endPage - startPage + 1 < this.maxPagesToShow) {
        startPage = Math.max(0, endPage - this.maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      this.pages.push(i);
    }
  }

  public goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages && page !== this.currentPage) {
      this.pageChange.emit(page);
    }
  }

  @Input() 
  set totalPagesSetter(value: number) {
      this.totalPages = value;
      this.generatePageArray();
  }
  @Input() 
  set currentPageSetter(value: number) {
      this.currentPage = value;
      this.generatePageArray();
  }

}
