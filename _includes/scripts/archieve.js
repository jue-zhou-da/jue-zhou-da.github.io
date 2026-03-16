(function() {
  function queryString() {
    var i, pair, key;
    var queryObj = {};
    var queryStr = window.location.search.substring(1);
    if (!queryStr) {
      return queryObj;
    }
    var queryArr = queryStr.split('&');
    for (i = 0; i < queryArr.length; i++) {
      pair = queryArr[i].split('=');
      key = pair[0];
      if (!key) {
        continue;
      }
      if (typeof queryObj[key] === 'undefined') {
        queryObj[key] = pair[1];
      } else if (typeof queryObj[key] === 'string') {
        queryObj[key] = [queryObj[key], pair[1]];
      } else {
        queryObj[key].push(pair[1]);
      }
    }
    return queryObj;
  }

  var setUrlQuery = (function() {
    var baseUrl = window.location.href.split('?')[0];
    return function(query) {
      if (typeof query === 'string') {
        window.history.replaceState(null, '', baseUrl + query);
      } else {
        window.history.replaceState(null, '', baseUrl);
      }
    };
  })();

  var tags = document.querySelector('.js-tags');
  var result = document.querySelector('.js-result');
  if (!tags || !result) {
    return;
  }

  var articleTags = tags.querySelectorAll('button');
  var tagShowAll = tags.querySelector('.tag-button--all');
  var sections = result.querySelectorAll('section');
  var sectionArticles = [];
  var lastFocusButton = null;

  function searchButtonByTag(tag) {
    var i;
    if (!tag) {
      return tagShowAll;
    }
    for (i = 0; i < articleTags.length; i++) {
      if (articleTags[i].getAttribute('data-encode') === tag) {
        return articleTags[i];
      }
    }
    return tagShowAll;
  }

  function buttonFocus(target) {
    if (!target) {
      return;
    }
    target.classList.add('focus');
    if (lastFocusButton && lastFocusButton !== target) {
      lastFocusButton.classList.remove('focus');
    }
    lastFocusButton = target;
  }

  function tagSelect(tag, target) {
    var i, j, k, tagsAttr, articleTagsList;
    var hasVisibleInSection, shouldShow;
    for (i = 0; i < sectionArticles.length; i++) {
      hasVisibleInSection = false;
      for (j = 0; j < sectionArticles[i].length; j++) {
        shouldShow = tag === '' || tag === undefined;
        if (!shouldShow) {
          tagsAttr = sectionArticles[i][j].getAttribute('data-tags') || '';
          articleTagsList = tagsAttr.split(',');
          for (k = 0; k < articleTagsList.length; k++) {
            if (articleTagsList[k] === tag) {
              shouldShow = true;
              break;
            }
          }
        }
        sectionArticles[i][j].classList.toggle('d-none', !shouldShow);
        if (shouldShow) {
          hasVisibleInSection = true;
        }
      }
      sections[i].classList.toggle('d-none', !hasVisibleInSection);
    }

    if (target) {
      buttonFocus(target);
      var currentTag = target.getAttribute('data-encode');
      if (currentTag === '' || typeof currentTag !== 'string') {
        setUrlQuery();
      } else {
        setUrlQuery('?tag=' + currentTag);
      }
    } else {
      buttonFocus(searchButtonByTag(tag));
    }
  }

  for (var sectionIndex = 0; sectionIndex < sections.length; sectionIndex++) {
    sectionArticles.push(sections[sectionIndex].querySelectorAll('.item'));
  }

  var query = queryString();
  tagSelect(query.tag);

  tags.addEventListener('click', function(event) {
    var button = event.target.closest('button');
    if (!button || !tags.contains(button)) {
      return;
    }
    tagSelect(button.getAttribute('data-encode'), button);
  });
})();
