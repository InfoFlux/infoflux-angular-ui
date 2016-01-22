angular.module('if.ui').directive('listview', listview);

listview.$inject = ['$window', '$compile'];

function listview($window, $compile) {


    var controller = ['$scope', '$element', function ($scope, $element) {
        $scope.lvUniqueIdChk = $element.context.uniqueNumber + 'chk';
        $scope.selectAll = { checked: false, indeterminate: false };
        $scope.$$initialized = false;
        $scope.$$currentItem;
        $scope.$$currentIndex = -1;
        $scope.$$modelChange = false;
        $scope.hasFocus = false;

        $scope.select = function (item, $event, $index) {
            if ($event) {
                //$event.preventDefault();
                $event.stopPropagation();
            }

            if ($scope.$$currentItem) $scope.$$currentItem.$$selected = false;
            $scope.$$currentItem = item;
            $scope.$$currentItem.$$selected = true;

            if (!$scope.multiselect) {
                $scope.$$modelChange = true;
                if (angular.isDefined($scope.valueMember)) {
                    $scope.model = $scope.$$currentItem[$scope.valueMember];
                }
                else {
                    $scope.model = item;
                }
            }

            if ($index >= 0) $scope.$currentIndex = $index;

        }

        function reset() {

            $scope.$currentIndex = -1;
            if ($scope.multiselect) {
                angular.forEach($scope.data, function (item) {
                    if (item.$$checked) item.$$checked = false;
                });
                $scope.$$modelChange = true;
                $scope.model = [];
                $scope.selectAll.checked = false;
                $scope.selectAll.indeterminate = false;
                setIndeterminateState();
            }

            if ($scope.$$currentItem) {
                $scope.$$currentItem.$$selected = false;

            }

        }

        function isEqual(item, modelItem) {
            return angular.isDefined($scope.valueMember) ? angular.equals(modelItem, item[$scope.valueMember]) : angular.equals(modelItem, item);
        }

        function init() {
            //if (!angular.isUndefined($scope.options)) {

            //    angular.extend($scope.$$options, $scope.options);
            //}

            if (!angular.isDefined($scope.itemtemplate)) {
                $scope.itemtemplate = 'if-ui/listview/lv-item.html';
            }
            if ($scope.multiselect) {

                if (angular.isDefined($scope.model)) {

                    if (!angular.isArray($scope.model)) {
                        throw "Model must be an array!";
                    }
                    else {
                        angular.forEach($scope.model, function (modelItem) {
                            angular.forEach($scope.data, function (item) {
                                //if (angular.equals(modelItem, item)) item.$$checked = true;
                                if (isEqual(item, modelItem)) item.$$checked = true;
                            });

                        });
                    }
                }
                else {
                    $scope.$$modelChange = true;
                    $scope.model = [];
                }

            }
            else {
                if (angular.isDefined($scope.model)) {
                    angular.forEach($scope.data, function (item) {

                        //var equals = angular.isDefined($scope.valueMember) ? angular.equals($scope.model, item[$scope.valueMember]) : angular.equals($scope.model, item);

                        if (isEqual(item, $scope.model)) {
                            $scope.$$currentItem = item;
                            item.$$selected = true;
                            $scope.$$modelChange = true;

                            if (angular.isDefined($scope.valueMember)) {
                                $scope.model = $scope.$$currentItem[$scope.valueMember];
                            }
                            else {
                                $scope.model = item;
                            }
                        }
                    });
                }
            }

            $scope.$$initialized = true;
        }

        $scope.itemChecked = function (item, $index, $event) {
            if ($scope.multiselect) {

                $scope.$$modelChange = true;

                if (item.$$checked) {

                    if (angular.isDefined($scope.valueMember)) {
                        $scope.model.push(item[$scope.valueMember]);
                    }
                    else {
                        $scope.model.push(item);
                    }



                    if (isAllChecked() && $scope.selectAll.checked) {

                        $scope.selectAll.indeterminate = false;

                    }

                    if (!$scope.selectAll.checked) {
                        $scope.selectAll.indeterminate = true;
                    }


                }
                else {
                    removeItem(item);

                    if ($scope.selectAll.checked) {


                        if ($scope.model.length == 0) {
                            $scope.selectAll.checked = false;
                            $scope.selectAll.indeterminate = false;
                        }
                        else {
                            $scope.selectAll.indeterminate = true;
                        }


                    }
                    else {
                        if ($scope.model.length == 0) {
                            $scope.selectAll.indeterminate = false;
                        }
                    }
                }
                setIndeterminateState();
            }
        }

        $scope.selectAllClicked = function () {
            //  console.info('selectAllClicked');
            if ($scope.selectAll.checked) {
                $scope.model = [];

                angular.forEach($scope.data, function (item) {
                    item.$$checked = true;
                    if (angular.isDefined($scope.valueMember)) $scope.model.push(item[$scope.valueMember]);
                    else $scope.model.push(item);
                });

            }
            else {
                reset();
            }
        }
        function removeItem(item) {
            for (var i = $scope.model.length - 1; i >= 0; i--) {

                if (isEqual(item, $scope.model[i])) {
                    $scope.model.splice(i, 1);
                }
            }
        }

        function isAllChecked() {
            var allchecked = true;
            angular.forEach($scope.data, function (item) {
                if (!item.$$checked) allchecked = false;
            });
            return allchecked;
        }

        function setIndeterminateState() {
            var chk = $('#' + $scope.lvUniqueIdChk);
            chk.prop('indeterminate', $scope.selectAll.indeterminate);
        }


        $scope.keydown = function ($event) {
            if ($event.keyCode == 32) $event.preventDefault();
            $event.stopPropagation();

            //In multiselect when user either presses enter or space the current item is checked
            if ($scope.multiselect && ($event.keyCode == 32 || $event.keyCode == 13)) {
                if (angular.isUndefined($scope.data[$scope.$currentIndex].$$checked)) $scope.data[$scope.$currentIndex].$$checked = true;
                else $scope.data[$scope.$currentIndex].$$checked = !$scope.data[$scope.$currentIndex].$$checked;
                $scope.itemChecked($scope.data[$scope.$currentIndex]);
            }
            //Key down, move the current item one forward
            if ($event.keyCode == 40 && $scope.$currentIndex < $scope.data.length - 1) {
                $scope.$currentIndex++;
            }
            //Key up, move the current item one position back
            if ($event.keyCode == 38 && $scope.$currentIndex > 0) {
                $scope.$currentIndex--;

            }
            //Set current item and change selected state
            $scope.$$currentItem.$$selected = false;
            $scope.data[$scope.$currentIndex].$$selected = true;
            $scope.$$currentItem = $scope.data[$scope.$currentIndex];


            if (!$scope.multiselect) {

                $scope.$$modelChange = true;
                $scope.model = angular.isDefined($scope.valueMember) ? $scope.$$currentItem[$scope.valueMember] : $scope.$$currentItem;

                /* 
                if (angular.isDefined($scope.valueMember)) {
                    $scope.model = $scope.$$currentItem[$scope.valueMember];
                }
                else {
                    $scope.model = $scope.data[$scope.$currentIndex];
                }*/
            }


        }

        $scope.getItemDisplay = function (item) {
            if ($scope.displayMember) {
                return getItemPropertyValue(item, $scope.displayMember);
            }
            return item;
        }
        /*
        TODO:
        Model changed to empty/null
        Model change to other value then selected

        
        */

        $scope.$watch('data', function (newValue, oldValue) {
            if (!angular.equals(newValue, oldValue)) {
                $scope.$$modelChange = true;
                if ($scope.multiselect) $scope.model = [];
                else $scope.model = null;
                $scope.$$currentItem = null;
                $scope.$$currentIndex = -1;
            }
        });


        $scope.$watch('model', function (newValue, oldValue) {
            //Check if model change has been triggered outside directive and if the model has changed
            if ($scope.$$initialized && !$scope.$$modelChange && !angular.equals(newValue, oldValue)) {
                if (newValue) {

                    if ($scope.multiselect) {
                        if (!angular.isArray(newValue) || newValue.length == 0) {
                            reset();
                            $scope.$$allSelected = false;
                            $scope.selectAll.indeterminate = false;
                            setIndeterminateState();
                        }
                        else {
                            if (newValue.length == $scope.data.length) $scope.$$allSelected = true;
                            else $scope.$$allSelected = false;
                            //Set internal model change flag to prevent handler to be triggered during model manipulation
                            $scope.$$modelChange = true;

                            $scope.$$modelChange = false;
                        }
                    }
                    else {

                        var item = angular.isDefined($scope.valueMember) ? getItemByValueMember(newValue) : newValue;
                        /*
                        if (angular.isDefined($scope.valueMember))
                        {
                            var item = getItemByValueMember(newValue);
                        }
                        else $scope.select(newValue);
                        */
                        $scope.select(item);
                    }

                }
                else reset();
            }
            //If internal model change reset the model change switch
            if ($scope.$$modelChange) $scope.$$modelChange = false;

        });

        /*   $scope.$watch('data', function (newValue, oldValue) {
               $scope.$data = angular.copy($scope.data);
           });*/
        init();
    }];

    var directive = {
        link: link,
        controller: controller,
        restrict: 'EA',
        templateUrl : 'if.ui/listview/listview.html',
        scope: {
            options: '=?',
            data: '=',
            model: '=ngModel',
            displayMember: '@?',
            valueMember: '@?',
            placeholder: '@?',
            multiselect: '=?',
            itemtemplate: '@?'
        }
    };
    return directive;

    function link(scope, element, attrs) {
        //element.html(GetTemplate());
        //$compile(element.contents())(scope);
    }



    function getItemByValueMember(val) {
        angular.forEach($scope.data, function (item) {
            if (angular.isEqual(val, item[$scope.valueMember])) return item;
        });
    }

    function getItemPropertyValue(item, property) {
        var propertyValue;

        var properties = property.split('.');

        if (properties.length > 1) {
            var propertyValue = item;
            angular.forEach(properties, function (field) {
                if (!angular.isUndefined(propertyValue) && propertyValue) propertyValue = propertyValue[field];
            });


        }
        else {
            propertyValue = item[property];
        }

        return propertyValue;
    }
}
