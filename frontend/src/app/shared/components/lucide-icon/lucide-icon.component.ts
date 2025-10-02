import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lucide-icon',
  standalone: true,
  imports: [CommonModule],
  template: `
    <ng-container [ngSwitch]="name">
      <svg *ngSwitchCase="'activity'" [attr.width]="size" [attr.height]="size" [attr.stroke]="color" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
      </svg>
      <svg *ngSwitchCase="'menu'" [attr.width]="size" [attr.height]="size" [attr.stroke]="color" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="4" x2="20" y1="12" y2="12"/>
        <line x1="4" x2="20" y1="6" y2="6"/>
        <line x1="4" x2="20" y1="18" y2="18"/>
      </svg>
      <svg *ngSwitchCase="'chevron-right'" [attr.width]="size" [attr.height]="size" [attr.stroke]="color" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="9,18 15,12 9,6"/>
      </svg>
      <svg *ngSwitchCase="'chevron-left'" [attr.width]="size" [attr.height]="size" [attr.stroke]="color" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="15,18 9,12 15,6"/>
      </svg>
      <svg *ngSwitchCase="'chevron-down'" [attr.width]="size" [attr.height]="size" [attr.stroke]="color" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="6,9 12,15 18,9"/>
      </svg>
      <svg *ngSwitchCase="'lock'" [attr.width]="size" [attr.height]="size" [attr.stroke]="color" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
        <circle cx="12" cy="16" r="1"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
      <svg *ngSwitchCase="'bell'" [attr.width]="size" [attr.height]="size" [attr.stroke]="color" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
      </svg>
      <svg *ngSwitchCase="'mail'" [attr.width]="size" [attr.height]="size" [attr.stroke]="color" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2"/>
        <path d="m22 7-10 5L2 7"/>
      </svg>
      <svg *ngSwitchCase="'user'" [attr.width]="size" [attr.height]="size" [attr.stroke]="color" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
      <svg *ngSwitchCase="'settings'" [attr.width]="size" [attr.height]="size" [attr.stroke]="color" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
      </svg>
      <svg *ngSwitchCase="'log-out'" [attr.width]="size" [attr.height]="size" [attr.stroke]="color" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
        <polyline points="16,17 21,12 16,7"/>
        <line x1="21" x2="9" y1="12" y2="12"/>
      </svg>
      <svg *ngSwitchCase="'eye'" [attr.width]="size" [attr.height]="size" [attr.stroke]="color" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
      <svg *ngSwitchCase="'plus'" [attr.width]="size" [attr.height]="size" [attr.stroke]="color" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="12" x2="12" y1="5" y2="19"/>
        <line x1="5" x2="19" y1="12" y2="12"/>
      </svg>
      <svg *ngSwitchCase="'check'" [attr.width]="size" [attr.height]="size" [attr.stroke]="color" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20,6 9,17 4,12"/>
      </svg>
      <svg *ngSwitchCase="'user-plus'" [attr.width]="size" [attr.height]="size" [attr.stroke]="color" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <line x1="19" x2="19" y1="8" y2="14"/>
        <line x1="22" x2="16" y1="11" y2="11"/>
      </svg>
      <svg *ngSwitchCase="'dollar-sign'" [attr.width]="size" [attr.height]="size" [attr.stroke]="color" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="12" x2="12" y1="1" y2="23"/>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
      <svg *ngSwitchCase="'download'" [attr.width]="size" [attr.height]="size" [attr.stroke]="color" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="7,10 12,15 17,10"/>
        <line x1="12" x2="12" y1="15" y2="3"/>
      </svg>
      <svg *ngSwitchCase="'search'" [attr.width]="size" [attr.height]="size" [attr.stroke]="color" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="8"/>
        <path d="M21 21l-4.35-4.35"/>
      </svg>
      <svg *ngSwitchCase="'unlock'" [attr.width]="size" [attr.height]="size" [attr.stroke]="color" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
        <circle cx="12" cy="16" r="1"/>
        <path d="M7 11V7a5 5 0 0 1 9.9-1"/>
      </svg>
      <svg *ngSwitchCase="'filter'" [attr.width]="size" [attr.height]="size" [attr.stroke]="color" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46"/>
      </svg>
      <svg *ngSwitchCase="'x'" [attr.width]="size" [attr.height]="size" [attr.stroke]="color" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" x2="6" y1="6" y2="18"/>
        <line x1="6" x2="18" y1="6" y2="18"/>
      </svg>
      <svg *ngSwitchCase="'smartphone'" [attr.width]="size" [attr.height]="size" [attr.stroke]="color" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
        <line x1="12" x2="12" y1="18" y2="18"/>
      </svg>
      <svg *ngSwitchCase="'credit-card'" [attr.width]="size" [attr.height]="size" [attr.stroke]="color" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
        <line x1="1" x2="23" y1="10" y2="10"/>
      </svg>
      <svg *ngSwitchCase="'refresh-cw'" [attr.width]="size" [attr.height]="size" [attr.stroke]="color" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="23,4 23,10 17,10"/>
        <polyline points="1,20 1,14 7,14"/>
        <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>
      </svg>
      <svg *ngSwitchCase="'box'" [attr.width]="size" [attr.height]="size" [attr.stroke]="color" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
        <polyline points="3.27,6.96 12,12.01 20.73,6.96"/>
        <line x1="12" x2="12" y1="22.08" y2="12"/>
      </svg>
      <svg *ngSwitchCase="'shield'" [attr.width]="size" [attr.height]="size" [attr.stroke]="color" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
      <svg *ngSwitchCase="'users'" [attr.width]="size" [attr.height]="size" [attr.stroke]="color" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
      <svg *ngSwitchCase="'briefcase'" [attr.width]="size" [attr.height]="size" [attr.stroke]="color" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
      </svg>
      <svg *ngSwitchCase="'grid'" [attr.width]="size" [attr.height]="size" [attr.stroke]="color" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="3" width="7" height="7"/>
        <rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/>
        <rect x="3" y="14" width="7" height="7"/>
      </svg>
      <svg *ngSwitchCase="'database'" [attr.width]="size" [attr.height]="size" [attr.stroke]="color" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <ellipse cx="12" cy="5" rx="9" ry="3"/>
        <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5"/>
        <path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3"/>
      </svg>
      <svg *ngSwitchCase="'file-text'" [attr.width]="size" [attr.height]="size" [attr.stroke]="color" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14,2 14,8 20,8"/>
        <line x1="16" x2="8" y1="13" y2="13"/>
        <line x1="16" x2="8" y1="17" y2="17"/>
        <polyline points="10,9 9,9 8,9"/>
      </svg>
      <svg *ngSwitchCase="'edit'" [attr.width]="size" [attr.height]="size" [attr.stroke]="color" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
      </svg>
      <svg *ngSwitchCase="'trash-2'" [attr.width]="size" [attr.height]="size" [attr.stroke]="color" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="3,6 5,6 21,6"/>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
        <line x1="10" x2="10" y1="11" y2="17"/>
        <line x1="14" x2="14" y1="11" y2="17"/>
      </svg>
      <svg *ngSwitchCase="'pencil'" [attr.width]="size" [attr.height]="size" [attr.stroke]="color" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
      </svg>
      <svg *ngSwitchCase="'trash'" [attr.width]="size" [attr.height]="size" [attr.stroke]="color" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="3,6 5,6 21,6"/>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
        <line x1="10" x2="10" y1="11" y2="17"/>
        <line x1="14" x2="14" y1="11" y2="17"/>
      </svg>
      <svg *ngSwitchCase="'shield-check'" [attr.width]="size" [attr.height]="size" [attr.stroke]="color" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <path d="M9 12l2 2 4-4"/>
      </svg>
      <svg *ngSwitchCase="'trending-up'" [attr.width]="size" [attr.height]="size" [attr.stroke]="color" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="22,7 13.5,15.5 8.5,10.5 2,17"/>
        <polyline points="16,7 22,7 22,13"/>
      </svg>
      <svg *ngSwitchCase="'check-circle'" [attr.width]="size" [attr.height]="size" [attr.stroke]="color" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
        <polyline points="22,4 12,14.01 9,11.01"/>
      </svg>
      <svg *ngSwitchCase="'x-circle'" [attr.width]="size" [attr.height]="size" [attr.stroke]="color" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="15" x2="9" y1="9" y2="15"/>
        <line x1="9" x2="15" y1="9" y2="15"/>
      </svg>
      <svg *ngSwitchCase="'alert-triangle'" [attr.width]="size" [attr.height]="size" [attr.stroke]="color" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        <line x1="12" x2="12" y1="9" y2="13"/>
        <line x1="12" x2="12.01" y1="17" y2="17"/>
      </svg>
      <svg *ngSwitchCase="'percent'" [attr.width]="size" [attr.height]="size" [attr.stroke]="color" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="19" x2="5" y1="5" y2="19"/>
        <circle cx="6.5" cy="6.5" r="2.5"/>
        <circle cx="17.5" cy="17.5" r="2.5"/>
      </svg>
      <svg *ngSwitchCase="'target'" [attr.width]="size" [attr.height]="size" [attr.stroke]="color" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <circle cx="12" cy="12" r="6"/>
        <circle cx="12" cy="12" r="2"/>
      </svg>
      <svg *ngSwitchCase="'pause'" [attr.width]="size" [attr.height]="size" [attr.stroke]="color" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="6" y="4" width="4" height="16"/>
        <rect x="14" y="4" width="4" height="16"/>
      </svg>
      <svg *ngSwitchCase="'loader'" [attr.width]="size" [attr.height]="size" [attr.stroke]="color" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="12" x2="12" y1="2" y2="6"/>
        <line x1="12" x2="12" y1="18" y2="22"/>
        <line x1="4.93" x2="7.76" y1="4.93" y2="7.76"/>
        <line x1="16.24" x2="19.07" y1="16.24" y2="19.07"/>
        <line x1="2" x2="6" y1="12" y2="12"/>
        <line x1="18" x2="22" y1="12" y2="12"/>
        <line x1="4.93" x2="7.76" y1="19.07" y2="16.24"/>
        <line x1="16.24" x2="19.07" y1="7.76" y2="4.93"/>
      </svg>
      <svg *ngSwitchCase="'map-pin'" [attr.width]="size" [attr.height]="size" [attr.stroke]="color" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
      <svg *ngSwitchCase="'code'" [attr.width]="size" [attr.height]="size" [attr.stroke]="color" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="16,18 22,12 16,6"/>
        <polyline points="8,6 2,12 8,18"/>
      </svg>
      <svg *ngSwitchCase="'clock'" [attr.width]="size" [attr.height]="size" [attr.stroke]="color" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12,6 12,12 16,14"/>
      </svg>
      <svg *ngSwitchCase="'link'" [attr.width]="size" [attr.height]="size" [attr.stroke]="color" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
      </svg>
      <svg *ngSwitchCase="'arrow-up'" [attr.width]="size" [attr.height]="size" [attr.stroke]="color" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="12" x2="12" y1="19" y2="5"/>
        <polyline points="5,12 12,5 19,12"/>
      </svg>
      <svg *ngSwitchCase="'arrow-down'" [attr.width]="size" [attr.height]="size" [attr.stroke]="color" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="12" x2="12" y1="5" y2="19"/>
        <polyline points="19,12 12,19 5,12"/>
      </svg>
      <svg *ngSwitchCase="'alert-circle'" [attr.width]="size" [attr.height]="size" [attr.stroke]="color" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" x2="12" y1="8" y2="12"/>
        <line x1="12" x2="12.01" y1="16" y2="16"/>
      </svg>
      <svg *ngSwitchCase="'alert-octagon'" [attr.width]="size" [attr.height]="size" [attr.stroke]="color" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="7.86,2 16.14,2 22,7.86 22,16.14 16.14,22 7.86,22 2,16.14 2,7.86"/>
        <line x1="12" x2="12" y1="8" y2="12"/>
        <line x1="12" x2="12.01" y1="16" y2="16"/>
      </svg>
      <svg *ngSwitchCase="'wifi-off'" [attr.width]="size" [attr.height]="size" [attr.stroke]="color" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="2" x2="22" y1="2" y2="22"/>
        <path d="M8.5 16.429a5 5 0 0 1 7 0"/>
        <path d="M5 12.859a10 10 0 0 1 5.17-2.69"/>
        <path d="M19 12.859a10 10 0 0 0-2.805-4.57"/>
        <path d="M2 8.82a15 15 0 0 1 4.177-2.643"/>
        <path d="M22 8.82a15 15 0 0 0-11.29-3.764"/>
      </svg>
      <svg *ngSwitchCase="'health-offline'" [attr.width]="size" [attr.height]="size" [attr.stroke]="color" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="4.93" x2="19.07" y1="4.93" y2="19.07"/>
      </svg>
      <svg *ngSwitchCase="'health-unknown'" [attr.width]="size" [attr.height]="size" [attr.stroke]="color" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
        <line x1="12" x2="12.01" y1="17" y2="17"/>
      </svg>
      <svg *ngSwitchCase="'info'" [attr.width]="size" [attr.height]="size" [attr.stroke]="color" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" x2="12" y1="16" y2="12"/>
        <line x1="12" x2="12.01" y1="8" y2="8"/>
      </svg>
      <svg *ngSwitchCase="'building'" [attr.width]="size" [attr.height]="size" [attr.stroke]="color" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="2" y="3" width="20" height="21" rx="2" ry="2"/>
        <line x1="9" x2="9" y1="9" y2="21"/>
        <line x1="15" x2="15" y1="9" y2="21"/>
        <line x1="3" x2="21" y1="9" y2="9"/>
      </svg>
      <svg *ngSwitchCase="'copy'" [attr.width]="size" [attr.height]="size" [attr.stroke]="color" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
      </svg>
      <svg *ngSwitchCase="'hash'" [attr.width]="size" [attr.height]="size" [attr.stroke]="color" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="4" x2="20" y1="9" y2="9"/>
        <line x1="4" x2="20" y1="15" y2="15"/>
        <line x1="10" x2="8" y1="3" y2="21"/>
        <line x1="16" x2="14" y1="3" y2="21"/>
      </svg>
      <svg *ngSwitchCase="'key'" [attr.width]="size" [attr.height]="size" [attr.stroke]="color" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="7.5" cy="15.5" r="5.5"/>
        <path d="M21 2l-9.6 9.6"/>
        <path d="M15.5 7.5l3 3L22 7l-3-3"/>
      </svg>
      <svg *ngSwitchCase="'toggle-left'" [attr.width]="size" [attr.height]="size" [attr.stroke]="color" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="1" y="5" width="22" height="14" rx="7" ry="7"/>
        <circle cx="8" cy="12" r="3"/>
      </svg>
      <svg *ngSwitchCase="'file-plus'" [attr.width]="size" [attr.height]="size" [attr.stroke]="color" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14,2 14,8 20,8"/>
        <line x1="12" x2="12" y1="18" y2="12"/>
        <line x1="9" x2="15" y1="15" y2="15"/>
      </svg>
      <svg *ngSwitchCase="'plus-circle'" [attr.width]="size" [attr.height]="size" [attr.stroke]="color" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" x2="12" y1="8" y2="16"/>
        <line x1="8" x2="16" y1="12" y2="12"/>
      </svg>
      <svg *ngSwitchCase="'external-link'" [attr.width]="size" [attr.height]="size" [attr.stroke]="color" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
        <polyline points="15,3 21,3 21,9"/>
        <line x1="10" x2="21" y1="14" y2="3"/>
      </svg>
      <svg *ngSwitchCase="'save'" [attr.width]="size" [attr.height]="size" [attr.stroke]="color" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
        <polyline points="17,21 17,13 7,13 7,21"/>
        <polyline points="7,3 7,8 15,8"/>
      </svg>
      <svg *ngSwitchCase="'at-sign'" [attr.width]="size" [attr.height]="size" [attr.stroke]="color" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="4"/>
        <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"/>
      </svg>
      <svg *ngSwitchCase="'phone'" [attr.width]="size" [attr.height]="size" [attr.stroke]="color" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
      </svg>
      <!-- Fallback for unknown icons -->
      <div *ngSwitchDefault style="width: 16px; height: 16px; background: #ccc; border-radius: 2px; display: inline-block;" [title]="'Icon: ' + name"></div>
    </ng-container>
  `
})
export class LucideIconComponent {
  @Input() name!: string;
  @Input() size: string = '24px';
  @Input() color: string = 'currentColor';
}