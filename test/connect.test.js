import Vue from 'vue'
import { mount, shallowMount } from '@vue/test-utils'
import { render, renderToString } from '@vue/server-test-utils'
import { createStore } from 'redux'
import connect from '../src/connect.js'

describe('connect', () => {

  it('should render child component', () => {
    // arrange
    const store = createStore( () => ({}) )
    const dummyComponent = Vue.component('Dummy', { 
      render: function(createElement){ 
        return createElement('h1')
      }
    })
    // act
    const connectedComponent = connect()(dummyComponent)
    const mounted = mount(connectedComponent, {
      propsData: { store: store }
    })
    // assert
    expect(mounted.contains('h1')).toBe(true)
  })

  it('should get the proper store', () => {
    // arrange
    const expected = 'BILLY'
    const store = createStore( () => ({ name: expected }) )
    const dummyComponent = Vue.component('Dummy', { 
      render: function(createElement){ 
        return createElement('h1')
      }
    })
    // act
    const connectedComponent = connect()(dummyComponent)
    const mounted = mount(connectedComponent, {
      propsData: { store: store }
    })
    // assert
    expect(mounted.props().store.getState().name).toBe(expected)
  })

  it('should be able to render with template', () => {
    // arrange
    const store = createStore( () => ({}) )
    const dummyComponent = Vue.component('Dummy', { 
      template: '<h1>billy</h1>'
    })
    // act
    const connectedComponent = connect()(dummyComponent)
    const result = renderToString(connectedComponent, {
      propsData: { store: store }
    })
    // assert
    expect(result).toContain('<h1')
    expect(result).toContain('billy')
    expect(result).toContain('</h1>')
  })

  it('should pass props from mapStateToProps to wrapped component', () => {
    // arrange
    const expected = 42
    const reducer = ( state = expected ) => state
    const store = createStore( reducer )
    const mapStateToProps = state => ({ thing: state })
    const dummyComponent = Vue.component('Dummy', {template: '<h1>{{thing}}</h1>', props: [ 'thing' ] })
    // act
    const connectedComponent = connect(mapStateToProps)(dummyComponent)
    const result = renderToString(connectedComponent, {
      propsData: { store: store }
    })
    // assert
    expect(result).toContain('<h1')
    const expect2 = expected + '</h1>'
    expect(result).toContain(expect2)
  })
  
  it('should pass props from mapDispatchToProps to wrapped component', () => {
    // arrange
    const initial = 42
    const reducer = ( state = initial, action ) => {
      if(action.type === 'INCR') return state + 1
      return state
    }
    const store = createStore( reducer )
    const mapStateToProps = state => ({ })
    const mapDispatchToProps = dispatch => ({ increment: () => dispatch({ type: 'INCR' }) })
    const dummyComponent = Vue.component('Dummy', {
      render: function(h){
        this.increment()  // render triggers increment prop
      }, 
      props: [ 'increment' ] 
    })
    // act
    const connectedComponent = connect(mapStateToProps, mapDispatchToProps)(dummyComponent)
    renderToString(connectedComponent, {
      propsData: { store: store }
    })
    // assert
    expect(store.getState()).toBe(43)
  })
  
  it('dispatching an action that changes a part of state that component depends on should modify stateProps in Connect', () => {
    // arrange
    const initial = 42
    const reducer = ( state = initial, action ) => {
      if(action.type === 'INCR') return state + 1
      return state
    }
    const store = createStore( reducer )
    const mapStateToProps = state => ({ thing: state })
    var renderCount = 0
    const dummyComponent = Vue.component('Dummy', {
      render: () => { },
      props: [ 
        'thing' // prop that comes from redux state
      ]
    })
    const connectedComponent = connect(mapStateToProps)(dummyComponent)
    expect(renderCount).toBe(0)
    const mounted = mount(connectedComponent, {
      propsData: { store: store }
    })
    // act
    store.dispatch({ type: 'INCR' })
    // assert
    expect( mounted.vm.$data.stateProps.thing ).toBe(43)
  })

  // todo: 
  // figure out how to test if a vue component has been rerendered
  // then you can test that an action that changes a part of state that is not relevant to the component does not trigger a rerender
})

// Sanity tests

describe('vue test environment', () => {

  it('should be able to render props', () => {
    // arrange
    const comp = Vue.component('Dummy', {template: '<h1>{{thing}}</h1>', props: [ 'thing' ] })
    // act
    const result = renderToString(comp, {
      propsData: { thing: 'BILLY' }
    })
    // assert
    expect(result).toContain('<h1')
    expect(result).toContain('BILLY</h1>')
  })

  it('should be able to render a component with child components', () => {
    // arrange
    const comp1 = Vue.component('Dummy1', {template: '<h1>BILLY</h1>' })
    const comp2 = Vue.component('Dummy2', {template: '<Dummy1/>', componenets: { 'Dummy1': comp1 } })
    // act
    const result = renderToString(comp2)
    // assert
    expect(result).toContain('<h1')
    expect(result).toContain('BILLY</h1>')
  })

  it('should be able to render child component with props', () => {
    // arrange
    const comp1 = Vue.component('Dummy1', {template: '<h1>{{thing}}</h1>', props: ['thing'] })
    const comp2 = Vue.component('Dummy2', {template: '<Dummy1 thing="BILLY"/>', componenets: { 'Dummy1': comp1 } })
    // act
    const result = renderToString(comp2)
    // assert
    expect(result).toContain('<h1')
    expect(result).toContain('BILLY</h1>')
  })

})