import Vue from "vue";
Vue.directive('dumy-img', {
  bind: function (el, binding) {
    var once = binding.modifiers.once
    if (once){
      el.addEventListener('click', function () {
        el.src=binding.value
        console.log(binding.expression)
      })
    }
  }
})