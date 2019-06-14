'use strict';

//eslint-disable-next-line no-unused-vars

const store =(function(){

  const addItem = function(item) {
    this.items.push(item);
  };
  const findById = function(id) {
    return this.items.find(item => item.id === id);
  };

  const findAndDelete = function(id) {
    this.items = this.items.filter(item => item.id !== id);
  };

  const setRating = function(rating) {
    return store.rating = rating;
  };

  const setShowDetails = function(id, showDetails){
    const item = this.findById(id);
    item.view = showDetails;
  };

  const toggleAddForm = function() {
    this.formShow = !this.formShow;
  };

  return {
    formShow : false,
    toggleAddForm,
    setShowDetails,
    showDetails: false,
    items: [],
    addBookmark: false,
    addItem,
    showError: false,
    errorMessage: '',
    findAndDelete,
    findById,
    setRating
  };
})();