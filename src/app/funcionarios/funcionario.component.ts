import { Component, OnInit, TemplateRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { Departamento } from '../departamentos/models/departamento.model';
import { DepartamentoService } from '../departamentos/servieces/departamento.service';
import { Funcionario } from './models/funcionario.model';
import { FuncionarioService } from './services/funcionario.service';

@Component({
  selector: 'app-funcionario',
  templateUrl: './funcionario.component.html',
})
export class FuncionarioComponent implements OnInit {
  public funcionarios$: Observable<Funcionario[]>;
  public departamentos$: Observable<Departamento[]>;
  public form: FormGroup;

  constructor(private funcionarioService: FuncionarioService,
    private departamentoService: DepartamentoService,
    private toastrService: ToastrService,
    private modalService: NgbModal,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      id: new FormControl(""),
      nome: new FormControl("", [Validators.required, Validators.minLength(3)]),
      email: new FormControl("", [Validators.required, Validators.email]),
      funcao: new FormControl("", [Validators.required, Validators.minLength(3)]),
      departamentoId: new FormControl("", [Validators.required]),
      departamento: new FormControl(""),
    });
    this.funcionarios$ = this.funcionarioService.selecionarTodos();
    this.departamentos$ = this.departamentoService.selecionarTodos();
  }

  get tituloModal(): string {
    return this.id?.value ? "Atualização" : "Cadastro";
  }

  get id(): AbstractControl | null {
    return this.form.get("id");
  }

  get nome(): AbstractControl | null {
    return this.form.get("nome");
  }

  get email(): AbstractControl | null {
    return this.form.get("email");
  }

  get funcao(): AbstractControl | null {
    return this.form.get("funcao");
  }

  get departamentoId(): AbstractControl | null {
    return this.form.get("departamentoId");
  }

  public async gravar(modal: TemplateRef<any>, funcionario?: Funcionario){
      this.form.reset();

      if (funcionario) {
        const departamento = funcionario.departamento ? funcionario.departamento : null;

        // spread operator(Javascript)
        const funcionarioCompleto = {
          ...funcionario,
          departamento
        }

        this.form.setValue(funcionarioCompleto);
    }

      try {
        await this.modalService.open(modal).result;

        if (!funcionario) {
          await this.funcionarioService.inserir(this.form.value)
        }else{
          await this.funcionarioService.editar(this.form.value);
        }

       this.toastrService.success(`O funcionário foi salvo com sucesso`, "Cadastro de Funcionários");

      } catch (error) {
        if (error != "fechar" && error != "0" && error != "1")
        this.toastrService.error("Houve um erro ao salvar o funcionário. Tente novamente.", "Cadastro de Funcionários");
      }
  }

  public async excluir(funcionario: Funcionario){
    try {
        await this.funcionarioService.excluir(funcionario);
        this.toastrService.success(`O funcionario foi excluido com sucesso!`, "Cadastro de Funcionários");
    } catch (error) {
      this.toastrService.error("Houve um erro ao salvar o funcionario. Tente novamente.", "Cadastro de Funcionários");
    }
  }
}
