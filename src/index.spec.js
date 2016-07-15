"use strict";
var _this = this;
var Joi = require('joi');
describe('joi validation', function () {
    describe('simple', function () {
        it('is a number', function () {
            expect(Joi.validate(1, Joi.number()).error).toBeNull();
        });
        it('is not a number', function () {
            expect(Joi.validate('a', Joi.number()).error).toBeDefined();
        });
        it('is not a number (assert)', function () {
            expect(function () { Joi.assert('a', Joi.number()); }).toThrow();
        });
    });
    describe('create', function () {
        beforeAll(function () {
            _this.joiSchema = Joi.object({
                a: Joi.string(),
                b: Joi.number().integer().positive()
            });
        });
        it('is a valid object', function () {
            var obj = {
                a: 'hello',
                b: 2
            };
            expect(Joi.validate(obj, _this.joiSchema).error).toBeNull();
        });
        it('is not a valid object', function () {
            var obj = {
                a: 2,
                b: 'hello'
            };
            expect(Joi.validate(obj, _this.joiSchema).error).toBeDefined();
        });
    });
});
//# sourceMappingURL=index.spec.js.map