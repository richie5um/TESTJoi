import * as _ from 'lodash';
import * as Joi from 'joi';

import * as SchemaValidator from './schema-validator';
import * as Schema from './schema';

describe('Index Validation', () => {

    describe('simple schema', () => {
        describe('simple', () => {

            beforeAll(() => {
                this.schema = {
                    $type: 'object',
                    $properties: ['hello', 'world', 'deep'],
                    $required: ['hello', 'deep'],
                    hello: {
                        $type: 'number',
                        $minimum: 1,
                        $maximum: 4
                    },
                    world: {
                        $type: 'boolean',
                    },
                    deep: {
                        $type: 'object',
                        $properties: ['subDeep'],
                        subDeep: {
                            $type: 'number',
                            $maximum: 10
                        }
                    }
                }
            });

            it('valid shallow object', () => {
	             let obj = {
                    hello: 2,
                    world: false
                };

                 expect(SchemaValidator.validate(this.schema, obj, {depth: 1}).isValid).toBe(true);
            });

            it('invalid deep object', () => {
	             let obj = {
                    hello: 2,
                    world: false
                };

                 expect(SchemaValidator.validate(this.schema, obj).isValid).toBe(false);
            });

            it('valid deep object', () => {
	             let obj = {
                    hello: 2,
                    world: false,
                    deep: {
                        subDeep: 2
                    }
                };

                 expect(SchemaValidator.validate(this.schema, obj).isValid).toBe(true);
            });


            it('invalid object - number too big', () => {
	             let obj = {
                    hello: 5,
                    world: false
                };

                expect(SchemaValidator.validate(this.schema, obj, {depth: 1}).isValid).toBe(false);
            });

            it('required', () => {
	             let obj = {
                    hello: 3
                };

                expect(SchemaValidator.validate(this.schema, obj, {depth: 1}).isValid).toBe(true);
            });

            it('missing required', () => {
	             let obj = {
                    world: true
                };

                expect(SchemaValidator.validate(this.schema, obj).isValid).toBe(false);
            });
        });
    });

    describe('vstar schema', () => {
        describe('simple', () => {

            beforeAll(() => {
                this.schema = Schema.schema();
            });

            it('valid fields', () => {
                let securitySchema = _.get(this.schema, 'console.application_control.security_posture');

                let obj = {
                    state: 2,
                    enabled: false
                };

                expect(SchemaValidator.validate(securitySchema, obj, {depth: 1}).isValid).toBe(true);
            });

            it('invalid field', () => {
                let securitySchema = _.get(this.schema, 'console.application_control.security_posture');

                let obj = {
                    state: 2,
                    enabled1: false
                };

                expect(SchemaValidator.validate(securitySchema, obj, {depth: 1}).isValid).toBe(false);
            });


            it('console message_settings', () => {
                let securitySchema = _.get(this.schema, 'console.settings.application_control.message_settings');

                let obj = {
                    access_denied: {
                        title: 'Title',
                        body: 'Body',
                        width: 1,
                        height: 1,
                    }
                };

                expect(SchemaValidator.validate(securitySchema, obj).isValid).toBe(true);
            });
        });
    });
});
