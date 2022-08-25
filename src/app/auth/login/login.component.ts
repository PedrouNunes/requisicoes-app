import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public form: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private router: Router
    ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: new FormControl(""),
      senha: new FormControl("")
    });
  }

    get email(): AbstractControl | null {
      return this.form.get("email");
    }

    get senha(): AbstractControl | null {
      return this.form.get("senha");
    }

    public async login(){
      const email = this.email?.value;
      const senha = this.senha?.value;

      try{
          const resposta = await this.authService.login(email, senha);

          if(resposta?.user){
              this.router.navigate(["/painel"]);
          }

      }catch(error){
          console.log(error);
      }
    }
}
