class ViewModelBehavior {

  constructor (can, updateHandler) {
    this.debounceInterval = 10;
    this.timer;
    this.name = 'viewModel';
    this.element = null;
    this.viewModel = {};

    this.can = can;

    this.updateHandler = function(){
      window.clearTimeout(this.timer);
      this.timer = window.setTimeout(updateHandler, this.debounceInterval);
    }
  }

  setElement (el) {
  	this.element = el;
  }

  do (updateHandler) {
    return this.getAndBind();
  }

  update (data) {
    if(this.viewModel && this.viewModel.attr) {
      this.viewModel.attr(data, true);
    }
  }

  getAndBind () {
    var el = this.element;
    var vm = {};

    if(!el) {
      return;
    }

    this.unbind();

    //Use the older method since it works all the way back to 2.0
    vm = this.can.$(el).data('scope');

    if(vm) {
      this.bind(vm);
    } else {
      vm = {};
    }

    this.viewModel = vm;

    return this.viewModel.serialize ? this.viewModel.serialize() : this.viewModel;
  }

  bind (vm) {
    if(vm && vm.bind) {
      vm.bind('change', this.updateHandler);
    }
  }

  unbind () {
    if(this.viewModel && this.updateHandler && this.viewModel.unbind) {
      this.viewModel.unbind('change', this.updateHandler);
    }
  }

};

export default ViewModelBehavior;