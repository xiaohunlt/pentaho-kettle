/*!
 * Copyright 2017 Pentaho Corporation. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

define([
  "angular"
], function(angular) {
  scrollToFolder.inject = ["$timeout"];

  /**
   * @param {Function} $timeout - Angular wrapper for window.setTimeout.
   * @return {{restrict: string, scope: {model: string}, link: link}} - scrollToFolder directive
   */
  function scrollToFolder($timeout) {
    return {
      restrict: "A",
      scope: {model: "<ngModel", delete: "=didDelete"},
      link: function(scope, element, attrs) {
        var watch = scope.$watch("model", function(value) {
          if (value === "" || value === "Recents") {
            return;
          }

          $timeout(function() {
            scrollToSelectedFolder(value);
            watch();
          });
        });

        scope.$watch("delete", function(newVal) {
          if (newVal) {
            $timeout(function() {
              scrollToSelectedFolder(scope.model, newVal);
              scope.delete = false;
            });
          }
        });

        function scrollToSelectedFolder(value, didDeleteFolder) {
          var wrapperClass = attrs.scrollToFolder;
          var scrollToElem = document.getElementById(value);
          var aScrollToElem = angular.element(scrollToElem);
          var topPos = aScrollToElem[0].offsetTop;
          var needsScroll = wrapperClass === "open" && topPos > 444 || wrapperClass === "save" && topPos > 368;
          if (needsScroll) {
            element[0].scrollTop = topPos - (wrapperClass === "open" ? 292 : 254);
          } else if (!needsScroll && didDeleteFolder) {
            element[0].scrollTop = 0;
          }
        }
      }
    };
  }

  return {
    name: "scrollToFolder",
    options: ["$timeout", scrollToFolder]
  };
});
