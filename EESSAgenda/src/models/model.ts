export interface Slots{
    data: string,
    ora:string,
    occupato:boolean,
    date?: Date
}

export interface Agenda {
    corso: string
    guida: string,
    agenda: Slots[],
    url: string,
}

export interface Corso {
    nome: string,
}

export interface Utente {
    nome : string,
    ruolo : boolean,
    corso: string,
}