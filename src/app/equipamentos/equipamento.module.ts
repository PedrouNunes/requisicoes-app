import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EquipamentoRoutingModule } from './equipamento-routing.module';
import { DepartamentoComponent } from '../departamentos/departamento.component';
import { EquipamentoComponent } from './equipamento.component';


@NgModule({
  declarations: [
    EquipamentoComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    ReactiveFormsModule,
    EquipamentoRoutingModule
  ]
})
export class EquipamentoModule { }
