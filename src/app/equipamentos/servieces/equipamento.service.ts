import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Equipamento } from '../models/equipamento.models';


@Injectable({
  providedIn: 'root'
})
export class EquipamentoService {
  private registros: AngularFirestoreCollection<Equipamento>;

  constructor(private firestore: AngularFirestore) {
    this.registros = this.firestore.collection<Equipamento>("equipamentos");
  }

  public async inserir(registro: Equipamento): Promise<any>{
      if (!registro) {
        return Promise.reject("Item inválido");
      }

      const res = await this.registros.add(registro);
    registro.id = res.id;
    this.registros.doc(res.id).set(registro);

  }

  public async editar(registro: Equipamento): Promise<void>{
      return this.registros.doc(registro.id).set(registro);
  }

  public excluir(registro: Equipamento): Promise<void> {
    return this.registros.doc(registro.id).delete();
  }

  public selecionarTodos(): Observable<Equipamento[]>{
    return this.registros.valueChanges();
  }
}
