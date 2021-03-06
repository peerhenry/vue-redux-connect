# vue-redux-connect

Connect a [Redux](https://github.com/reduxjs/redux) store to a [Vue](https://vuejs.org/) component!

[![build status](https://travis-ci.com/peerhenry/vue-redux-connect.svg?branch=master)](https://travis-ci.com/peerhenry/vue-redux-connect)

[![NPM](https://nodei.co/npm/vue-redux-connect.png)](https://www.npmjs.com/package/vue-redux-connect)

This module provides a function `connect` that can be used to create a Vue component that responds to state changes in a Redux store. The component can also dispatch actions to the store. 

This package is inspired by [react-redux](https://github.com/reduxjs/react-redux).

You can find a similar, though slightly different, alternative to this package here: [redux-vue-connect](https://github.com/itsazzad/redux-vue-connect).

## Installation
`npm install --save vue-redux-connect`

or

`npm i -S vue-redux-connect`

## Usage
### `connect(mapStateToProps, mapDispatchToProps)`

This assumes you are using a module bundler like [Webpack](https://webpack.js.org/).

In your source code, import the function `connect` using

`import { connect } from 'vue-redux-connect'`

Define a function that maps the state of your store to component props `mapStateToProps`. Now you can write:

`const connectedComponent = connect(mapStateToProps)(myComponent)`

If the component also needs to trigger one or more actions on the store, you can define a function `mapDispatchToProps` and pass it as a second parameter in connect:

`const connectedComponent = connect(mapStateToProps, mapDispatchToProps)(myComponent)`

The connectedComponent requires that the Redux store be passed as a prop. Eg. in a Vue template you would write:

`<ConnectedComponent :store="store"/>`

## Example

This example describes a basic store that has an integer as its state, and handles a single action of type 'increment'.

`store.js`
``` js
import { createStore }  from 'redux'
const reducer = ( state = 0, action ) => {
  if(action.type == 'increment') return state + 1
  return state
}
export default createStore( reducer );
```

&nbsp;
`Counter.vue`
``` vue
<template>
  <div>
    <h1>Value: {{ number }}</h1>
    <button @click="increment">Increment</button>
  </div>
</template>

<script>
export default {
  props: {
    number: Number,
    increment: Function
  }
}
</script>
```

&nbsp;

`App.vue`
``` vue
<template>
  <ConnectedCounter :store="store" />
</template>

<script>
import store from './store.js'
import Counter from './Counter.vue'
import { connect } from 'vue-redux-connect'

const mapStateToProps = ( state ) => ({ number: state })
const mapDispatchToProps = ( dispatch ) => ({ increment: () => dispatch({ type: 'increment' }) })
const connectedCounter = connect(mapStateToProps, mapDispatchToProps)(Counter)

export default {
  components: { 
    'ConnectedCounter': connectedCounter
  },
  data: function () { 
    return {
      store: store
    }
  }
}
</script>
```