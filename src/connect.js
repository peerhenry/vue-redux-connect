import Vue from "vue";

export default (mapStateToProps, mapDispatchToProps) => wrappedComponent => Vue.component('Connect', {

  render: function(createElement){
    return createElement(wrappedComponent, {
      props: Object.assign({}, this.stateProps, this.dispatchProps)
    })
  },

  props: ['store'],

  data: function () {
    return {
      stateProps: {},
      dispatchProps: {}
    }
  },

  methods: {
    update: function () {
      if(mapStateToProps)
      {
        if(typeof mapStateToProps !== "function") console.error("mapStateToProps is not a function!")
        else
        {
          const newStateProps = mapStateToProps(this.store.getState())
          // prevent component update if state props didn't change.
          const componentShouldUpdate = JSON.stringify(newStateProps) !== JSON.stringify(this.stateProps)
          if(componentShouldUpdate){
            this.stateProps = newStateProps
          }
        }
      }
    }
  },
  
  created: function () {
    if(mapDispatchToProps)
    {
      if(typeof mapDispatchToProps !== "function") console.error("mapDispatchToProps is not a function!")
      else this.dispatchProps = mapDispatchToProps(this.store.dispatch)
    }
    this.update();
    this.store.subscribe(() => this.update())
  }
})