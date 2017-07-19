---
---
var index = lunr(function () {
  this.field('title')
  this.field('content', {boost: 10})
  this.ref('id')
});
{% assign count = 0 %}{% for page in site.pages %}
index.add({
title: {{page.title | jsonify}},
content: {{page.content | strip_html | jsonify}},
id: {{count}}
});{% assign count = count | plus: 1 %}
{% endfor %}

var store = [{% for page in site.pages %}{
  "title": {{page.title | jsonify}},
  "url": {{ page.url | jsonify }},
  "summary": {{ page.content | strip_html | truncatewords: 20 | jsonify }},
  "menu": "{{page.menu}}"
}{% unless forloop.last %},{% endunless %}{% endfor %}]
console.log(store[1].title);
console.log(store[1].summary);
// builds search

$(document).ready(function() {
  $('#search').on('keyup', function () {
    var resultdiv = $('#results');
    var res_count = 0;
    // Get query
    var query = $(this).val();
    // Search for it
    var result = index.search(query);
    // Show results
    resultdiv.empty();
    // Loop through, match, and add results
    for (var item in result) {
      var ref = result[item].ref;
      if(store[ref].menu == page_menu && store[ref].url != '/404.html') {
        var searchitem = '<article><h3><a href="'+store[ref].url+'">'+store[ref].title+'</a></h3><p>'+store[ref].summary+'</p></article>';
        resultdiv.append(searchitem);
        res_count = res_count + 1;
      }
    }
    if (res_count == 0) {
        var notfound = '<p>No results found</p>';
        resultdiv.append(notfound);
    }
  });
});
