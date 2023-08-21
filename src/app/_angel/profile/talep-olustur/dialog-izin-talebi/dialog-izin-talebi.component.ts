// import { formatDate } from '@angular/common';
// import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { TranslateService } from '@ngx-translate/core';
// import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
// import { ResponseDetailZ } from 'src/app/modules/auth/models/response-detail-z';
// import { ResponseModel } from 'src/app/modules/auth/models/response-model';
// import { HelperService } from 'src/app/_helpers/helper.service';
// import { OKodFieldsModel } from '../../models/oKodFields';
// import { UserInformation } from '../../models/user-information';
// import { ProfileService } from '../../profile.service';

// @Component({
//   selector: 'app-dialog-izin-talebi',
//   templateUrl: './dialog-izin-talebi.component.html',
//   styleUrls: ['./dialog-izin-talebi.component.scss']
// })
// export class DialogIzinTalebiComponent implements OnInit, OnDestroy {
//   private ngUnsubscribe = new Subject();
//   @Output() vacationFormIsSend: EventEmitter<void> = new EventEmitter<void>();
//   @Input() closedForm: BehaviorSubject<boolean>;


//   vacationForm : FormGroup;
//   vacationReasons : any[] = [];
//   vacationFormValues : any;
//   izinKalan: number;
//   isHourly: boolean = false;

//   currentDate = new Date(Date.now());
//   selectedType  : any;
//   userInformation: UserInformation;
//   calcTimeDesc: any;
//   calcTimeValue: any;
//   currentSicilId: any;
//   formDisabled: boolean = true;

//   dropdownEmptyMessage : any = this.translateService.instant('PUBLIC.DATA_NOT_FOUND');
//   constructor(
//     private profileService : ProfileService,
//     private formBuilder : FormBuilder,
//     public helperService : HelperService,
//     private translateService : TranslateService,
//     private ref : ChangeDetectorRef
//   ) { }

//   ngOnInit(): void {
//     this.currentSicilId = this.helperService.userLoginModel.xSicilID
//     this.createVacationForm();
//     this.getVacationReason();
//     this.getUserInformation();
//     this.valueChanges();
//     this.dateChanges();
//     this.closedFormDialog();
//   }

//   createVacationForm() {
//     this.vacationForm = this.formBuilder.group({
//       tip : ['', [Validators.required]],
//       bastarih : [formatDate(this.currentDate, 'yyyy-MM-dd', 'en'), [Validators.required]],
//       bassaat : [ {value: '', disabled: this.formDisabled }, [Validators.required]],
//       bittarih : [formatDate(this.currentDate, 'yyyy-MM-dd', 'en'), [Validators.required]],
//       bitsaat : [ {value: '', disabled: this.formDisabled }, [Validators.required]],
//       aciklama : ['', [Validators.required]],
//       izinadresi : ['', [Validators.required]],
//       gunluksaatlik : ['gunluk'],
//     });
//   }

//   getVacationReason() {
//     this.profileService.getOKodField('cbo_izintipleri').pipe(takeUntil(this.ngUnsubscribe)).subscribe((response : ResponseModel<OKodFieldsModel, ResponseDetailZ>[]) => {
//       const data = response[0].x;
//       const message = response[0].z;

//       if (message.islemsonuc == 1) {
//         this.vacationReasons = data;
//         console.log("İzin Tipleri : ", data);
//       }

//       this.ref.detectChanges();
//     });
//   }

//   getVacationFormValues() {
//     this.vacationFormValues = Object.assign({}, this.vacationForm.value);
//     console.log("İzin Formu :", this.vacationFormValues);

//     this.postVacationForm();
//   }

//   getUserInformation() {
//     this.profileService.getUserInformation().pipe(takeUntil(this.ngUnsubscribe)).subscribe((response : ResponseModel<UserInformation,ResponseDetailZ>[]) => {
//       let data = response[0].x;
//       let message = response[0].z;

