angular.module('app.services').factory('helper', helper);

function helper($window) {
    return {
        getCostItems: function() {
            return [{
                name: 'Agency Fee',
                accountingCode: '3210-4',
                amount: 8978.67,
                additionalPayment: null,
                comments: [{
                    author: 'Jane Doe',
                    text: 'At USD 1500 for first 3 days, thereafter USD 100 per day. Estimated 4 Days',
                    date: '2016-05-16T00:00:00.000Z'
                }, {
                    author: 'DA-Desk',
                    comment: 'Basis USD 1600 x ROE 3.66 = AED 5,856.00. For First 3 Days USD 1500 and thereafter USD 100 per day.',
                    date: '2016-05-17T00:00:00.000Z'
                }]
            }, {
                name: 'Communication',
                accountingCode: '',
                amount: 915.00,
                additionalPayment: null,
                comments: [{
                    author: 'Jane Doe',
                    text: 'Lump sum for Telefone, Telex, Fax and Email excluding postage of Final DA and excluding Satcom communication if any.',
                    date: '2016-05-16T00:00:00.000Z'
                }]
            }, {
                name: 'Customs Charges',
                accountingCode: '3210-2',
                amount: 750.00,
                additionalPayment: null,
                comments: [{
                    author: '',
                    text: 'Import cargo manifest filing with Port/Customs department.',
                    date: '2016-05-16T00:00:00.000Z'
                }]
            }, {
                name: '',
                accountingCode: '',
                amount: 0,
                additionalPayment: null,
                comments: [{
                    author: '',
                    text: '',
                    date: '2016-05-16T00:00:00.000Z'
                }, {
                    author: '',
                    comment: '',
                    date: '2016-05-17T00:00:00.000Z'
                }]
            }, {
                name: '',
                accountingCode: '',
                amount: 0,
                additionalPayment: null,
                comments: [{
                    author: '',
                    text: '',
                    date: '2016-05-16T00:00:00.000Z'
                }, {
                    author: '',
                    comment: '',
                    date: '2016-05-17T00:00:00.000Z'
                }]
            }];
        },

        getPorts: function() {
            return $window.marcuraApp.ports;
        }
    };
}
