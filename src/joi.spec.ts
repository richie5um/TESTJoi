import * as Joi from 'joi';

describe('joi validation', () => {

    describe('simple', () => {

        it('is a number', () => {
            expect(Joi.validate(1, Joi.number()).error).toBeNull();
        });

        it('is not a number', () => {
            expect(Joi.validate('a', Joi.number()).error).toBeDefined();
        });

        it('is not a number (assert)', () => {
            expect(() => { Joi.assert('a', Joi.number()); }).toThrow();
        });

    });

    describe('create', () => {

        beforeAll(() => {
            this.joiSchema = Joi.object({
                a: Joi.string(),
                b: Joi.number().integer().positive()
            });
        });

        it('is a valid object', () => {
            let obj = {
                a: 'hello',
                b: 2
            };

            expect(Joi.validate(obj, this.joiSchema).error).toBeNull();
        });

        it('is not a valid object', () => {
            let obj = {
                a: 2,
                b: 'hello'
            };

            expect(Joi.validate(obj, this.joiSchema).error).toBeDefined();
        });
    });
});