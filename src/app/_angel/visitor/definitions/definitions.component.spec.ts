import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefinitionsComponent } from './definitions.component';

describe('DefinitionsComponent', () => {
  let component: DefinitionsComponent;
  let fixture: ComponentFixture<DefinitionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DefinitionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DefinitionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
