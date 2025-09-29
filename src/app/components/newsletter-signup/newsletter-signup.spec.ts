import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsletterSignup } from './newsletter-signup';

describe('NewsletterSignup', () => {
  let component: NewsletterSignup;
  let fixture: ComponentFixture<NewsletterSignup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewsletterSignup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewsletterSignup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
