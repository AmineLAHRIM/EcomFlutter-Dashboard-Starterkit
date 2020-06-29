import {Message} from './message';

export class Response {
    public info: Message[];
    public warnigs: Message[];
    public errors: Message[];

    public succes = false;
    public output: any;
    public inputs: any[];
    public details: Map<string, any>;



}
