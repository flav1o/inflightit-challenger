//DTO
export class CreateCustomer {
    name: string;
    priority: number;

    constructor(name: string, priority: number) {
        this.name = name;
        this.priority = priority;
    }
}