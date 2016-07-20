import * as Joi from 'joi';

export function validate(schema, payload, options?) {
    if (!Joi.validate(payload, Joi[schema.$type]())) {
        return false;
    }

    switch (schema.$type) {
        case 'number':
            if (schema.$minimum) {
                if (!Joi.validate(payload, Joi[schema.$type]().min(payload))) {
                    return false;
                }

                if (!Joi.validate(payload, Joi[schema.$type]().max(payload))) {
                    return false;
                }
            }
            break;
    }

    for (let i = 0; schema.$properties && i < schema.$properties.length; ++i) {
        let property = schema.$properties[i];

        let subSchema = schema[property];
        if (!validate(subSchema, payload[property])) {
            return false;
        }
    }

    return true;
};
