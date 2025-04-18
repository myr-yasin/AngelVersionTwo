import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { map, Subject, takeUntil } from 'rxjs';
import { ProfileService } from '../../profile/profile.service';

@Component({
  selector: 'app-attendance-definitions',
  templateUrl: './attendance-definitions.component.html',
  styleUrls: ['./attendance-definitions.component.scss']
})
export class AttendanceDefinitionsComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();

  tabList: any[] = [
    {id: 1, label: this.translateService.instant('Mesailer'), icon: "fa-solid fa-calendar-day"},
    {id: 2, label: this.translateService.instant('Mesai_Grupları'), icon: "fa-solid fa-calendar-days"},
    {id: 3, label: this.translateService.instant('Mesai_Periyotları'), icon: "fa-solid fa-calendar-week"},
    {id: 4, label: this.translateService.instant('Kademe'), icon: "fa-solid fa-stairs"},
    {id: 5, label: this.translateService.instant('İzin_Tipleri'), icon: "fa-solid fa-map-location-dot"},
    {id: 6, label: this.translateService.instant('Tatil_Tipleri'), icon: "fa-solid fa-plane-departure"},
    {id: 7, label: this.translateService.instant('Fazla_Mesai_Nedenleri'), icon: "fa-solid fa-business-time"},
    {id: 8, label: this.translateService.instant('PDKS_Bloklama'), icon: "fa-solid fa-lock"},
    {id: 9, label: this.translateService.instant('Form_Mailleri'), icon: "fa-solid fa-envelope-circle-check"},
    {id: 10, label: this.translateService.instant('Mazeret_Kartı_İzin_Atama'), icon: "fa-solid fa-id-card-clip"},
    {id: 11, label: this.translateService.instant('Vardiya_Planlama'), icon: "fa-solid fa-calendar-plus"},
    {id: 12, label: this.translateService.instant('Ara_Süreler'), icon: "fa-solid fa-right-left"},
    {id: 13, label: this.translateService.instant('Gün_Bölme'), icon: "fa-solid fa-hourglass-half"},
    {id: 14, label: this.translateService.instant('İzin_Ezme'), icon: "fa-solid fa-ban"},
    // {id: 15, label: this.translateService.instant('İlan'), icon: "fa-solid fa-clipboard"}
  ];

  visibleTabs: any[] = [];
  selectedTab: any;
  startIndex = 0;
  slideDirection: 'left' | 'right' = 'left'; // Animasyon yönü için değişken
  currentPage = 0; // Aktif sayfa numarası
  pageSize = 9; // Her sayfada gösterilecek öğe sayısı
  pages: number[] = []; // Sayfa numaraları dizisi

  constructor(
    private profileService: ProfileService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.updateVisibleTabs();
    this.createPages();
    this.changeTab(this.tabList[0]);
  }

  updateVisibleTabs() {
    this.visibleTabs = this.tabList.slice(this.startIndex, this.startIndex + this.pageSize);
  }

  createPages() {
    const totalPages = Math.ceil(this.tabList.length / this.pageSize);
    this.pages = Array(totalPages).fill(0).map((x, i) => i); // Sayfa numaraları oluşturuluyor
  }

  moveLeft() {
    if (this.startIndex > 0) {
      this.startIndex -= this.pageSize;
      this.slideDirection = 'left';
      this.currentPage = Math.floor(this.startIndex / this.pageSize);
      this.updateVisibleTabs();
    }
  }

  moveRight() {
    if (this.startIndex + this.pageSize < this.tabList.length) {
      this.startIndex += this.pageSize;
      this.slideDirection = 'right';
      this.currentPage = Math.floor(this.startIndex / this.pageSize);
      this.updateVisibleTabs();
    }
  }

  goToPage(pageIndex: number) {
    this.startIndex = pageIndex * this.pageSize;
    this.slideDirection = pageIndex > this.currentPage ? 'right' : 'left';
    this.currentPage = pageIndex;
    this.updateVisibleTabs();
  }

  changeTab(tab: any) {
    this.selectedTab = tab;
    console.log("Seçilen menü : ", this.selectedTab);
  }

  

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}
