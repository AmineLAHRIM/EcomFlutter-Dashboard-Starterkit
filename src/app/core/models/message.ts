export enum TypeMessage {
    Warning, Error, Info
}

export class Message {
    public code: number;
    public libelle: string;
    public typeMessage: TypeMessage;



}