import * as _ from 'lodash';
import * as Joi from 'joi';

import * as SchemaValidator from './schema-validator';
import * as Schema from './schema-vstar-unit-tests';

let pathToDotted = (path) => {
    path = path || '';

    if (0 < path.length && '/' === path[0]) {
        path = path.slice(1);
    }
    path = path.replace(/\/+/g, '.');

    return path;
};

describe('Index Validation', () => {

    describe('vstar-unit-tests', () => {
        // describe('fail tests', () => {
        //     fit('test', () => {
        //         this.schema = Schema.schema();

        //         let test = { policy: 'notHexColour', path: '/settings/sub-object/regex' };
        //         let path = pathToDotted(test.path);

        //         let validateSchema = path ? _.get(this.schema, path) : this.schema;

        //         console.log(`${path} for ${JSON.stringify(test.policy)} in ${JSON.stringify(validateSchema)}`);

        //         let schemaValidation = this.schemaValidator.validate(validateSchema, test.policy);
        //         expect(schemaValidation.isValid).toBe(false);
        //     });
        // });

        describe('fail test', () => {

            this.schemaValidator = new SchemaValidator.Validator();
            this.schema = Schema.schema();

            this.failTests = [
                { policy: {}, path: '/settings/array' },
                { policy: [1], path: '/settings/array' },
                { policy: [{ sid: 'sid' }], path: '/settings/array' },
                { policy: [{ notAllowed: 'na', sid: 'sid', name: 'name' }], path: '/settings/array' },
                { policy: { string: 'name', boolean: true, number: 1, notAllowed: 'test' }, path: '/settings/sub-object' },
                { policy: 1, path: '/settings/sub-object/string' },
                { policy: true, path: '/settings/sub-object/string' },
                { policy: null, path: '/settings/sub-object/string' },
                { policy: 0, path: '/settings/sub-object/number' },
                { policy: 5, path: '/settings/sub-object/number' },
                { policy: -1, path: '/settings/sub-object/number' },
                { policy: 1, path: '/settings/sub-object/boolean' },
                { policy: 'str', path: '/settings/sub-object/boolean' },
                { policy: null, path: '/settings/sub-object/boolean' },
                { policy: 'notHexColour', path: '/settings/sub-object/regex' },
                { policy: 'str', path: '/settings/badger' },
                { policy: true, path: '/settings/badger' },
                { policy: null, path: '/settings/badger' },
                { policy: 1, path: '/settings' },
                { policy: 'fail', path: '/' },
                { policy: undefined, path: '/settings/sub-object/string' }
            ];

            this.failTests.forEach((test, index) => {
                it('validate policy - fails and throws PolicyValidationError ' + index, () => {
                    let path = pathToDotted(test.path);
                    let validateSchema = path ? _.get(this.schema, path) : this.schema;

                    console.log(`${path} for ${test.policy} in ${JSON.stringify(validateSchema)}`);

                    let schemaValidation = this.schemaValidator.validate(validateSchema, test.policy);
                    expect(schemaValidation.isValid).toBe(false);
                });
            });
        });

        describe('success test', () => {
            it('test', () => {
                this.schema = Schema.schema();

                let test = { policy: '', path: '/settings/sub-object/string' };
                let path = pathToDotted(test.path);

                let validateSchema = path ? _.get(this.schema, path) : this.schema;

                console.log(`${path} for ${JSON.stringify(test.policy)} in ${JSON.stringify(validateSchema)}`);

                let schemaValidation = this.schemaValidator.validate(validateSchema, test.policy);
                expect(schemaValidation.isValid).toBe(true);
            });
        });

        describe('success tests', () => {

            this.schemaValidator = new SchemaValidator.Validator();
            this.schema = Schema.schema();

            this.successTests = [
                { policy: [], path: '/settings/array' },
                { policy: [{ sid: 'sid', name: 'name' }], path: '/settings/array' },
                { policy: [{ name: 'name' }], path: '/settings/array' },
                { policy: { string: 'name', boolean: true, number: 1 }, path: '/settings/sub-object' },
                { policy: { string: 'name', boolean: true }, path: '/settings/sub-object' },
                { policy: '', path: '/settings/sub-object/string' },
                { policy: 1, path: '/settings/sub-object/number' },
                { policy: 2, path: '/settings/sub-object/number' },
                { policy: 3, path: '/settings/sub-object/number' },
                { policy: 4, path: '/settings/sub-object/number' },
                { policy: true, path: '/settings/sub-object/boolean' },
                { policy: false, path: '/settings/sub-object/boolean' },
                { policy: '#FA0', path: '/settings/sub-object/regex' },
                { policy: '#FA0912', path: '/settings/sub-object/regex' },
                { policy: 99999, path: '/settings/badger' },
                {
                    policy: { array: <any[]>[], 'sub-object': { string: '', boolean: true, number: 1 }, badger: 500 },
                    path: '/settings'
                },
                {
                    policy: {
                        settings: {
                            array: <any[]>[],
                            'sub-object': { string: '', boolean: true, number: 1 },
                            badger: 500
                        }
                    }, path: '/'
                },
                {
                    policy: { settings: { array: [], 'sub-object': { string: '', boolean: true, number: 1 }, badger: 500 } },
                    path: ''
                }
            ];

            this.successTests.forEach((test, index) => {
                it('validate policy - success - no error thrown ' + index, () => {
                    let path = pathToDotted(test.path);
                    let validateSchema = path ? _.get(this.schema, path) : this.schema;

                    console.log(`${path} for ${test.policy} in ${JSON.stringify(validateSchema)}`);

                    let schemaValidation = this.schemaValidator.validate(validateSchema, test.policy);
                    expect(schemaValidation.isValid).toBe(true);
                });
            });
        });
    });
});
