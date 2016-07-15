import * as Index from './';

describe('Index Validation', () => {

    describe('simple', () => {

        it('hello', () => {
            expect(Index.hello()).toBe(true);
        });

        it('world', () => {
            expect(Index.world()).toBe(true);
        });

    });
});