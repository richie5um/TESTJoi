import * as Joi from 'joi';
import * as _ from 'lodash';

import {PolicyValidationError} from './policy-validation-error';

export class Validator {

    public schemas: any = {};

    constructor(private policySchema: any) {

        this.buildSchemaValidator(policySchema.schema, '/');
    }

    public validatePolicy(config: any, path?: string, options?: any) {

        if (config === undefined) {
            throw new PolicyValidationError(['policy must not be null']);
        }

        // Always suffix paths
        let schemaPath = (path && path !== '/') ? `${path}/` : '/';
        let schema = _.get(this.schemas, schemaPath);
        if (schema === undefined) {
            throw new PolicyValidationError([`Unable to find schema for ${path}`]);
        }

        let  validation = this.validate(schema, config, options);
        if (!validation.isValid) {
            throw new PolicyValidationError([validation.message]);
        }

        return validation;
    }

    private validate(schema: any, payload: any, options?: any): Policy.ValidatorResponse {

        options = options ? _.clone(options) : {};

        let validation = Joi.validate(payload, schema);
        if (validation.error) {
            return { isValid: false, message: validation.error.message };
        }

        return { isValid: true, message: 'valid' };
    };

    private buildSchemaValidator(schema: any, path: string): Joi.Schema {

        let schemaValidator: Joi.Schema;

        if (schema.$type === 'array') {
            schemaValidator = Joi.array();

            // Temporarily modify to be object (as arrays always contain objects) so we can generate the sub-schema
            schema.$type = 'object';
            let propertySchemaValidator = this.buildSchemaValidator(schema, path);

            // We need to accept the $id which is the database row id and is used to identify items in the array
            propertySchemaValidator = (<Joi.ObjectSchema>propertySchemaValidator).keys({ $id: Joi.number() });

            schemaValidator = (<Joi.ArraySchema>schemaValidator).items(propertySchemaValidator);

            // Revert back to being an object
            schema.$type = 'array';
        } else if (schema.$type === 'object') {
            schemaValidator = Joi.object();

            if (schema.$properties && 0 < schema.$properties.length) {
                for (let i = 0; i < schema.$properties.length; ++i) {
                    let property = schema.$properties[i];
                    let propertySchema = schema[property];

                    let propertySchemaValidator = this.buildSchemaValidator(propertySchema, `${path}${property}/`);
                    if (propertySchemaValidator) {
                        if (!schema.$required || _.includes(schema.$required, property)) {
                            propertySchemaValidator = propertySchemaValidator.required();
                        }

                        let propertySchemaValidatorKey: any = {};
                        propertySchemaValidatorKey[property] = propertySchemaValidator;

                        schemaValidator = (<Joi.ObjectSchema>schemaValidator).keys(propertySchemaValidatorKey);
                    }
                }
            } else {
                // Default to forced empty if there are no properties.
                schemaValidator = (<Joi.ObjectSchema>schemaValidator).keys({});
            }
        } else if (schema.$type === 'number') {
            schemaValidator = Joi.number();

            if (_.has(schema, '$minimum')) {
                schemaValidator = (<Joi.NumberSchema>schemaValidator).min(schema.$minimum);
            }

            if (_.has(schema, '$maximum')) {
                schemaValidator = (<Joi.NumberSchema>schemaValidator).max(schema.$maximum);
            }
        } else if (schema.$type === 'boolean') {
            schemaValidator = Joi.boolean().strict();
        } else if (schema.$type === 'string') {
            schemaValidator = Joi.string().allow('');
            if (_.has(schema, '$pattern')) {
                schemaValidator = (<Joi.StringSchema>schemaValidator).regex(new RegExp(schema.$pattern));
            }
        } else {
            // Disallow any unsupported types
            schemaValidator = Joi.any().forbidden();
        }

        this.schemas[path] = schemaValidator;
        return schemaValidator;
    }
}
