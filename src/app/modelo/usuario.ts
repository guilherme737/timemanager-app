import { Permissao as Permissao } from './permissao.enum';

export class Usuario {
    id?: number;
    nome: string;
    login: string;
    senha: string;
    permissao: Permissao;
}
