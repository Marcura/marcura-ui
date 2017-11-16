angular.module('app.controllers').controller('uiSelectPageController', uiSelectPageController);

function uiSelectPageController($scope) {
    // $scope.currencies = [
    //     'BRL',
    //     'USD',
    //     'AED'
    // ];

    $scope.itemArray = [{
        id: 1,
        name: 'first'
    }, {
        id: 2,
        name: 'second'
    }, {
        id: 3,
        name: 'third'
    }, {
        id: 4,
        name: 'fourth'
    }, {
        id: 5,
        name: 'fifth'
    },];

    $scope.selected = {
        value: $scope.itemArray[0]
    };



    $scope.drinks = [{
        id: 1,
        description: 'Cola'
    }, {
        id: 2,
        description: 'Water'
    }];
    $scope.drink = {};

    $scope.refreshResults = function (select) {
        console.log('refreshResults');
        var search = select.search,
            list = angular.copy(select.items),
            id = -1;

        // Remove last user input.
        list = list.filter(function (item) {
            return item.id !== id;
        });

        if (!search) {
            // Use the predefined list.
            select.items = list;
        } else {
            // Manually add user input and set selection.
            var userInputItem = {
                id: id,
                description: search
            };

            select.items = [userInputItem].concat(list);
            select.selected = userInputItem;
        }
    };

    $scope.clear = function (event, select) {
        console.log('clear');
        event.stopPropagation();

        // To allow empty field, in order to force a selection remove the following line.
        select.selected = undefined;

        // Reset search query.
        select.search = undefined;

        // Focus and open the list.
        select.activate();
    };
}