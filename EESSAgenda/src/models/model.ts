export interface Corso {
    corso:string,
    info: string[],
    chiave: string,
    allegati?: File[],
}

export interface Slots{
    id : string,
    corso:string,
    guida:string,
    occupato:string,
    inizio: string,
    fine: string,
}

export interface Utente {
    nome : string,
    ruolo : number,
    corso: string,
    email: string,
    url?:string,
    in_colloquio?:boolean,
    bacheca?: string[],
}

export interface File {
  nome: string,
  url: string,
}

export enum TipoUtente {
  Amministratore,
  Esercitante,
  Guida,
  Gestore,
  GuidaSmart,
}

