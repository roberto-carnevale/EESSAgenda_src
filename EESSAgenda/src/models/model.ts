export interface Corso {
    corso:string,
}

export interface Slots{
    guida:string,
    occupato:string,
    inizio: Date,
    fine: Date,
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

