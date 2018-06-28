import Vue from 'vue'
import { mount } from '@vue/test-utils'
import { renderToString } from '@vue/server-test-utils'
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
    var mounted = mount(connectedComponent, {
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
    var mounted = mount(connectedComponent, {
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
    var result = renderToString(connectedComponent, {
      propsData: { store: store }
    })
    // assert
    expect(result).toContain('<h1')
    expect(result).toContain('billy')
    expect(result).toContain('</h1>')
  })

  // todo: write tests for mapStateToProps, mapDispatchToProps and triggering rerendering for state change
})