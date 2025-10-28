import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRegistrationDialogComponent } from './view-registration-dialog.component';

describe('ViewRegistrationDialogComponent', () => {
  let component: ViewRegistrationDialogComponent;
  let fixture: ComponentFixture<ViewRegistrationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewRegistrationDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewRegistrationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
