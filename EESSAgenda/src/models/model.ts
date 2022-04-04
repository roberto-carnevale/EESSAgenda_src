export interface Corso {
    corso:string,
}

export interface Slots{
    guida:string,
    occupato:string,
    inizio: Date,
    fine: Date,
}

export interface Agenda {
    id:string,
    corso: string,
    guida: string,
    slot: Slots[],
    url: string,
}


export interface Utente {
    uid: string,
    nome : string,
    ruolo : TipoUtenti,
    corso: string,
    email: string
}

export enum TipoUtenti {
    "amministratore" = 0,
    "esercitante" = 1,
    "giuda" = 2,
    "gestore" = 3,
}