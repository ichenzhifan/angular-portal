(function () {
    'use-strict';

    angular.module(globals.appName + globals.controllers).controller('achievementController', [
        '$scope', 'achievementService', function ($scope, achievementService) {
            var tempBadges = [];
            $scope.badges = [];

            //#endregion 
            $scope.badgeTypes = [
               { key: 0, value: "Alla" },
               { key: 1, value: "Ej ännu erhållna" },
               { key: 2, value: "Erhållna" }
            ];

            $scope.dropdown = {
                defaultValue: "Alla",
                isOpen: false
            };
            tempBadges = angular.copy($scope.badges);

            $scope.filterBadges = function ($event, type) {
                $event.preventDefault();
                $event.stopPropagation();
                // close dropdown list.                
                $scope.dropdown.isOpen = false;

                $scope.dropdown.defaultValue = type.value;
                if (type.value === "Alla") {
                    $scope.badges = tempBadges;
                    return;
                }

                $scope.badges = tempBadges.filter(function (item) {
                	if (type.value === "Erhållna") {
                        return item.completed !== null;
                    }
                    return item.completed === null;
                });
            };

            // INIT
            $scope.$on('achievement.getAllBadges.done', function (event, badges) {
                $scope.badges = badges;
                tempBadges = angular.copy(badges);
            });

            $scope.$on('pusher.badge.added', function (event, badge) {
                $scope.badges.push(badge);
                tempBadges = angular.copy($scope.badges);
            });

            // FAILED
            $scope.$on('achievement.getAllBadges.failed', function (event, data) {
                $scope.badges = [];
                tempBadges = [];
            });

            achievementService.getAllBadges();
        }]);
}());