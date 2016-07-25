import * as Index from './';

describe('Index Validation', () => {

    describe('simple', () => {

        it('True check', () => {
            expect(Index.returnTrue()).toBe(true);
        });

        it('False check', () => {
            expect(Index.returnFalse()).toBe(false);
        });

    });
});