describe('MaValidators service', function () {
    var MaValidators,
        MaHelper;

    beforeEach(module('marcuraUI.services'));
    beforeEach(inject(function (_MaHelper_, _MaValidators_) {
        MaHelper = _MaHelper_;
        MaValidators = _MaValidators_;
    }));

    describe('isNotEmpty method', function () {
        it('creates a validator which indicates whether a specified value is not empty', function () {
            var validator = MaValidators.isNotEmpty();

            expect(validator.name).toEqual('IsNotEmpty');
            expect(validator.validate('Paul Smith')).toEqual(true);
        });
    });

    describe('isGreater method', function () {
        it('creates a validator which indicates whether a specified value is greater than other value', function () {
            var validator = MaValidators.isGreater();

            expect(validator.name).toEqual('IsGreater');
            expect(MaValidators.isGreater(1).validate(2)).toEqual(true);
        });
    });

    describe('isLess method', function () {
        it('creates a validator which indicates whether a specified value is less than other value', function () {
            expect(MaValidators.isLess().name).toEqual('IsLess');
            expect(MaValidators.isLess(2).validate(1)).toEqual(true);
        });
    });

    describe('isNumber method', function () {
        it('creates a validator which indicates whether a specified value is a number', function () {
            expect(MaValidators.isNumber().name).toEqual('IsNumber');
            expect(MaValidators.isNumber().validate('20.10')).toEqual(true);
            expect(MaValidators.isNumber(true).validate('')).toEqual(true);
        });
    });

    describe('isEmail method', function () {
        it('creates a validator which indicates whether a specified value is an email', function () {
            expect(MaValidators.isEmail().name).toEqual('IsEmail');
            expect(MaValidators.isEmail().validate('p.smith@gmail.com')).toEqual(true);
            expect(MaValidators.isEmail().validate('p.smithgmail.com')).toEqual(false);
            expect(MaValidators.isEmail(true).validate('')).toEqual(true);
        });
    });
});