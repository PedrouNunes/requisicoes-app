import { Component, OnInit, TemplateRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { Equipamento } from './models/equipamento.models';
import { EquipamentoService } from './servieces/equipamento.service';


@Component({
  selector: 'app-equipamento',
  templateUrl: './equipamento.component.html'
})

export class EquipamentoComponent implements OnInit {
  public equipamentos$: Observable<Equipamento[]>;
  public form: FormGroup;

  constructor(private fb: FormBuilder, private modalService: NgbModal, private equipamentoService: EquipamentoService) { }

  ngOnInit(): void {

    this.form = this.fb.group({
      id: new FormControl(""),
      nSerie: new FormControl(""),
      nome : new FormControl(""),
      preco: new FormControl(""),
      data : new FormControl(""),
    });

    this.equipamentos$ = this.equipamentoService.selecionarTodos();
  }

  get tituloModal(): string {
    return this.id?.value ? "Atualização" : "Cadastro";
  }

  get id(): AbstractControl | null {
    return this.form.get("id");
  }

  get nome() {
    return this.form.get("nome");
  }

  get nSerie() {
    return this.form.get("nSerie");
  }

  get preco() {
    return this.form.get("preco");
  }

  get data() {
    return this.form.get("data");
  }

  public async gravar(modal: TemplateRef<any>, equipamento?: Equipamento){
      this.form.reset();

      if (equipamento) {
        this.form.setValue(equipamento);
    }

      try {
        await this.modalService.open(modal).result;

        if (!equipamento) {
          await this.equipamentoService.inserir(this.form.value)
        }else{
          await this.equipamentoService.editar(this.form.value);
        }

       console.log(`O equipamento foi salvo com sucesso`);

      } catch (_error) {

      }
  }

  public excluir(equipamento: Equipamento){
      this.equipamentoService.excluir(equipamento);
  }
}
