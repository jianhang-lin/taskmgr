import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

export const loadSvgResouces = (ir: MatIconRegistry, ds: DomSanitizer) => {
  ir.addSvgIcon('list', ds.bypassSecurityTrustResourceUrl('assets/list-24px.svg'));
};

