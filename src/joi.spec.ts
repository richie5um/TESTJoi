import * as Joi from 'joi';

describe('joi validation', () => {

    describe('simple', () => {

        it('is a number', () => {
            expect(Joi.validate(1, Joi.number()).error).toBeNull();
        });

        it('is not a number', () => {
            expect(Joi.validate('a', Joi.number()).error).not.toBeNull();
        });

        it('is not a number (assert)', () => {
            expect(() => { Joi.assert('a', Joi.number()); }).toThrow();
        });

        it('is a object', () => {
            expect(Joi.validate({ a: 1 }, Joi.object()).error).toBeNull();
        });

        it('is a boolean', () => {
            expect(Joi.validate(true, Joi.boolean()).error).toBeNull();
        });

        it('is a boolean', () => {
            expect(Joi.validate(false, Joi.boolean()).error).toBeNull();
        });

        it('is not a boolean', () => {
            expect(Joi.validate(0, Joi.boolean().strict()).error).not.toBeNull();
            expect(Joi.validate(1, Joi.boolean().strict()).error).not.toBeNull();
        });

        it('is a string', () => {
            expect(Joi.validate('a', Joi.string()).error).toBeNull();
            expect(Joi.validate('', Joi.string().allow('')).error).toBeNull();
            expect(Joi.validate('', Joi.string()).error).not.toBeNull();
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

            expect(Joi.validate(obj, this.joiSchema).error).not.toBeNull();
        });
    });

    describe('dynamic', () => {

        it('is a number', () => {
            let type = 'number';
            let typeFunc = Joi[type];

            expect(Joi.validate(1, typeFunc()).error).toBeNull();
        });
    });

    describe('keys', () => {

        describe('simple', () => {

            beforeAll(() => {
                this.schema = Joi.object().keys({
                    hello: Joi.string().required(),
                    world: Joi.string().optional()
                });
            });

            it('required only', () => {
                let obj = {
                    hello: 'world'
                };

                expect(Joi.validate(obj, this.schema).error).toBeNull();
            });

            it('required and optional', () => {
                let obj = {
                    hello: 'world',
                    world: 'hello'
                };

                expect(Joi.validate(obj, this.schema).error).toBeNull();
            });

            it('required and invalid optional', () => {
                let obj = {
                    hello: 'world',
                    world: 1
                };

                expect(Joi.validate(obj, this.schema).error).not.toBeNull();
            });
        });

        describe('nested', () => {

            beforeAll(() => {
                this.schema = Joi.object().keys({
                    hello: Joi.string().required(),
                    world: Joi.object().keys({
                        optional: Joi.string().optional(),
                        required: Joi.string().required(),
                    })
                });
            });

            it('required only', () => {
                let obj = {
                    hello: 'world'
                };

                expect(Joi.validate(obj, this.schema).error).toBeNull();
            });

            it('required and optional', () => {
                let obj = {
                    hello: 'world',
                    world: {
                        optional: 'hello',
                        required: 'hello'
                    }
                };

                expect(Joi.validate(obj, this.schema).error).toBeNull();
            });

            it('required and invalid optional', () => {
                let obj = {
                    hello: 'world',
                    world: 1
                };

                expect(Joi.validate(obj, this.schema).error).not.toBeNull();
            });
        });

        describe('nested complex', () => {

            beforeAll(() => {
                this.schema = Joi.object().keys({
                    id: Joi.string().guid().required(),
                    username: Joi.string().alphanum().min(8).required(),
                    type: Joi.string().valid(['member', 'admin']).required(),
                    contact: Joi.object().keys({
                        email: Joi.string().email()
                    }).required()
                });
            });

            it('required only', () => {
                let obj = {
                    id: 'd5483f58-9caf-4f2c-a180-956956e9a60f',
                    username: 'alex1234',
                    type: 'member',
                    contact: {
                        email: 'alex@hotmail.com'
                    }
                };

                expect(Joi.validate(obj, this.schema).error).toBeNull();
            });
        });
    });
});
