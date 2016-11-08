describe('maHelper service', function() {
    var maValidators,
        maHelper;

    beforeEach(module('marcuraUI.services'));
    beforeEach(inject(function(_maHelper_, _maValidators_) {
        maHelper = _maHelper_;
        maValidators = _maValidators_;
    }));

    describe('isNotEmpty method', function () {
        it('creates a validator which indicates whether a specified value is not empty', function () {
            var validator = maValidators.isNotEmpty();

            expect(validator.name).toEqual('IsNotEmpty');
            expect(validator.validate('Paul Smith')).toEqual(true);
        });
    });

    describe('isGreater method', function () {
        it('creates a validator which indicates whether a specified value is greater than other value', function () {
            var validator = maValidators.isGreater();

            expect(validator.name).toEqual('IsGreater');
            expect(maValidators.isGreater(1).validate(2)).toEqual(true);
        });
    });

    describe('isLess method', function () {
        it('creates a validator which indicates whether a specified value is less than other value', function () {
            var validator = maValidators.isLess();

            expect(validator.name).toEqual('IsLess');
            expect(maValidators.isLess(2).validate(1)).toEqual(true);
        });
    });
});
