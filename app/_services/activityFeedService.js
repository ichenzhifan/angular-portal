(function () {
    'use-strict';
    angular.module(globals.appName + globals.services).factory('activityFeedService', [
        '$rootScope', 'accountHandler', 'repoService', '$q', 'configModel', 'dataService',
        function ($rootScope, accountHandler, repoService, $q, configModel, dataService) {
            var user,
				feeds = [];

            function getActivityFeed(data) {
                var options = {
                    paceIgnore: true
                };

                $rootScope.$broadcast("feed.progress.show", { type: 'activityFeed', data: [] });

                return dataService.get(configModel.getUrl().activityFeed, data, options).then(function (response) {
                    var result = response.data;
                    feeds = _.sortBy(result.feeds, function (x) { return -x.activityFeedId; });

                    _.each(feeds, function (news) {
                        angular.extend(news, {
                            latestComments: _.last(news.comments, 3),
                            numberOfHiddenComments: news.comments.length > 3 ? news.comments.length - 3 : 0,
                            isShowCommentPanel: false
                        });
                    });

                    result.feeds = feeds;
                    $rootScope.$broadcast('activityFeed.getActivityFeed.done', result);
                    $rootScope.$broadcast("feed.progress.hide", { type: 'activityFeed', data: result });

                    if (data && result && result.totalPages === data.page) {
                        $rootScope.$broadcast("feed.last.page", { message: "No more feeds" });
                    }
                });
            };

            function getActivityFeedByUsers(users, page) {
                var userIds = [],
                    pageSize = 10;

                page = page ? page : 1;

                // combine user id as query param.
                _.forEach(users, function (user) {
                    userIds.push(user.id);
                });
               
                getActivityFeed({
                    Users: userIds.join(","),
                    page: page,
                    pageSize: pageSize
                });
            };

            function activityDone(activity) {
                var feed = {
                    user: {
                        id: user.id,
                        fullName: user.fullName,
                        image: user.image
                    },
                    message: activity.activityFeedMessage,
                    userDescription: activity.message,
                    created: 'Just nu',
                    likes: [],
                    comments: [],
                    taggedUsers: activity.taggedUsers
                };
                feeds.unshift(feed);
            };

            function activityChallenged(data) {
                var names = _.reduce(data.selectedUsers, function (memo, selectedUser) {
                    return selectedUser.name + ', ' + memo;
                }, 0).replace(', 0', '');

                var feed = {
                    fullName: user.firstName,
                    imageSrc: user.imageSrc,
                    message: user.name + ' utmanade ' + names + ' till att göra "' + data.name + '"!',
                    created: 'Just nu',
                    likes: [],
                    comments: []
                };
                feeds.unshift(feed);
            };

            //#region Pushed data

            function newPostPushed(event, data) {
                var feed = {
                    activityFeedId: data.activityFeedId,
                    user: {
                        id: data.user.id,
                        fullName: data.user.fullName,
                        image: data.user.image
                    },
                    message: data.message,
                    userDescription: data.userDescription,
                    created: 'Just nu',
                    likes: data.likes,
                    comments: data.comments,
                    link: data.link,
                    place: data.place,
                    taggedUsers: data.taggedUsers,
                    isShowCommentPanel: false
                };
                feeds.unshift(feed);
            };

            function likeAdded(event, data) {
                var likedPost = _.findWhere(feeds, { activityFeedId: data.activityFeedId });
                if (!_.find(likedPost.likes, function (x) { return x.user.id === data.user.id; })) {
                    likedPost.likes.push(data);
                }
            };

            function likeDeleted(event, data) {
                var post = _.findWhere(feeds, { activityFeedId: data.activityFeedId });
                if (!post) return;

                var theLike = _.find(post.likes, function (x) { return x.user.id === data.user.id; });
                if (!theLike) return;

                post.likes.removeItem(theLike);
            }

            function commentDeleted(event, data) {
                var post = _.findWhere(feeds, { activityFeedId: data.activityFeedId });
                if (!post) return;

                var theComment = _.findWhere(post.comments, { commentId: data.commentId });
                if (!theComment) return;

                post.comments.removeItem(theComment);
            };

            function commentAdded(data, isPostingComment) {
                var post = _.findWhere(feeds, { activityFeedId: data.activityFeedId });
                if (!post) return $q.when();

                if (isPostingComment) {
                    var c = _.findWhere(_.filter(post.comments, function (x) { return x.user.id === data.user.id; }), { id: undefined });
                    angular.extend(c, { id: data.id });
                } else {
                    if (!_.findWhere(post.comments, { id: data.id })) {
                        post.comments.push(data);
                    }
                }

                return $q.when();
            };

            //#endregion Pushed data

            function comment(news, message, isPostingComment) {
                if (isPostingComment) return;

                /* Add comment to GUI */
                var theComment = {
                    user: {
                        id: user.id,
                        fullName: user.fullName,
                        image: user.image
                    },
                    message: message
                };
                news.comments.push(theComment);

                /* POST comment to proxy */
                repoService
			        .withFunction(repoService.repositories.activityFeed, 'postComment')
			        .exec({
			            topic: 'activityFeed.postComment',
			            data: { activityFeedId: news.activityFeedId, message: message }
			        });
            };

            function deleteComment(news, theComment) {
                /* Remove comment from GUI */
                var commentToRemove = _.find(news.comments, function (c) {
                    return c.id === theComment.id;
                });
                news.comments.removeItem(commentToRemove);

                /* DELETE comment in proxy */
                repoService
			        .withFunction(repoService.repositories.activityFeed, 'deleteComment')
			        .exec({
			            topic: 'activityFeed.deleteComment',
			            data: { activityFeedId: news.activityFeedId, id: theComment.id }
			        });
            };

            function like(news) {
                /* Add like to GUI */
                var aLike = {
                    created: new Date(),
                    user: {
                        id: user.id,
                        fullName: user.fullName
                    }
                };
                news.likes.push(aLike);

                /* POST like to proxy */
                repoService
			        .withFunction(repoService.repositories.activityFeed, 'postLike')
			        .exec({
			            topic: 'activityFeed.postLike',
			            data: { activityFeedId: news.activityFeedId }
			        });
            };

            function dislike(news) {
                /* Remove like from GUI */
                var theLikeToRemove = _.find(news.likes, function (aLike) {
                    return aLike.user.id === user.id;
                });

                news.likes.removeItem(theLikeToRemove);

                /* DELETE comment in proxy */
                repoService
					.withFunction(repoService.repositories.activityFeed, 'deleteLike')
					.exec({
					    topic: 'activityFeed.deleteLike',
					    data: { activityFeedId: news.activityFeedId }
					});
            };

            // INIT
            accountHandler.getUser().then(function (data) {
                user = data;
            });

            return {
                activityDone: activityDone,
                activityChallenged: activityChallenged,

                getActivityFeed: getActivityFeed,               
                getActivityFeedByUsers: getActivityFeedByUsers,

                comment: comment,
                deleteComment: deleteComment,
                like: like,
                dislike: dislike,

                newPostPushed: newPostPushed,
                likeAdded: likeAdded,
                likeDeleted: likeDeleted,

                commentAdded: commentAdded,
                commentDeleted: commentDeleted
            }
        }]);
}());