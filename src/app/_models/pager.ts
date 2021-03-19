import {PaginationService} from "../services/pagination.service";
import * as _ from 'underscore';

export class Pager {
  constructor(totalItems: any = null,
    currentPage: any= null,
    pageSize: any= null,
    totalPages: any= null,
    startPage: any= null,
    endPage: any= null,
    startIndex: any= null,
    endIndex: any= null,
    pages: any= null) {
    this.totalItems = totalItems
    this.currentPage = currentPage
    this.pageSize = pageSize
    this.totalPages = totalPages
    this.startPage = startPage
    this.endPage = endPage
    this.startIndex = startIndex
    this.endIndex = endIndex
    this.pages = pages
  }
  getStatus() {
    return `Từ ${this.startIndex + 1} - ${this.endIndex + 1} trên tổng ${this.totalItems} bản ghi`
  }
  totalItems: any;
  currentPage: any;
  pageSize: any;
  totalPages: any;
  startPage: any;
  endPage: any;
  startIndex: any;
  endIndex: any;
  pages: any;
}

export class Pagination {
  constructor(itemCount: number = 0, activePage: number = 1, pageSize: number= 10) {
    let paging = new PaginationService();
    this.itemCount = itemCount
    this.activePage = activePage
    this.pageSize = pageSize
    this.pager = this.getPager(itemCount, activePage, pageSize)
  }
  getPager(totalItems: number, currentPage: number = 1, pageSize: number = 10) {
    let totalPages = Math.ceil(totalItems/pageSize);
    let startPage, endPage: number;
    if (totalPages <= 10) {
      startPage = 1;
      endPage = totalPages;
    } else {
      if (currentPage <= 6) {
        startPage = 1;
        endPage = 10;
      } else if (currentPage + 4 >= totalPages) {
        startPage = totalPages - 9;
        endPage = totalPages;
      } else {
        startPage = currentPage - 5;
        endPage = currentPage + 4;
      }
    }
    let startIndex = (currentPage - 1) * pageSize;
    let endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);
    let pages = _.range(startPage, endPage + 1);
    return new Pager(totalItems, currentPage, pageSize, totalPages, startPage, endPage, startIndex, endIndex, pages)
  }
  itemCount: number;
  activePage: number = 1;
  pageSize: number;
  pager: Pager;
}
