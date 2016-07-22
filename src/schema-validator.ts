import * as Joi from 'joi';
import * as _ from 'lodash';

export function validate(schema, payload, options?) {
    if (!schema || !payload) {
        return { isValid: false, message: 'Invalid arguments' };
    }

    let validation = Joi.validate(payload, Joi[schema.$type]());
    if (validation.error) {
        return { isValid: false, message: validation.error };
    }

    options = options ? _.clone(options) : {};

    let schemaValidator = generateSchemaValidator(schema, options);
    validation = Joi.validate(payload, schemaValidator);
    if (validation.error) {
        return { isValid: false, message: validation.error };
    }

    return { isValid: true };
};

function generateSchemaValidator(schema, options?) {
    let schemaValidator;
    if ('array' === schema.$type) {
        schemaValidator = Joi.array();
        schema.$type = 'object';
        let propertySchemaValidator = generateSchemaValidator(schema, options);
        schemaValidator = schemaValidator.items(propertySchemaValidator);
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

                let propertySchemaValidator = generateSchemaValidator(propertySchema, options);
                if (propertySchemaValidator) {
                    if (!schema.$required || _.includes(schema.$required, property)) {
                        propertySchemaValidator = propertySchemaValidator.required();
                    }

                    let propertySchemaValidatorKey = {};
                    propertySchemaValidatorKey[property] = propertySchemaValidator;

                    schemaValidator = schemaValidator.keys(propertySchemaValidatorKey);
                }
            }
        }
    } else if ('number' === schema.$type) {
        schemaValidator = Joi.number();

        if (_.has(schema, '$minimum')) {
            schemaValidator = schemaValidator.min(schema.$minimum);
        }

        if (_.has(schema, '$maximum')) {
            schemaValidator = schemaValidator.max(schema.$maximum);
        }
    } else if ('boolean' === schema.$type) {
        schemaValidator = Joi.boolean().strict();
    } else if ('string' === schema.$type) {
        schemaValidator = Joi.string();
        if (_.has(schema, '$pattern')) {
            schemaValidator = schemaValidator.regex(new RegExp(schema.$pattern));
        }
    } else {
        schemaValidator = Joi[schema.$type]();
    }

    return schemaValidator;
}
