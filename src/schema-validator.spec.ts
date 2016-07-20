import * as _ from 'lodash';

import * as SchemaValidator from './schema-validator';
import * as Schema from './schema';

describe('Index Validation', () => {

    describe('simple', () => {

        beforeAll(() => {
            this.schema = Schema.schema();
        });

        it('state validation', () => {
            let securitySchema = _.get(this.schema, 'console.application_control.security_posture');

            let obj = {
                state: 2,
                enabled: false
            };

            expect(SchemaValidator.validate(securitySchema, obj)).toBe(true);
        });

        it('console message_settings', () => {
            let securitySchema = _.get(this.schema, 'console.settings.application_control.message_settings');

            console.log(securitySchema);

            let obj = {
                access_denied: 2,
                enabled: false
            };

            expect(SchemaValidator.validate(securitySchema, obj)).toBe(true);
        });
    });
});
