(function () {
    'use strict';

	//#region Array extensions
	/* Extend arrays with "pushRange" function */
    Object.defineProperty(Array.prototype, 'pushRange', {
    	enumerable: false,
    	value: function (itemsToPush) {
    		var arr = this;

		    for (var i = 0; i < itemsToPush.length; i++) {
			    arr.push(itemsToPush[i]);
		    }
    	}
    });


    /* Extend arrays with remove function */
    Object.defineProperty(Array.prototype, 'removeItem', {
        enumerable: false,
        value: function (itemToRemove) {
            var arr = this,
				index = arr.indexOf(itemToRemove),
				itemExists = index > -1;

            if (!itemExists) {
                return undefined;
            } else {
                return arr.splice(index, 1);
            }
        }
    });

    /* Extend arrays with remove function */
    Object.defineProperty(Array.prototype, 'removeItemBy', {
        enumerable: false,
        value: function (itemToRemove, compare) {
            var arr = this,
				index = -1;

            if (compare && typeof (compare) === "function") {
                index = compare(arr, itemToRemove);
            }
            if (index !== -1) {
                return arr.splice(index, 1);
            } else {
                return undefined;
            }
        }
    });

    /* Extend arrays with replace function */
    Object.defineProperty(Array.prototype, 'replaceItem', {
        enumerable: false,
        value: function (itemToReplace, replaceWith) {
            var arr = this,
				index = arr.indexOf(itemToReplace),
				itemExists = index > -1;

            if (!itemExists) {
                return undefined;
            } else {
                return arr.splice(index, 1, replaceWith ? replaceWith : {});
            }
        }
    });

    /* Extend arrays with sortBy property function */
    Object.defineProperty(Array.prototype, 'sortBy', {
        enumerable: false,
        value: function (prop, asc) {
            var arr = this;
            if (arr && arr.length >= 2) {
                arr.sort(function (first, second) {
                    if (asc && asc == true) {
                        return first[prop] < second[prop];
                    }
                    return first[prop] > second[prop];
                });
            }
            return arr;
        }
    });

    /* Extend arrays with indexBy property function */
    Object.defineProperty(Array.prototype, 'indexBy', {
        enumerable: false,
        value: function (item, prop) {
            var arr = this,
                index = -1;

            if (item !== null && prop != null) {
                _.forEach(arr, function (a, i) {
                    if (a[prop] === item[prop]) {
                        index = i;
                    }
                });
            }

            return index;
        }
    });

    //#endregion
}());