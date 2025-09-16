import { Component, Input, AfterViewInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

declare const feather: any;

@Component({
  selector: 'app-feather-icon',
  standalone: true,
  imports: [CommonModule],
  template: `<i [attr.data-feather]="name"></i>`,
  styles: [`
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 1em;
      height: 1em;
      font-size: inherit;
      color: inherit;
      vertical-align: middle;
    }
    
    i {
      width: 100%;
      height: 100%;
    }
  `]
})
export class FeatherIconComponent implements AfterViewInit {
  @Input() name!: string;
  @Input() size?: string;

  constructor(private elementRef: ElementRef) {}

  ngAfterViewInit() {
    if (this.size) {
      const element = this.elementRef.nativeElement;
      element.style.fontSize = this.size;
    }
    // Replace the icon
    feather.replace({
      width: '100%',
      height: '100%'
    });
  }
}