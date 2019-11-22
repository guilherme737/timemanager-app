import { Permissao as Permissao } from './permissao.enum';

export class Usuario {
    nome: string;
    login: string;
    senha: string;
    permissao: Permissao;
}
