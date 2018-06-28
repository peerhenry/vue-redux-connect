# vue-redux-connect
Use connect to create a connected component by mapping the state and dispatch function of a store to component props.

`const connectedComponent = connect(mapStateToProps, mapDispatchToProps)(MyComponent)`

Both `mapStateToProps` and `mapDispatchToProps` are optional parameters.

Make sure to pass the redux store as a prop to the connected component.