//       console.log("Sicil Bilgiler :", data);
      

//       if (message.islemsonuc == 1) {
//         this.izinKalan = data[0].Kalan;
//         this.userInformation = data[0];
//         console.log("USER :", this.izinKalan);
//       }
      
      
//       this.ref.detectChanges();
//     })
//   }

//   valueChanges() {
//     this.vacationForm.get("gunluksaatlik")?.valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe(item => {
//       console.log("item : ",item);
//       if (item == 'saatlik') {
//         this.isHourly = true;
//         this.vacationForm.get("bassaat")?.enable();
//         this.vacationForm.get("bitsaat")?.enable();
//         this.formDisabled = false;

//       } else {

//         this.isHourly = false;
//         this.vacationForm.get("bassaat")?.disable();
//         this.vacationForm.get("bitsaat")?.disable();
//         this.formDisabled = true;
//       }
//     });
//   }

//   postVacationForm() {
//     this.profileService.postOvertimeOrVacationDemand('izin', this.vacationFormValues).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response : any) => {
//       console.log("İzin Form gönderildi :", response);

//       this.vacationFormIsSend.emit();
//       this.vacationForm.reset();
//     })
//   }

//   dateChanges() {
//     this.vacationForm.valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe(item => {
//       let formValue = Object.assign({}, this.vacationForm.value);
//       formValue.siciller = this.currentSicilId;
//       if (!formValue.tip) {
//         this.calcTimeDesc = 'İzin Tipi Seçmelisiniz!'
//       } else if (formValue.gunluksaatlik == 'saatlik' && (!formValue.bassaat || !formValue.bitsaat)){
//         this.calcTimeDesc = 'Saat Bilgisi Girimelisiniz!'
//       } else {
//         this.calcTimeDesc = '';
//         this.calculateVacationTime(formValue);
//       }
//     })
//   }

//   calculateVacationTime(form: any) {
//     this.profileService.calculateVacationTime(form).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response : any) => {
//       const data = response[0].x;
//       const apiMessage = response[0].z;

//       if (apiMessage.islemsonuc == 1) {
//         this.calcTimeValue = data[0].izinhesapsure;

//       } else if (apiMessage.islemsonuc == -11) {
//         this.calcTimeDesc = data[0].izinhesapsure;
//       }
//       console.log("İzin Süresi Hesaplama :", response);
      

//       this.ref.detectChanges();
//     });
//   }

//   closedFormDialog() {
//     this.closedForm.subscribe(_ => {
//       console.log("Closed Form : ", _);
//       this.vacationForm.reset();
//     });
//   }

//   ngOnDestroy(): void {
//     this.ngUnsubscribe.next(true);
//     this.ngUnsubscribe.complete();
//   }
// }



