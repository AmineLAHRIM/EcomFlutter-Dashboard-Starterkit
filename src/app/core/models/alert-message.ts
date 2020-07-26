export enum TypeAlert {
    ADD = 'success', EDIT = 'warning', DELETE = 'danger', NONE = 'none'
}

export class AlertMessage {
    public code: number;
    public message: string;
    public typeAlert: TypeAlert;


}