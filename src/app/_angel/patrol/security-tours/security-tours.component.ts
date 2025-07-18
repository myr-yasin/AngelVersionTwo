import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { PatrolService } from '../patrol.service';
import { ResponseModel } from 'src/app/modules/auth/models/response-model';
import { ResponseDetailZ } from 'src/app/modules/auth/models/response-detail-z';
import { ChangeDetectionStrategy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-security-tours',
  templateUrl: './security-tours.component.html',
  styleUrls: ['./security-tours.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})

export class SecurityToursComponent implements OnInit, OnDestroy {

  private ngUnsubscribe = new Subject();

  targetList: any[] = [];
  selectedTour: any = null;
  selectTourId: number = 0;
  selectStationId: number = 0;
  allStation: any[];
  filteredStations: any[] = [];
  filteredTours: any[] = [];
  filteredTargets: any[] = [];
  tourNameInput: string = '';
  stationNameInput: string = '';
  targetNameInput: string = "";
  tourList: any[] = [];

  constructor(
    private patrol: PatrolService,
    private ref: ChangeDetectorRef,
    private toastrService: ToastrService
  ) { }


  ngOnInit(): void {
    this.getGuardTour();
    this.getGuardStation();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.ref.detectChanges();
    });
  }

  setGuardTour(): void {
    if (this.tourNameInput != '') {
      this.patrol.setGuardTour(this.tourNameInput).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
        const responsee = response[0].x;
        console.log("setGuardTour:", responsee);
        this.getGuardTour();
      });
    } else {
      this.toastrService.error(
        "Tur Adı Boş Geçilemez"
      );
    }
  }


  deleteGuardTour(tour: any): void {
    this.selectedTour = tour;
    this.selectTourId = tour.id;
    this.patrol.deleteGuardTour(this.selectTourId).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
      const responsee = response[0].x;
      console.log("deleteGuardTour:", responsee);
      this.getGuardTour();
    });
  }

  getGuardTour(): void {
    this.patrol.getGuardTour('0').pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
      this.tourList = response[0].x;
      this.filteredTours = [...this.tourList];
      console.log("getGuardTour:", this.tourList);
      this.tourNameInput = "";
      this.ref.detectChanges();
    });

  }

  getGuardStation(): void {
    this.patrol.getGuardStation('-1').pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
      this.allStation = response[0].x;
      this.filteredStations = [...this.allStation];
      // console.log("getGuardStation:", this.allStation);
      this.ref.detectChanges();
    });

  }

  getGuardStationForTour(turid: string) {
    /* Tur a ait olan istasyonlar   */
    this.patrol.getGuardStation(turid).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
      this.targetList = response[0].x;
      this.filteredTargets = [...this.targetList];
      this.ref.detectChanges();
      // console.log("TARGET LİST GET TOUR", this.targetList);
    });

  }

  getItem(tour: any) {
    this.selectedTour = tour;
    this.selectTourId = tour.id;
    //this.targetList = this.allStation.filter(item => item.id === tour.id);
    this.getGuardStationForTour(tour.id);
  }

  addTourStation(station: any) {
    if (this.selectTourId != 0) {
      const exists = this.targetList.some(item => item.id === station.id);
      if (!exists) {
        this.patrol.relation_i(station.id, this.selectTourId).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
          this.targetList = response[0].x;
          this.filteredTargets = [...this.targetList];
          this.ref.detectChanges();
          //console.log("relation_i TARGET:", this.targetList);
        })
      }
      else {
        this.toastrService.error(
          "Bu istasyon daha önce eklendi"
        );
      }
    } else {
      this.toastrService.error(
        "İstasyon eklemek istediğiniz turu seçin"
      );

    }
  }

  deleteTourStation(item: any) {
    const id = item.id;
    const hedefid = item.hedefid;
    console.log("SİL ID", id)
    console.log("SİL TUR İD", hedefid);
    console.log("deleteTourStation:", item);
    if (id !== undefined) {

      this.patrol.relation_d(id, hedefid).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
        this.targetList = response[0].x;
        this.filteredTargets = [...this.targetList];
        console.log("deleteTourStation: TARGET", this.targetList);
        this.ref.detectChanges();
      })
      this.getGuardStationForTour(hedefid);
    } else {
      const kaynakid = item.kaynakid;
      const hedefid = item.hedefid;
      console.log("kaynakid:", kaynakid);
      console.log("hedefid:", hedefid);
      console.log("Station:", item);
      this.patrol.relation_d(kaynakid, hedefid).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
        this.targetList = response[0].x;
        this.filteredTargets = [...this.targetList];
        console.log("deleteTourStation:", this.targetList);
        this.ref.detectChanges();
      })
      this.getGuardStationForTour(hedefid);
    }
  }

  filterTours() {
    const query = this.tourNameInput.toLowerCase();
    this.filteredTours = this.tourList.filter(item =>
      item.ad?.toLowerCase().includes(query)
    );
  }

  filterStation() {
    const query = this.stationNameInput.toLowerCase();
    this.filteredStations = this.allStation.filter(item =>
      item.kaynakad?.toLowerCase().includes(query)
    );
  }

  filterTargets() {
    const query = this.targetNameInput.toLowerCase();
    this.filteredTargets = this.targetList.filter(item =>
      item.kaynakad?.toLowerCase().includes(query)
    );
  }
  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}

