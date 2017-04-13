var app = angular.module('plunker', []);


PanelController.$inject = ['$element','$timeout','$rootScope'];

function PanelController($element,$timeout,$rootScope) {
    var $ctrl = this;

    $ctrl.close = function () {
        // $element.remove();
    };

    $ctrl.onShow = function () {};

    $ctrl.$onInit = $onInit;
    $ctrl.$onDestroy = $onDestroy;
    $rootScope.$on("abc",function(){
        console.log("got it")
    });
    function $onInit() {
        console.log(0,$element);
        var srcEl = angular.element(document.querySelector($ctrl.source));
        console.log(srcEl)
        srcEl.attr('panel', '$ctrl');
        $timeout(function () {
            console.log(1,$element.find)
            $element
                .find('my-panel')
                .append(srcEl
                    .css('display', 'block')
                );

        },500);

        $ctrl.onShow();
        
        var bodyRect = document.body.getBoundingClientRect(),
            elRect = $element[0].getBoundingClientRect(),
            position = {
                left: '',
                top: '',
                right: '',
                bottom: ''
            };

        position.top = (bodyRect.height - elRect.height) / 4; //eslint-disable-line no-magic-numbers
        position.left = (bodyRect.width - elRect.width) / 2; //eslint-disable-line no-magic-numbers

        $element.css('top', position.top + 'px');
        $element.css('left', position.left + 'px');
    }

    function $onDestroy() {}
}

function DialogComponentController($rootScope) {
    var $ctrl = this;
    setTimeout(function(){
    $rootScope.$emit("abc");        
    },5000);

    $ctrl.actions = {
        close: function (event, button) {

            event.preventDefault();
            event.stopPropagation();

            $ctrl.instance.hide(button);
        }
    };

    $ctrl.$onInit = $onInit;
    $ctrl.$onDestroy = $onDestroy;

    $ctrl.$onChanges = function () {};
    setTimeout(function(){
       console.log(45,$ctrl);
    },1000);
    function $onInit() {}

    function $onDestroy() {}
}


app.component('ccmDialog', {
    template: `<div style="border: 1px solid green; margin: 5px"><label for="" ng-bind="a"></label>
        <input type="text" ng-model="a"></div>`,
    controller: DialogComponentController,

    bindings: {
        panel: '<',
        panelShown: '&'
    }
});
app.component('ccmPanel', {
    template: '<div>' +
        '<my-panel style="border: 1px solid red" class="panel a" ng-click="$ctrl.close()">panel</my-panel>' +
        '</div>',
    controller: PanelController,
    bindings: {
        source: '='
    }
});

app.controller('MainCtrl', function ($rootScope, $scope, $compile) {
    $scope.name = 'World';

    $scope.open = function (source, target) {
        var scope = $rootScope.$new();

        scope.$ctrl = {
            source: source
        };

        var el = $compile('<ccm-panel source="$ctrl.source" style="position: absolute;"></ccm-panel>')(scope);

        angular.element(document.querySelector(target)).append(el);
    }
});