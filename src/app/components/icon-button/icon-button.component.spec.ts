import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconButtonComponent } from './icon-button.component';
import { By } from '@angular/platform-browser';

describe('IconButtonComponent', () => {
  let component: IconButtonComponent;
  let fixture: ComponentFixture<IconButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ IconButtonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IconButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Deberia crearse', () => {
    expect(component).toBeTruthy();
  });

  it('Deberia asignar los valores de entrada correctamente', async () => {
    component.iconClass = 'test-icon';
    component.type = 'submit';
    fixture.detectChanges(); 
    
    const buttonElement = fixture.debugElement.query(By.css('button'));  
    expect(buttonElement.nativeElement.type).toBe('submit');

    const iconElement = fixture.debugElement.query(By.css('button i'));
    expect(iconElement.nativeElement.classList).toContain('test-icon');
  });

  it('Debería emitir buttonClick al clickarlo', () => {
    spyOn(component.buttonClick, 'emit'); 
    
    const buttonElement = fixture.debugElement.query(By.css('button')); 
    buttonElement.triggerEventHandler('click', null);
    
    expect(component.buttonClick.emit).toHaveBeenCalled(); 
  });

  it('Debería llamar a onClick al clickarlo', () => {
    spyOn(component, 'onClick'); 

    const buttonElement = fixture.debugElement.query(By.css('button'));
    buttonElement.triggerEventHandler('click', null); 

    expect(component.onClick).toHaveBeenCalled(); 
  });
});
