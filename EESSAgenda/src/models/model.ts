export interface Corso {
    corso:string,
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
    uid: string,
    nome : string,
    ruolo : number,
    corso: string,
    email: string,
    url?:string
}

export enum TipoUtente {
  Amministratore,
  Esercitante,
  Guida,
  Gestore,
}

