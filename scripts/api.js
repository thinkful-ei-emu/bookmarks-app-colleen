'use strict';
/* global store*/
//eslint-disable-next-line no-unused-vars

let api = (function(){
  const BASE_URL = 'https://thinkful-list-api.herokuapp.com/colleen';

  function apiFetch(...args){
    let error;
    return fetch(...args)
      .then(res => {
        if (!res.ok) error = {code: res.status};
        return res.json();
      })
      .then(resJson => {
        if (error) {
          error.message = resJson.message;
          return Promise.reject(error);
        }
        return resJson;
      });
  }

  function getItems() {
    return apiFetch(`${BASE_URL}/bookmarks`);
  }

  function createBookmark(serializedJson){
    const item = serializedJson;
    return apiFetch(`${BASE_URL}/bookmarks`,
      { method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: item
      });
  }

  function deleteBookmark(id){
    return apiFetch(`${BASE_URL}/bookmarks/${id}`,
      { method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
      });
  }

  return {
    getItems,
    createBookmark,
    deleteBookmark
  };
})();