import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StepperOrientation } from '@angular/material/stepper';
import { BehaviorSubject, map, Observable, Subject, takeUntil } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ProfileService } from '../../profile.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/modules/auth';
import { TranslateService } from '@ngx-translate/core';
import { formatDate } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { UserInformation } from '../../models/user-information';
import { ResponseModel } from 'src/app/modules/auth/models/response-model';
import { ResponseDetailZ } from 'src/app/modules/auth/models/response-detail-z';
import { OKodFieldsModel } from '../../models/oKodFields';
import { HelperService } from 'src/app/_helpers/helper.service';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-dialog-izin-talebi',
  templateUrl: './dialog-izin-talebi.component.html',
  styleUrls: ['./dialog-izin-talebi.component.scss'],
  animations: [
    trigger("fileUploaded", [
      state("uploaded", style({ transform: "translateY(0)" })),
      transition(":enter", [
        style({ transform: 'translateY(-50%)' }),
        animate("500ms")
      ]),
      transition(':leave', [
        animate(200, style({ transform: 'translateY(-100%)' }))
      ])
    ])
  ]
})
export class DialogIzinTalebiComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  @Input() closedForm: BehaviorSubject<boolean>;

  stepperFields: any[] = [
    { class: 'stepper-item current', number: 1, title: this.translateService.instant('IZIN_TALEP_DIALOG.STEPPER.HEADER_1'), desc: this.translateService.instant('IZIN_TALEP_DIALOG.STEPPER.MESSAGE_1') },
    { class: 'stepper-item', number: 2, title: this.translateService.instant('IZIN_TALEP_DIALOG.STEPPER.HEADER_2'), desc: this.translateService.instant('IZIN_TALEP_DIALOG.STEPPER.MESSAGE_2') },
    { class: 'stepper-item', number: 3, title: this.translateService.instant('IZIN_TALEP_DIALOG.STEPPER.HEADER_3'), desc: this.translateService.instant('IZIN_TALEP_DIALOG.STEPPER.MESSAGE_3') },
    { class: 'stepper-item', number: 4, title: this.translateService.instant('IZIN_TALEP_DIALOG.STEPPER.HEADER_4'), desc: this.translateService.instant('IZIN_TALEP_DIALOG.STEPPER.MESSAGE_4') },
    { class: 'stepper-item', number: 5, title: this.translateService.instant('IZIN_TALEP_DIALOG.STEPPER.HEADER_6'), desc: this.translateService.instant('IZIN_TALEP_DIALOG.STEPPER.MESSAGE_6') },
    { class: 'stepper-item', number: 6, title: this.translateService.instant('IZIN_TALEP_DIALOG.STEPPER.HEADER_5'), desc: this.translateService.instant('IZIN_TALEP_DIALOG.STEPPER.MESSAGE_5') },
  ];

  formsCount: any = 7;
  currentStep$: BehaviorSubject<number> = new BehaviorSubject(1);
  currentItem: any = this.stepperFields[0];
  vacationFormValues: any;

  // Stepper responsive 
  stepperOrientation: Observable<StepperOrientation>;

  vacationForm: FormGroup;
  visitType: any;
  personInformationForm: FormGroup;
  personInformation: any;
  uploadedFiles: any[] = [];
  uploadedFile: any;



  currentDate = new Date(Date.now());
  formDisabled: boolean = true;
  isHourly: boolean = false;
  calcTimeDesc: any;
  calcTimeValue: any;
  currentSicilId: any;
  izinKalan: number;
  userInformation: UserInformation;
  vacationReasons : any[] = [];
  selectedType  : any;
  dropdownEmptyMessage : any = this.translateService.instant('PUBLIC.DATA_NOT_FOUND');
  @Output() vacationFormIsSend: EventEmitter<void> = new EventEmitter<void>();
  formId: any;
  files: any;

  constructor(
    private formBuilder: FormBuilder,
    private breakpointObserver: BreakpointObserver,
    private profileService: ProfileService,
    private toastrService : ToastrService,
    public authService : AuthService,
    private translateService : TranslateService,
    private sanitizer: DomSanitizer,
    private helperService : HelperService,
    private ref: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.currentSicilId = this.helperService.userLoginModel.xSicilID

    this.setResponsiveForm();
    this.createFormGroup();
    this.closedFormDialog();

    this.getVacationReason();
    this.getUserInformation();
    this.valueChanges();
    this.dateChanges();
  }

  canProceedToNextStep(): boolean {
    let vacationFormValues = Object.assign({}, this.vacationForm.value);

    this.vacationFormValues = vacationFormValues;
    console.log("Form Values : ", this.vacationFormValues);
    
    if (this.currentStep$.value === 1) {
      return this.vacationForm.controls['gunluksaatlik'].valid;

    } else if(this.currentStep$.value === 2) {
      return this.vacationForm.controls['tip'].valid;
      
    } else if(this.currentStep$.value === 4) {
      return this.vacationForm.valid;

    } else if(this.currentStep$.value === 5) {
      this.postVacationForm(vacationFormValues);
      return true;
    }

    return true;
  }

  canProceedToPrevStep(): boolean {
    if (this.currentStep$.value === 1) {
      return this.vacationForm.controls['gunluksaatlik'].valid;
    } 
    else if(this.currentStep$.value === 2) {
      return this.vacationForm.controls['tip'].valid;
    }
    return true;
  }

  
  nextStep() {
    if (!this.canProceedToNextStep()) {
      this.toastrService.error("Formu Doldurmalısınız", "HATA");
      return;
    }
  
    const nextStep = this.currentStep$.value + 1;
    if (nextStep <= this.formsCount) {
      this.currentStep$.next(nextStep);
      this.currentItem = this.stepperFields[nextStep - 1];
      this.currentItem.class = "stepper-item current";
      if (nextStep > 1) {
        this.stepperFields[nextStep - 2].class = "stepper-item completed";
      }
    }
  }
  
  prevStep() {
    if (this.currentStep$.value === 2) {
      this.vacationForm.reset();
    }
    
    const prevStep = this.currentStep$.value - 1;
    if (prevStep === 0) {
      return;
    }
    this.currentStep$.next(prevStep);
    this.currentItem = this.stepperFields[prevStep - 1];
    let prevItem = this.stepperFields[prevStep];
    this.currentItem.class = "stepper-item current";
    prevItem.class = "stepper-item";
  }
  

  // Formların oluşması
  createFormGroup() {
    this.vacationForm = this.formBuilder.group({
      tip : ['', [Validators.required]],
      bastarih : [formatDate(this.currentDate, 'yyyy-MM-dd', 'en'), [Validators.required]],
      bassaat : [ {value: '', disabled: this.formDisabled }, [Validators.required]],
      bittarih : [formatDate(this.currentDate, 'yyyy-MM-dd', 'en'), [Validators.required]],
      bitsaat : [ {value: '', disabled: this.formDisabled }, [Validators.required]],
      aciklama : ['', [Validators.required]],
      izinadresi : ['', [Validators.required]],
      gunluksaatlik : [null, Validators.required],
      file : [null]
    });
  }


  // Stepper'ı yataydan dikeye çevir
  setResponsiveForm() {
    this.stepperOrientation = this.breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
  }

  getFile(event: any) {
    let files: FileList = event.target.files[0];
    console.log(files);
    this.files = files;

    for (let file of event.target.files) {
      this.readAndPushFile(file);
    }
  }

  readAndPushFile(file: File) {
    let fileSize: any = (file.size / 1024).toFixed(1);
    let fileSizeType = 'KB';
    if (fileSize >= 1024) {
      fileSize = (fileSize / 1024).toFixed(1);
      fileSizeType = 'MB';
    }

    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const url = this.sanitizer.bypassSecurityTrustResourceUrl(event.target?.result as string);
      this.uploadedFile = {
        name : file.name,
        type : file.type,
        url : url,
        fileSize : fileSize,
        fileSizeType : fileSizeType
      };

      console.log("Uploaded File : ", this.uploadedFile);
      this.ref.detectChanges();
    };    
  }

  removeUploadedFile(item: any, file: any) {
    const index = item.files.indexOf(file);
    if (index !== -1) {
      item.files.splice(index, 1);
    }
  }

  closedFormDialog() {
    this.closedForm.subscribe(_ => {
      console.log("Closed Form : ", _);
      this.vacationForm.reset();
      this.selectedType = '';
      this.uploadedFile = '';
      this.resetStepperFieldsClass();
      this.currentStep$.next(1);
      this.currentItem = this.stepperFields[0];
      // this.vacationFormIsSend.emit();
    });
  }
  

  resetStepperFieldsClass() {
    this.stepperFields.forEach((item, index) => {
      item.class = index === 0 ? "stepper-item current" : "stepper-item";
    });
  }

  getFormValues() {
    let vacationFormValues = Object.assign({}, this.vacationForm.value);
    console.log("Form Values : ", vacationFormValues);

    // this.postVacationForm(vacationFormValues);
    // vacationFormValues.file = this.uploadedFile.url.changingThisBreaksApplicationSecurity;

    this.postVacationFile(this.files, this.formId);
  }

  valueChanges() {
    this.vacationForm.get("gunluksaatlik")?.valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe(item => {
      console.log("item : ", item);
      if (item == 'saatlik') {
        this.isHourly = true;
        this.vacationForm.get("bassaat")?.enable();
        this.vacationForm.get("bitsaat")?.enable();
        this.formDisabled = false;

      } else {

        this.isHourly = false;
        this.vacationForm.get("bassaat")?.disable();
        this.vacationForm.get("bitsaat")?.disable();
        this.formDisabled = true;
      }
    });
  }

  dateChanges() {
    this.vacationForm.valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe(item => {
      let formValue = Object.assign({}, this.vacationForm.value);
      formValue.siciller = this.currentSicilId;
      if (!formValue.tip) {
        this.calcTimeDesc = 'İzin Tipi Seçmelisiniz!'
      } else if (formValue.gunluksaatlik == 'saatlik' && (!formValue.bassaat || !formValue.bitsaat)) {
        this.calcTimeDesc = 'Saat Bilgisi Girimelisiniz!'
      } else {
        this.calcTimeDesc = '';
        this.calculateVacationTime(formValue);
      }
    })
  }

  calculateVacationTime(form: any) {
    this.profileService.calculateVacationTime(form).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: any) => {
      const data = response[0].x;
      const apiMessage = response[0].z;

      if (apiMessage.islemsonuc == 1) {
        this.calcTimeValue = data[0].izinhesapsure;

      } else if (apiMessage.islemsonuc == -11) {
        this.calcTimeDesc = data[0].izinhesapsure;
      }
      console.log("İzin Süresi Hesaplama :", response);


      this.ref.detectChanges();
    });
  }

  getUserInformation() {
    this.profileService.getUserInformation().pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: ResponseModel<UserInformation, ResponseDetailZ>[]) => {
      let data = response[0].x;
      let message = response[0].z;

      console.log("Sicil Bilgiler :", data);


      if (message.islemsonuc == 1) {
        this.izinKalan = data[0].Kalan;
        this.userInformation = data[0];
        console.log("USER :", this.izinKalan);
      }


      this.ref.detectChanges();
    })
  }

  getVacationReason() {
    this.profileService.getOKodField('cbo_izintipleri').pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: ResponseModel<OKodFieldsModel, ResponseDetailZ>[]) => {
      const data = response[0].x;
      const message = response[0].z;

      if (message.islemsonuc == 1) {
        this.vacationReasons = data;
        console.log("İzin Tipleri : ", data);
      }

      this.ref.detectChanges();
    });
  }

  postVacationForm(vacationFormValues : any) {
    this.profileService.postOvertimeOrVacationDemand('izin', vacationFormValues).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: any) => {
      const data = response[0].x;
      const apiMessage = response[0].z;
      const spMessage = response[0].m[0];

      console.log("İzin Form gönderildi :", response);
      if (data[0].sonuc == 1) {
        // this.vacationFormIsSend.emit();
        // this.vacationForm.reset();
        this.formId = data[0].formid;
        
        this.toastrService.success(
          this.translateService.instant('TOASTR_MESSAGE.TALEP_GONDERILDI'),
          this.translateService.instant('TOASTR_MESSAGE.BASARILI')
        );
      } else {
        this.toastrService.error(data[0]?.izinhesapsure, this.translateService.instant('TOASTR_MESSAGE.HATA'));
        this.prevStep();
        
      }

      this.ref.detectChanges();
    })
  }


  postVacationFile(file : any, formId : any) {
    this.profileService.postVacationFile(file, formId, 'izin').pipe(takeUntil(this.ngUnsubscribe)).subscribe((response : any) => {
      console.log("İzin için dosya gönderildi : ", response);
    });
  }
  


  ngOnDestroy(): void {
    this.vacationForm.reset();
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}