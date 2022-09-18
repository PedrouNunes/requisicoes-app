
import { Component, OnInit, TemplateRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { dataFuturaValidator } from '../shared/validator/data-Futura.validators';
import { Equipamento } from './models/equipamento.models';
import { EquipamentoService } from './servieces/equipamento.service';


@Component({
  selector: 'app-equipamento',
  templateUrl: './equipamento.component.html'
})

export class EquipamentoComponent implements OnInit {
  public equipamentos$: Observable<Equipamento[]>;
  public form: FormGroup;

  constructor(private fb: FormBuilder, private modalService: NgbModal, private equipamentoService: EquipamentoService, private toastrService: ToastrService) { }

  ngOnInit(): void {

    this.form = this.fb.group({
      id: new FormControl(""),
      nSerie: new FormControl("", [Validators.required]),
      nome : new FormControl("", [Validators.required, Validators.minLength(3)]),
      preco: new FormControl("", [Validators.required]),
      data : new FormControl("", [Validators.required, dataFuturaValidator()]),
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

       this.toastrService.success(`O equipamento foi salvo com sucesso`, "Cadastro de Equipamentos");

      } catch (error) {
        if (error != "fechar" && error != "0" && error != "1")
        this.toastrService.error("Houve um erro ao salvar o equipamento. Tente novamente.", "Cadastro de Equipamentos");
      }
  }

  public async excluir(equipamento: Equipamento){
    try {
        await this.equipamentoService.excluir(equipamento);
        this.toastrService.success(`O equipamento foi excluido com sucesso!`, "Cadastro de Equipamentos");
    } catch (error) {
      this.toastrService.error("Houve um erro ao salvar o equipamento. Tente novamente.", "Cadastro de Equipamentos");
    }

  }
}
