# vue-redux-connect

[![NPM](https://nodei.co/npm/vue-redux-connect.png)](https://www.npmjs.com/package/vue-redux-connect)

This module provides a function `connect` that can be used to create a Vue component that responds to state changes in a Redux store. The component can also dispatch actions to the store. 

This package is inspired by [react-redux](https://github.com/reduxjs/react-redux).

You can find a similar, though slightly different, alternative to this package here: [redux-vue-connect](https://github.com/itsazzad/redux-vue-connect).

## Installation
`npm install --save vue-redux-connect`

or

`npm i -S vue-redux-connect`

## Usage

In your source code, import the function `connect` using

`import { connect } from 'vue-redux-connect'`

Define a function that maps the state of your store to component props `mapStateToProps`. Now you can write:

`const connectedComponent = connect(mapStateToProps)(myComponent)`

If the component also needs to trigger one or more actions on the store, you can define a function `mapDispatchToProps` and pass it as a second parameter in connect:

`const connectedComponent = connect(mapStateToProps, mapDispatchToProps)(myComponent)`

## Example

This example describes a basic store that has an integer as its state, and handles a single action of type 'increment'.

&nbsp;

``` js
// store.js
import { createStore }  from 'redux'
const reducer = ( state = 0, action ) => {
  if(action.type == 'increment') return state + 1
  return state
}
export default createStore( reducer );
```

&nbsp;

``` vue
// Counter.vue
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

``` vue
// App.vue
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