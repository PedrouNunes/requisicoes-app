import { Departamento } from "src/app/departamentos/models/departamento.model";
import { Equipamento } from "src/app/equipamentos/models/equipamento.models";

export class Requisicao{
  id: string;
  abertura: any;
  departamentoId: string;
  departamento?: Departamento;
  descricao: string;
  equipamentoId: string;
  equipamento?: Equipamento;
}
