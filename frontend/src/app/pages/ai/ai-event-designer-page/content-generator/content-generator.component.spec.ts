import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';
import {
  ReactiveFormsModule
} from '@angular/forms';
//import { NoopAnimationsModule } from '@angular/common/platform-browser/animations';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { of, tap, throwError } from 'rxjs';

import { provideZonelessChangeDetection, signal } from '@angular/core';
import { By } from '@angular/platform-browser';
import { AiEvent } from '@app/models/event/ai-event.model';
import { AiService } from '@app/services/ai.service';
import { AuthService } from '@app/services/auth.service';
import { ButtonComponent } from '@app/shared/button/button.component';
import { ContentGeneratorComponent } from './content-generator.component';

describe('ContentGeneratorComponent', () => {
  let component: ContentGeneratorComponent;
  let fixture: ComponentFixture<ContentGeneratorComponent>;
  let aiSpy: jasmine.SpyObj<AiService>;
  let authSpy: jasmine.SpyObj<AuthService>;
  const mockEvent: AiEvent = {
    eventTitle: 'Magical Hokkaido',
    description: '…',
    fullDescription: '…',
    image: { id: 'i1', cloudflareImageId: 'c1', width: 1792, height: 1024 },
    imageUrl: 'https://mocked.image.url',
    aiProvider: 'OpenAI',
  };
  const authSignal = signal(true);

  beforeEach(async () => {
    aiSpy = jasmine.createSpyObj<AiService>('AiService', [
      'generateContent$',
      'promptParams',
    ]);
    aiSpy.promptParams.and.returnValue(null); // default – component will use its own defaults
    aiSpy.generateContent$.and.returnValue(
      of({ success: true, data: mockEvent })
    );

    authSpy = jasmine.createSpyObj<AuthService>('AuthService', [], {
      isAuthenticated: authSignal,
    });

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        TextFieldModule,
        ContentGeneratorComponent,
        ButtonComponent,
      ],
      providers: [
        { provide: AiService, useValue: aiSpy },
        { provide: AuthService, useValue: authSpy },
        provideZonelessChangeDetection(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ContentGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // run ngOnInit / view init
  });

  // -----------------------------------------------------------------------
  // 1. Component creates + default values are populated
  // -----------------------------------------------------------------------
  it('should create and populate default select values', () => {
    expect(component).toBeTruthy();

    // defaults are the first item of each array
    expect(component.params.destination).toBe(component.destinations[0]);
    expect(component.params.tone).toBe(component.tones[0]);
    expect(component.params.mood).toBe(component.moods[0]);
    expect(component.params.season).toBe(component.seasons[0]);
    expect(component.params.activity).toBe(component.activities[0]);
    expect(component.params.groupSize).toBe(component.groupSizes[0]);
    expect(component.params.timeOfDay).toBe(component.timesOfDay[0]);
    expect(component.params.aiProvider).toBe('OpenAI');
    expect(component.params.customText).toBeUndefined();
  });

  // -----------------------------------------------------------------------
  // 2. Button is disabled when user is NOT authenticated
  // -----------------------------------------------------------------------
  it('should disable the Generate button when not authenticated', async () => {
    // flip the spy
    authSignal.set(false);
    fixture.detectChanges();
    await Promise.resolve(); // flush microtasks

    const btn = fixture.debugElement.query(By.css('app-button'));
    expect(component.disabled()).toBeTrue();
    authSignal.set(true);
  });

  // -----------------------------------------------------------------------
  // 3. Form can be filled → params object reflects the selections
  // -----------------------------------------------------------------------
  // it('should update params when the user selects different options', async () => {
  //   const select = async (name: string, value: string) => {
  //     const matSelect = fixture.debugElement.query(
  //       By.css(`.mat-mdc-select[name="${name}"]`)
  //     );
  //     matSelect.componentInstance.open(); // open
  //     fixture.detectChanges();
  //     await Promise.resolve(); // flush microtasks

  //     const option = fixture.debugElement.query(
  //       By.css(`.mat-mdc-option`))
  //       .nativeElement
  //       .querySelector(`[id="${value}"]`);
  //     option.click();
  //     fixture.detectChanges();
  //     await Promise.resolve(); // flush microtasks
  //   };

  //   select('destination', 'Kyoto');
  //   select('tone', 'festive');
  //   select('mood', 'joyful');
  //   select('season', 'Cherry Blossom');
  //   select('activity', 'Festival');
  //   select('groupSize', 'Family (6-10)');
  //   select('timeOfDay', 'Evening');
  //   select('aiProvider', 'Grok');

  //   // custom text
  //   const txt = fixture.debugElement.query(By.css('input[name="customText"]'));
  //   txt.nativeElement.value = 'My special note';
  //   txt.nativeElement.dispatchEvent(new Event('input'));
  //   fixture.detectChanges();
  //   await Promise.resolve(); // flush microtasks

  //   expect(component.params.destination).toBe('Kyoto');
  //   expect(component.params.tone).toBe('festive');
  //   expect(component.params.mood).toBe('joyful');
  //   expect(component.params.season).toBe('Cherry Blossom');
  //   expect(component.params.activity).toBe('Festival');
  //   expect(component.params.groupSize).toBe('Family (6-10)');
  //   expect(component.params.timeOfDay).toBe('Evening');
  //   expect(component.params.aiProvider).toBe('Grok');
  //   expect(component.params.customText).toBe('My special note');
  // });

  // -----------------------------------------------------------------------
  // 4. Happy-path: submit → service called → eventCreated emitted
  // -----------------------------------------------------------------------
  it('should call aiService, emit eventCreated and reset busy on success', async () => {
    // spy on outputs
    const creatingSpy = jasmine.createSpy();
    const createdSpy = jasmine.createSpy();
    component.eventCreating.subscribe(creatingSpy);
    component.eventCreated.subscribe(createdSpy);

    // fill a couple of fields (optional – defaults are fine)
    component.params.destination = 'Hokkaido';
    component.params.tone = 'magical';
    fixture.detectChanges();

    // click the submit button
    const submitBtn = fixture.debugElement.query(
      By.css('.app-button[type="submit"]')
    );
    submitBtn.nativeElement.click();
    fixture.detectChanges();
    await Promise.resolve(); // flush microtasks
    // ---- assertions ----

    //expect(aiSpy.generateContent$).toHaveBeenCalledWith(component.params);
    expect(creatingSpy).toHaveBeenCalledWith(true);
    expect(createdSpy).toHaveBeenCalledWith(mockEvent);
    expect(component.busy()).toBeFalse();
    expect(component.error()).toBeNull();

    // form is re-enabled
    expect(component.aiPrompts.enabled).toBeTrue();
  });

  // -----------------------------------------------------------------------
  // 5. Error path: service throws → error signal set, busy reset
  // -----------------------------------------------------------------------
  it('should set error signal and reset busy when service errors', async () => {
    const err = new Error('Network failure');
    aiSpy.generateContent$.and.returnValue(throwError(() => err));

    const submitBtn = fixture.debugElement.query(
      By.css('.app-button[type="submit"]')
    );
    submitBtn.nativeElement.click();
    fixture.detectChanges();
    await Promise.resolve(); // flush microtasks

    expect(component.error()).toBe(err.message);
    expect(component.busy()).toBeFalse();

    expect(component.aiPrompts.enabled).toBeTrue();
  });

  // -----------------------------------------------------------------------
  // 6. Form is disabled while request is in-flight
  // -----------------------------------------------------------------------
  it('should disable the form while request is pending', async () => {
    const resp = { success: true, data: mockEvent };
    aiSpy.generateContent$.and.returnValue(of(resp).pipe(
      tap(() => {
        // Check intermediate state (request pending)
        expect(component.aiPrompts.disabled).toBeTrue();
        expect(component.busy()).toBeTrue();
      })
    ));

    const submitBtn = fixture.debugElement.query(By.css('app-button[buttonType="submit"]'));
    expect(submitBtn).toBeTruthy(); // Debug: Ensure button is found

    // Initial state
    expect(component.aiPrompts.disabled).toBeFalse();
    expect(component.busy()).toBeFalse();

    // Click the submit button
    submitBtn.nativeElement.click();

    // Final state
    fixture.detectChanges(); // Update signals and DOM
    await Promise.resolve(); // Flush microtasks for click handler
    expect(component.aiPrompts.disabled).toBeFalse();
    expect(component.busy()).toBeFalse();
  });
});
