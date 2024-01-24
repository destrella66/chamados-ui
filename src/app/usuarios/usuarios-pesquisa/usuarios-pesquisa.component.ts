import { Component, ViewChild } from '@angular/core';
import { PoModalAction, PoModalComponent, PoNotificationService, PoPageAction, PoTableColumn } from '@po-ui/ng-components';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { UsuariosService } from '../usuarios.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Usuario } from '../model/Usuario';

@Component({
  selector: 'app-usuasios-pesquisa',
  templateUrl: './usuarios-pesquisa.component.html',
  styleUrls: ['./usuarios-pesquisa.component.css']
})
export class UsuariosPesquisaComponent {

  public acoesPagina: PoPageAction[] = [];
  public carregandoUsuarios = true;
  public colunas: PoTableColumn[] = [];
  public permissoes$: Observable<any>;

  public usuarioForm: FormGroup;
  public usuarios$: Observable<any>;

  @ViewChild(PoModalComponent, { static: true }) poModal!: PoModalComponent;

  constructor(
    private usuariosService: UsuariosService,
    private formBuilder: FormBuilder,
    private poNotificationService: PoNotificationService) {   
      
    this.usuarioForm = this.usuarioFormBuilder();
    this.acoesPagina = this.acoesPaginaConfig();
    this.colunas = this.colunasConfig();
    this.usuarios$ = this.carregarUsuarios();
    this.permissoes$ = this.usuariosService.listarPermissoes().pipe(
      map( (permisssoes: any) => {
        return permisssoes.map((permissao:any) => ({ label: permissao.nome, value: permissao.id })  )}
      )
    )
  };

  private carregarUsuarios() {
    this.carregandoUsuarios = true;
    return this.usuariosService.listar()
    .pipe(
      tap( (usuarios) => this.carregandoUsuarios = false ),
      map((x) => x.map((produto: any) => this.adicionarAcoes(produto))),
      catchError( (error) => {
        this.poNotificationService.error({ message: 'ERRO 403: Você não tem permissão para acessar essa página' });
        this.carregandoUsuarios = false;
        return of();
      })
    );
  }

  private acoesPaginaConfig() : PoPageAction[] {
    return [
      { label: 'Novo', action: this.usuarioFormModalOpen.bind(this) }
    ]
  }

  private usuarioFormModalOpen() : void {
    this.usuarioForm.reset();
    this.poModal.open();
  }

  protected usuarioFormModalSalvar() : PoModalAction {
    return {
      disabled: this.usuarioForm.invalid,
      label: this.isNovoUsuario() ? 'Salvar' : 'Atualizar',
      action: () => {
        const usuario = this.usuarioForm.value
        this.isNovoUsuario() ? this.salvarUsuario(usuario) : this.atualizarUsuario(usuario);
        this.usuarioForm.reset();
        this.poModal.close();
      }
    }
  }

  protected isNovoUsuario() {
    return this.usuarioForm.get('id')?.value ? false : true;;
  }

  private atualizarUsuario(usuario: Usuario) {
    this.usuariosService.atualizar(usuario)
    .subscribe({
      complete: () => {
        this.poNotificationService.success('Usuário atualizado com sucesso.');
        this.usuarioForm.reset();
        this.usuarios$ = this.carregarUsuarios();
      },
      error: () => this.poNotificationService.error('Não foi possível atualizar o usuário.')
    })
  }

  private salvarUsuario(usuario: Usuario) {
    this.usuariosService.salvar(usuario)
    .subscribe({
      complete: () => {
        this.poNotificationService.success('Usuário adicionado com sucesso.');
        this.usuarioForm.reset();
        this.usuarios$ = this.carregarUsuarios();
      },
      error: () => this.poNotificationService.error('Não foi possível adicionar o usuário.')
    })
  }

  private carregarUsuario(usuario: any) : void {
    this.usuariosService.buscar(usuario.id).subscribe(
      usuario => {
        this.usuarioForm.patchValue(usuario);
        this.usuarioForm.get("permissoes")?.setValue(usuario.permissoes[0].id)}
    )
  }

  protected usuarioFormModalFechar() : PoModalAction { 
    return {
      danger: true,
      label: 'Fechar',
      action: () => { 
        this.poModal.close();
        this.usuarioForm.reset();}
    }
  }

  private colunasConfig() : PoTableColumn[] {
    return [
      { label: 'Código', property: 'id' },
      { label: 'Nome', property: 'nome' },
      { label: 'E-mail', property: 'email' },
      { label: 'Permissão', property: 'permissoes', type: 'columnTemplate',  },
      { label: 'Ações', property: 'acoes', type: 'icon', icons: [
        {
          icon: 'po-icon-export',
          tooltip: 'Editar',
          value: 'editar',
          action: (value: any) => {
            this.carregarUsuario(value);
            this.usuarioFormModalOpen();
          }
        }
      ]}
    ]
  }

  private usuarioFormBuilder() : FormGroup {
    return this.usuarioForm = this.formBuilder.group({
      id: [''],
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', Validators.required],
      confirmSenha: ['', Validators.required],
      permissoes: ['' , Validators.required]
    }, { validators: this.validaSenhas })
  }

  private validaSenhas(form: FormGroup) {
    let senha = form.get('senha')?.value;
    let confirmacao = form.get('confirmSenha')?.value;
    return senha ===  confirmacao ? null : { senhasDivergentes: true }
  }

  private adicionarAcoes(produto: any) : any {
    return produto = ({ ...produto, acoes: ['visualizar', 'editar']});
  }

}
