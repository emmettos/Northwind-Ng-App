import { NgModule } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule} from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';

const material = [
  MatButtonModule,
  MatCardModule,
  MatTableModule,
  MatToolbarModule
];

@NgModule({
  declarations: [],
  imports: [
    material,
  ],
  exports: [
    material
  ]
})
export class MaterialModule { }
