'use strict';
/* global bookmark, store, $, api, $ */
// eslint-disable-next-line no-unused-vars
$(document).ready(function() {
  bookmark.bindEventListeners();
  api.getItems()
    .then((items)=> {
      items.forEach((item)=> {
        console.log(item);
        store.addItem(item);
        console.log(store.items);
      });
      bookmark.render();

    });
});