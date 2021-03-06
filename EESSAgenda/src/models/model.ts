export interface Corso {
    corso:string,
    info: string[],
    allegati?: File[],
    opzioni: number[]
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

export interface ChatMessage {
  user:string,
  date:string,
  msg:string
}

export enum TipoUtente {
  Amministratore,
  Esercitante,
  Guida,
  Gestore,
  GuidaSmart,
}

export enum OpzioniPiattaforma {
  Chat,
  Prenotazioni,
  File,
}

