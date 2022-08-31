import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EquipamentoRoutingModule } from './equipamento-routing.module';
import { EquipamentoComponent } from './equipamento.component';

import { NgxMaskModule } from 'ngx-mask';
import { EquipamentoService } from './servieces/equipamento.service';
import { CurrencyMaskModule } from 'ng2-currency-mask';


@NgModule({
  declarations: [
    EquipamentoComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    ReactiveFormsModule,
    EquipamentoRoutingModule,
    NgxMaskModule.forChild(),
    CurrencyMaskModule
  ],
  providers: [EquipamentoService]
})
export class EquipamentoModule { }
