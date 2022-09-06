import { Component, OnInit, TemplateRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../auth/services/authentication.service';
import { Departamento } from '../departamentos/models/departamento.model';
import { DepartamentoService } from '../departamentos/servieces/departamento.service';
import { Equipamento } from '../equipamentos/models/equipamento.models';
import { EquipamentoService } from '../equipamentos/servieces/equipamento.service';
import { Funcionario } from '../funcionarios/models/funcionario.model';
import { FuncionarioService } from '../funcionarios/services/funcionario.service';
import { Requisicao } from './models/requisicao.models';
import { RequisicaoService } from './services/requisicao.service';

@Component({
  selector: 'app-requisicao',
  templateUrl: './requisicao.component.html'
})
export class RequisicaoComponent implements OnInit {
  public requisicoes$: Observable<Requisicao[]>;
  public funcionarios$: Observable<Funcionario[]>;
  public departamentos$: Observable<Departamento[]>;
  public equipamentos$: Observable<Equipamento[]>;
  public form: FormGroup;

  constructor(
    private requisicaoService: RequisicaoService,
    private funcionarioService: FuncionarioService,
    private departamentoService: DepartamentoService,
    private equipamentoService: EquipamentoService,
    private toastrService: ToastrService,
    private modalService: NgbModal,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.fb.group({
        requisicao: new FormGroup({
          id: new FormControl(""),
          abertura: new FormControl("", [Validators.required]),
          departamentoId: new FormControl("", [Validators.required]),
          departamento: new FormControl(""),
          descricao: new FormControl("", [Validators.required]),
          equipamentoId: new FormControl("", [Validators.required]),
          equipamento: new FormControl(""),
        })
    });
    this.requisicoes$ = this.requisicaoService.selecionarTodos();
    this.equipamentos$ = this.equipamentoService.selecionarTodos();
    this.departamentos$ = this.departamentoService.selecionarTodos();
  }

  get tituloModal(): string {
    return this.id?.value ? "Atualização" : "Cadastro";
  }

    get id(): AbstractControl | null {
    return this.form.get("id");
  }

  get abertura(): AbstractControl | null {
    return this.form.get("requisicao.abertura");
  }

  get departamentoId(): AbstractControl | null {
    return this.form.get("requisicao.departamentoId");
  }

  get descricao(): AbstractControl | null {
    return this.form.get("requisicao.descricao");
  }

  get equipamentoId(): AbstractControl | null {
    return this.form.get("requisicao.equipamentoId");
  }

  public async gravar(modal: TemplateRef<any>, requisicao?: Requisicao){
    this.form.reset();
    if (requisicao) {
      const departamento = requisicao.departamento ? requisicao.departamento : null;
      const equipamento = requisicao.equipamento ? requisicao.equipamento : null;

      // spread operator(Javascript)
      const requisicaoCompleta = {
        ...requisicao,
        departamento,
        equipamento
      }

      this.form.get("requisicao")?.setValue(requisicaoCompleta);
  }

    try {
      await this.modalService.open(modal).result;
      if (this.form.dirty && this.form.valid) {
        if (!requisicao) {

          await this.requisicaoService.inserir(this.form.get("requisicao")?.value)

        }else{

          await this.requisicaoService.editar(this.form.get("requisicao")?.value);

        }
      }else
     this.toastrService.success(`A requisicao foi salva com sucesso`, "Cadastro de Requisições");

    } catch (error) {
      if (error != "fechar" && error != "0" && error != "1")
      this.toastrService.error("Houve um erro ao salvar a requisicao. Tente novamente.", "Cadastro de Requisições");
    }
}

public async excluir(requisicao: Requisicao){
  try {
      await this.requisicaoService.excluir( requisicao );
      this.toastrService.success(`A requisicao foi excluida com sucesso!`, "Cadastro de Requisições");
  } catch (error) {
    this.toastrService.error("Houve um erro ao salvar a requisicao. Tente novamente.", "Cadastro de Requisições");
  }
}


}


