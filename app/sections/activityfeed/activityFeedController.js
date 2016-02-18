(function () {
    'use strict';

    angular.module(globals.appName + globals.controllers).controller('activityFeedController', [
		 '$scope', 'activityFeedService', 'accountHandler', 'paths',
			function ($scope, activityFeedService, accountHandler, paths) {
			    var o = { isPosting: false },
                    currentPage = 1,
			        totalPages = 1;

			    $scope.filteredUsers = [];
			    $scope.users = [];
			    $scope.newsfeed = [];

			    //#region Scope functions
			    $scope.like = function (news) {
			        activityFeedService.like(news);
			    };

			    $scope.dislike = function (news) {
			        activityFeedService.dislike(news);
			    };

			    $scope.toggleCommentPane = function (news) {
			        news.isShowCommentPanel = !news.isShowCommentPanel;
			    }

			    $scope.comment = function (news, obj) {
			        o = obj;
			        obj.isPosting = true;
			        activityFeedService.comment(news, obj.message);
			    };

			    $scope.deleteComment = function (news, comment) {
			        activityFeedService.deleteComment(news, comment);
			    };

			    $scope.showCommentToggle = function (length) {
			        return length > 3;
			    };

			    $scope.removeFilteredUser = function (user) {
			        // reset to default value.
			        $scope.newsfeed = [];
			        currentPage = 1;

			        if (user.fake) {
			            $scope.filteredUsers = [];
			            // always put fake account in the first.
			            $scope.users.unshift(user);

			            // get all feeds.
			            activityFeedService.getActivityFeedByUsers([]);
			        } else {
			            $scope.filteredUsers.splice($scope.filteredUsers.indexOf(user), 1);

			            $scope.users.push(user, 1);
			            $scope.users.sortBy("fullName");

			            // get feeds by filters.
			            activityFeedService.getActivityFeedByUsers($scope.filteredUsers);
			        }
			    };

			    $scope.addFilteredUser = function ($item) {
			        // reset to default value.
			        $scope.newsfeed = [];
			        currentPage = 1;

			        if ($item.fake) {
			            // fake account always in the first one.
			            $scope.users.splice(0, 1);

			            $scope.users = $scope.users.concat($scope.filteredUsers);
			            $scope.users.sortBy("fullName");

			            $scope.filteredUsers = [$item];

			            // get all feeds.
			            activityFeedService.getActivityFeedByUsers([]);
			        } else {
			            // check if fake account is added. if added, remove it before selecting another user.
			            if ($scope.filteredUsers &&
                            $scope.filteredUsers.length !== 0 &&
                            $scope.filteredUsers[0].fake) {
			                // fake account is in users array.
			                $scope.users.unshift($scope.filteredUsers[0]);
			                $scope.filteredUsers.splice(0, 1);
			            }
			            $scope.filteredUsers.push($item);
			            $scope.users.splice($scope.users.indexOf($item), 1);

			            // get feeds by filters.
			            activityFeedService.getActivityFeedByUsers($scope.filteredUsers);
			        }
			    };

			    // TODO: Move to activityFeedService
			    $scope.isLiking = function (news) {
			        var theLike = _.find(news.likes, function (aLike) {
			            return aLike.user.id === $scope.user.id;
			        });
			        return typeof (theLike) !== "undefined";
			    };

			    $scope.isCurrentUser = function (user) {
			        return user.id === $scope.user.id;
			    };

			    //#endregion

			    //#region Subscriptions
			    $scope.$on('activityChallenged', function (event, data) {
			        activityFeedService.activityChallenged(data);
			    });

			    // automatic load more feed when wheel hit the bottom.
			    $scope.$on("activityfeed.hit.bottom", function (event, data) {
			        if (currentPage <= totalPages) {
			            activityFeedService.getActivityFeedByUsers($scope.filteredUsers, currentPage);
			        }			        
			    });

			    $scope.$on('pusher.activityFeed.comment.added', function (event, data) {
			        activityFeedService.commentAdded(data, o.isPosting).then(function () {
			            o.isPosting = false;
			        });
			    });

			    $scope.$on('pusher.activityFeed.comment.deleted', activityFeedService.commentDeleted);

			    $scope.$on('pusher.activityFeed.like.added', activityFeedService.likeAdded);

			    $scope.$on('pusher.activityFeed.like.deleted', activityFeedService.likeDeleted);

			    $scope.$on('pusher.activityFeed.post.added', activityFeedService.newPostPushed);

			    //#endregion

			    //#region private methods
			    /*add fake account in users object to control filter condition*/
			    function addFakeAccountToUsers() {
			        var fakeAccount = {
			            fullName: "[Alla]",
			            id: 0,
			            fake: true,
			            image: paths.defaultImage
			        };

			        $scope.users.unshift(fakeAccount);
			    }
			    //#endregion

			    // INIT
			    accountHandler.getUser().then(function (data) {
			        $scope.user = data;
			        activityFeedService.getActivityFeed();
			    });

			    accountHandler.getAllUsers().then(function (response) {
			        if (!accountHandler.signedIn()) {
			            return;
			        }
			        $scope.users = response && response.length !== 0 ? response : [];
			        addFakeAccountToUsers();
			    });

			    $scope.$on('accountHandler.signIn.done', function (event, data) {
			        accountHandler.getAllUsers().then(function (response) {
			            if (!accountHandler.signedIn()) {
			                return;
			            }
			            $scope.users = response && response.length !== 0 ? response : [];
			            addFakeAccountToUsers();
			        });
			    });

			    $scope.$on('activityFeed.getActivityFeed.done', function (event, data) {
			        $scope.newsfeed.pushRange(data.feeds);
			        totalPages = data.totalPages;
			        currentPage++;
			    });

			    // FAILED
			    $scope.$on('activityFeed.getActivityFeed.failed', function (event, data) {
			        $scope.newsfeed = [];
			    });

			    // INIT
			    //activityFeedService.getActivityFeed();
			}]);
}());