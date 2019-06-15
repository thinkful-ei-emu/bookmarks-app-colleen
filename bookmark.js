'use strict';
/* global store, $, api */

//eslint-disable-next-line no-unused-vars

const bookmark = (function(){

  function generateItemElement(item) {
    const viewStatus = item.view ? '' : 'hidden';
    let bookMarkItem = `
    <div class="bookmark item" data-item-id="${item.id}" data-item-rating="${item.rating}">
      <ul>
        <li>${item.title}</li>
        <li>${item.rating}</li>
      </ul>
      <button type='button' class='show-hide'>Show/Hide Details</button>
      <button type='button' class='delete-item'>Delete Bookmark</button>
      <div class="expanded ${viewStatus}"id=${item.id}>
        <li>${item.url}</li>
        <li>${item.desc}</li>
        </div>
    </div>`;
    return bookMarkItem;
  }

  function handleAddForm (){
    $('#container').on('click', '#js-open-form', function(){
      console.log($(event.currentTarget));
      store.toggleAddForm();
      render();
    });
  }

  function handleDetailButton() {
    $('#results').on('click', function(event) {
      const id = getItemIdFromElement(event.target);
      const bookmark = store.findById(id);
      bookmark.view = !bookmark.view;
      render();
      //update store to reflect item clicked needs expanded toggled t/f
      //call render
    });
  }


  function handleFilterSelect(){
    $('.filter').on('change', '#filter', function(){
      event.preventDefault;
      const val = $(event.currentTarget).find('#filter').val();
      store.setRating(val);      
      render();
    });
  }
  
  function generateBookmarkListItemsString(bookmarks){
    const items = bookmarks.map((item) => generateItemElement(item));
    return items.join('');
  }

  function render(){
    // any html, toggle, hide/show etc ONLY happens here

    //will show add bookmark form if toggleAddForm set to true
    if (store.formShow){
      $('.add-bookmark-form').removeClass('hidden');
      $('#js-open-form').html('Hide Add Bookmark');
    }
    //if formShow is false, will hide the form
    if(!store.formShow){
      $('.add-bookmark-form').addClass('hidden');
      $('#js-open-form').html('Add Bookmark');
    }

    //if showDetails is false, will hide additional details 
 
    let items = [...store.items ];

    
    //filter by rating: 
    if (store.rating > 0) {
      items = store.items.filter(bookmark => bookmark.rating >= store.rating);
    }
    const BookMarkListItemsString = generateBookmarkListItemsString(items);
    $('#results').html(BookMarkListItemsString);
    renderErrors();
  }
  
  function renderErrors() {
    let error = '';
    if(store.showError) {
      error = `
      <p id="error-message">Couldn't add bookmark: ${store.errorMessage}</p>
      <button type='button' id='close-error'>Close</button>`;
    }
    $('#error-message').html(error);
  }

  function handleErrors(errorMessage) {
    store.showError = true;
    store.errorMessage = errorMessage;
    render();
  }

  function handleCloseErrorButton(){
    $('#error-message').on('click', '#close-error', () => {
      store.showError = false;
      render();
    });
  }

  //extend jQuery library to stringify form data
  $.fn.extend({
    serializeJson: function() {
      const formData = new FormData(this[0]);
      const obj = {};
      formData.forEach((val, name)=> obj[name]=val);
      return JSON.stringify(obj);
    }
  });
	
  function handleNewItemSubmit() {
    $('#js-add-bookmark-form').submit(function (event) {
      event.preventDefault();
      let newBookmark = $(event.target).serializeJson();
      api.createBookmark(newBookmark)
        .then(itemJson => {
          store.addItem(itemJson);
          render();
        })
        .catch (error => {
          handleErrors(error.message);
        });
    });
  }

  function getItemIdFromElement(item) {
    return $(item)
      .closest('.bookmark')
      .data('item-id');
  }

  function handleItemDelete () {
    $('#results').on('click', '.delete-item', function (event){
      event.preventDefault();
      const id = getItemIdFromElement(event.currentTarget);
      api.deleteBookmark(id)
        .then(() =>{
          store.findAndDelete(id);
          render();
        })
        .catch(error => {
          handleErrors(error.message);
        });
    });
  }

  function bindEventListeners(){
    handleDetailButton();
    handleNewItemSubmit();
    handleCloseErrorButton();
    handleFilterSelect();
    handleItemDelete();
    handleAddForm();
  }

  return {
    render: render,
    bindEventListeners: bindEventListeners
  };

})();