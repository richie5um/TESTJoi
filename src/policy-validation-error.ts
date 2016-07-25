'use strict';

export class PolicyValidationError extends Error {
    public name: string = 'PolicyValidationErr';

    constructor(public errors?: any[]) {
        super('Validation failed: ');
    }

    public getMessage(): string {
        let validationErrors = '';
        this.errors.forEach((err: string) => {
            validationErrors += err;
        });
        return this.message + validationErrors;
    }
}
