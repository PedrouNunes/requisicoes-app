import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/auth/services/authentication.service';
import { Departamento } from 'src/app/departamentos/models/departamento.model';
import { DepartamentoService } from 'src/app/departamentos/servieces/departamento.service';
import { Equipamento } from 'src/app/equipamentos/models/equipamento.models';
import { EquipamentoService } from 'src/app/equipamentos/servieces/equipamento.service';
import { FuncionarioService } from 'src/app/funcionarios/services/funcionario.service';
import { Requisicao } from '../models/requisicao.model';
import { RequisicaoService } from '../services/requisicao.service';

@Component({
  selector: 'app-requisicoes-funcionario',
  templateUrl: './requisicoes-funcionario.component.html'
})
export class RequisicoesFuncionarioComponent implements OnInit, OnDestroy {

  public requisicoes$: Observable<Requisicao[]>;
  public equipamentos$: Observable<Equipamento[]>;
  public departamentos$: Observable<Departamento[]>;
 private processoAutenticado$: Subscription;
  public funcionarioLogadoId: string;
  public form: FormGroup;

  constructor(
    private authService: AuthenticationService,
    private requisicaoService: RequisicaoService,
    private equipamentoService: EquipamentoService,
    private departamentoService: DepartamentoService,
    private funcionarioService: FuncionarioService,
    private modalService: NgbModal,
    private toastrService: ToastrService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      id: new FormControl(""),
      descricao: new FormControl(""),
      dataAbertura: new FormControl(""),

      funcionarioId: new FormControl(""),
      funcionario: new FormControl(""),

      departamentoId: new FormControl(""),
      departamento: new FormControl(""),

      equipamentoId: new FormControl(""),
      equipamento: new FormControl(""),

      status: new FormControl(""),
      ultimaAtualizacao: new FormControl(""),
      movimentacoes: new FormControl("")
    });
    this.departamentos$ = this.departamentoService.selecionarTodos();
    this.equipamentos$ = this.equipamentoService.selecionarTodos();



    this.processoAutenticado$ = this.authService.usuarioLogado.subscribe(usuario => {
      const email: string = usuario?.email!;

      this.funcionarioService.selecionarFuncionarioLogado(email)
      .subscribe(funcionario => {
        this.funcionarioLogadoId = funcionario.id;
        this.requisicoes$ = this.requisicaoService
          .selecionarRequisicoesFuncionarioAtual(this.funcionarioLogadoId);
      });

    });
  }

  ngOnDestroy(): void {
    this.processoAutenticado$.unsubscribe();
  }

  get tituloModal(): string{
    return this.id?.value ? "Atualização" : "Cadastro";
  }

  get id(): AbstractControl | null {
    return this.form.get("id");
  }

  private configurarValoresPadrao(): void {
    this.form.get("status")?.setValue("Aberta");
    this.form.get("dataAbertura")?.setValue(new Date());
    this.form.get("ultimaAtualizacao")?.setValue(new Date());
    this.form.get("equipamentoId")?.setValue(null);
    this.form.get("funcionarioId")?.setValue(this.funcionarioLogadoId);
  }

  public async gravar(modal: TemplateRef<any>, requisicao?: Requisicao){
    this.form.reset();
    this.configurarValoresPadrao();

    if (requisicao) {
      const departamento = requisicao.departamento ? requisicao.departamento : null;
      const funcionario = requisicao.funcionario ? requisicao.funcionario : null;
      const equipamento = requisicao.equipamento ? requisicao.equipamento : null;

      const requisicaoCompleta = {
        ...requisicao,
        departamento,
        funcionario,
        equipamento
      }

      this.form.setValue(requisicaoCompleta);
    }

    try {
        await this.modalService.open(modal).result;

        if (this.form.dirty && this.form.valid) {
          if(!requisicao)
            await this.requisicaoService.inserir(this.form.value);
          else
            await this.requisicaoService.editar(this.form.value);

          this.toastrService.success(`A requisição foi salva com sucesso`, "Cadastro de Requisições");
        }
        else
        this.toastrService.error(`Ops, algo deu errado! Verifique o preenchimento do formulário.`, "Cadastro de Requisições");

    } catch (error) {
      if (error != "fechar" && error != "0" && error != "1")
      this.toastrService.error("Houve um erro ao salvar a requisição. Tente novamente.", "Cadastro de Requisições");

    }

  }

  public async excluir(requisicao: Requisicao){
    try {
      await this.requisicaoService.excluir(requisicao);
      this.toastrService.success(`A requisição foi excluido com sucesso!`, "Cadastro de Requisições");
  } catch (error) {
    this.toastrService.error("Houve um erro ao salvar a requisição. Tente novamente.", "Cadastro de Requisições");
  }
  }

}
