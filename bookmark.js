'use strict';
/* global store, $, api */

//eslint-disable-next-line no-unused-vars

const bookmark = (function(){

  function generateItemElement(item) {
  
    let bookMarkItem = `
    <div class="bookmark item" data-item-id="${item.id}">
      <ul>
        <li>${item.title}</li>
        <li>${item.rating}</li>
      </ul>
      <button type='button' class='show-hide'>Show/Hide Details</button>
      <button type='button' class='delete-item'>Delete Bookmark</button>
      <div class="expanded hidden" id=${item.id}>
        <li>${item.url}</li>
        <li>${item.desc}</li>
        </div>
    </div>`;

    return bookMarkItem;
  }

  function handleDetailButton() {
    $('.show-hide').click(function(event) {
      console.log($(event.currentTarget).siblings('.expanded'));
      $(event.currentTarget).siblings('.expanded').toggleClass('hidden');
    });
  }
  
  function generateBookmarkListItemsString(bookmarks){
    const items = bookmarks.map((item) => generateItemElement(item));
    return items.join('');
    
  }

  function render(){
    
    //filterByRating
    let items = [...store.items ];
    
    const BookMarkListItemsString = generateBookmarkListItemsString(items);
    $('#results').html(BookMarkListItemsString);
    handleDetailButton();
   
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
    renderErrors();
  }

  function handleCloseErrorButton(){
    $('#error-message').on('click', '#close-error', () => {
      store.showError = false;
      renderErrors();
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
          console.log(itemJson);
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
    $('.delete-item').on('click', function (event){
      console.log('delete clicked');
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
      console.log(store.items);
    });
  }

  function bindEventListeners(){
    //handleDetailButton();
    handleNewItemSubmit();
    handleCloseErrorButton();
    console.log(store.items);
  }

  return {
    handleItemDelete,
    render: render,
    bindEventListeners: bindEventListeners
  };

})();