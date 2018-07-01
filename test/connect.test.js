import Vue from 'vue'
import { mount } from '@vue/test-utils'
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

  
  /*it('should pass props from mapDispatchToProps to wrapped component', () => {
    // arrange
    const expected = 42
    const reducer = ( state = expected, action ) => {
      if(action.type === 'INCR') return state + 1
      return state
    }
    const store = createStore( reducer )
    const mapStateToProps = state => ({ thing: state })
    const mapDispatchToProps = dispatch => ({ increment: () => dispatch({type: 'INCR' }) })
    const dummyComponent = Vue.component('Dummy', { 
      template: '<h1>{{thing}}</h1>', 

      props: [ 'thing', 'increment' ] 
    })
    // act
    const connectedComponent = connect(mapStateToProps, mapDispatchToProps)(dummyComponent)
    const result = renderToString(connectedComponent, {
      propsData: { store: store }
    })
    // assert
    expect(result).toContain('<h1')
    const expect2 = expected + '</h1>'
    expect(result).toContain(expect2)

    fail()  // todo: finish
  })

  /*
  it('dispatching an action that changes a part of state that component depends on should trigger a rerender of that component', () => {
    fail()
    // todo: implement
  })

  it('dispatching an action that changes a part of state that component does not depend on should not trigger a rerender of that component', () => {
    fail()
    // todo: implement
  })
  */

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