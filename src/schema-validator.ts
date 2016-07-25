import * as Joi from 'joi';
import * as _ from 'lodash';

export class Validator {

    public validate(schema, payload, options?) {

        if (undefined === schema || 0 === schema.length || undefined === payload) {
            return { isValid: false, message: 'Invalid arguments' };
        }

        options = options ? _.clone(options) : {};

        let schemaValidator = this.generateSchemaValidator(schema, options);
        let validation = Joi.validate(payload, schemaValidator);
        if (validation.error) {
            return { isValid: false, message: validation.error.message };
        }

        return { isValid: true, message: 'valid' };
    };

    private generateSchemaValidator(schema: any, options?: any): Joi.Schema {

        let schemaValidator: Joi.Schema;

        if ('array' === schema.$type) {
            schemaValidator = Joi.array();
            schema.$type = 'object';
            let propertySchemaValidator = this.generateSchemaValidator(schema, options);
            schemaValidator = (<Joi.ArraySchema>schemaValidator).items(propertySchemaValidator);
            schema.$type = 'array';
        } else if ('object' === schema.$type) {
            if (_.has(options, 'depth')) {
                --options.depth;
            }

            if (!_.has(options, 'depth') || 0 <= options.depth) {
                schemaValidator = Joi.object();

                for (let i = 0; schema.$properties && i < schema.$properties.length; ++i) {
                    let property = schema.$properties[i];
                    let propertySchema = schema[property];

                    let propertySchemaValidator = this.generateSchemaValidator(propertySchema, options);
                    if (propertySchemaValidator) {
                        if (!schema.$required || _.includes(schema.$required, property)) {
                            propertySchemaValidator = propertySchemaValidator.required();
                        }

                        let propertySchemaValidatorKey: any = {};
                        propertySchemaValidatorKey[property] = propertySchemaValidator;

                        schemaValidator = (<Joi.ObjectSchema>schemaValidator).keys(propertySchemaValidatorKey);
                    }
                }
            }
        } else if ('number' === schema.$type) {
            schemaValidator = Joi.number();

            if (_.has(schema, '$minimum')) {
                schemaValidator = (<Joi.NumberSchema>schemaValidator).min(schema.$minimum);
            }

            if (_.has(schema, '$maximum')) {
                schemaValidator = (<Joi.NumberSchema>schemaValidator).max(schema.$maximum);
            }
        } else if ('boolean' === schema.$type) {
            schemaValidator = Joi.boolean().strict();
        } else if ('string' === schema.$type) {
            schemaValidator = Joi.string();
            if (_.has(schema, '$pattern')) {
                schemaValidator = (<Joi.StringSchema>schemaValidator).regex(new RegExp(schema.$pattern));
            }
        } else {
            let type: string = schema.$type;
            schemaValidator = (<any>Joi)[type]();
        }

        return schemaValidator;
    }
}
