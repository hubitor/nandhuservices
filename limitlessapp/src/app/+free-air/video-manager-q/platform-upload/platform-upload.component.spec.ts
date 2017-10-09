import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlatformUploadComponent } from './platform-upload.component';

describe('PlatformUploadComponent', () => {
  let component: PlatformUploadComponent;
  let fixture: ComponentFixture<PlatformUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlatformUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlatformUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
