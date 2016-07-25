import * as _ from 'lodash';
import * as Joi from 'joi';

import * as SchemaValidator from './schema-validator';
import * as Schema from './schema';

describe('Index Validation', () => {

    describe('simple schema', () => {
        describe('simple', () => {

            beforeAll(() => {
                this.simpleSchema = {
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
                };

                this.schema = new SchemaValidator.Validator({ schema: this.simpleSchema });
            });

            it('empty object', () => {
                let test = {
                    path: '/',
                    policy: {}
                };

                try {
                    let schemaValidation = this.schema.validatePolicy(test.policy, test.path);
                    expect(schemaValidation.isValid).toBe(false);
                } catch (err) {
                    expect(err.name).toEqual('PolicyValidationErr');
                }
            });

            it('invalid object', () => {
                let test = {
                    path: '/',
                    policy: {
                        hello: 2,
                        world: false
                    }
                };

                try {
                    let schemaValidation = this.schema.validatePolicy(test.policy, test.path);
                    expect(schemaValidation.isValid).toBe(false);
                } catch (err) {
                    expect(err.name).toEqual('PolicyValidationErr');
                }
            });

            it('valid object', () => {
                let test = {
                    path: '/',
                    policy: {
                        hello: 2,
                        world: false,
                        deep: {
                            subDeep: 2
                        }
                    }
                };

                try {
                    let schemaValidation = this.schema.validatePolicy(test.policy, test.path);
                    expect(schemaValidation.isValid).toBe(true);
                } catch (err) {
                    expect(err).toBeNull();
                }
            });

            it('invalid object - number too big', () => {
                let test = {
                    path: '/',
                    policy: {
                        hello: 2,
                        world: false,
                        deep: {
                            subDeep: 11
                        }
                    }
                };

                try {
                    let schemaValidation = this.schema.validatePolicy(test.policy, test.path);
                    expect(schemaValidation.isValid).toBe(false);
                } catch (err) {
                    expect(err.name).toEqual('PolicyValidationErr');
                }
            });

            it('required', () => {
                let test = {
                    path: '/',
                    policy: {
                        hello: 2,
                        deep: {
                            subDeep: 2
                        }
                    }
                };

                try {
                    let schemaValidation = this.schema.validatePolicy(test.policy, test.path);
                    expect(schemaValidation.isValid).toBe(true);
                } catch (err) {
                    expect(err).toBeNull();
                }
            });

            it('missing requireds', () => {
                let test = {
                    path: '/',
                    policy: {
                        world: true
                    }
                };

                try {
                    let schemaValidation = this.schema.validatePolicy(test.policy, test.path);
                    expect(schemaValidation.isValid).toBe(false);
                } catch (err) {
                    expect(err.name).toEqual('PolicyValidationErr');
                }
            });
        });
    });

    describe('vstar schema', () => {

        describe('simple', () => {

            beforeAll(() => {

                this.schema = new SchemaValidator.Validator(Schema.schema());
            });

            it('valid fields', () => {

                let test = {
                    path: '/console/application_control/security_posture',
                    policy: {
                        state: 2,
                        enabled: false
                    }
                };

                try {
                    let schemaValidation = this.schema.validatePolicy(test.policy, test.path);
                    expect(schemaValidation.isValid).toBe(true);
                } catch (err) {
                    expect(err).toBeNull();
                }
            });

            it('invalid field', () => {

                let test = {
                    path: '/console/application_control/security_posture',
                    policy: {
                        state: 2,
                        enabled1: false
                    }
                };

                try {
                    let schemaValidation = this.schema.validatePolicy(test.policy, test.path);
                    expect(schemaValidation.isValid).toBe(false);
                } catch (err) {
                    expect(err.name).toEqual('PolicyValidationErr');
                }
            });


            it('console message_settings', () => {

                let test = {
                    path: '/console/settings/application_control/message_settings',
                    policy: {
                        access_denied: {
                            title: 'Title',
                            body: 'Body',
                            width: 1,
                            height: 1,
                        }
                    }
                };

                try {
                    let schemaValidation = this.schema.validatePolicy(test.policy, test.path);
                    expect(schemaValidation.isValid).toBe(true);
                } catch (err) {
                    expect(err).toBeNull();
                }
            });
        });
    });
});
