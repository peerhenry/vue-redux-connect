import Vue from 'vue'
import { mount, shallowMount } from '@vue/test-utils'
import { createStore } from 'redux'
import connect from '../src/connect.js'

// temporary to get everything up and running
describe('setup', () => {
  it('should be able to test vue components', () => {

    const dummyTemplate = '<h1>dummy</h1>'
    const dummyOpts = {
      data: function(){
        return {
          count: 1
        }
      },
      template: dummyTemplate
    }

    let wrapper = mount(dummyOpts)
    // console.log(wrapper.vm) // whats in a vue

    expect(wrapper.html()).toBe(dummyTemplate)
  })

  it('should be able to test redux store', () => {
    const store = createStore(() => ({ name: 'Billy' }))
    expect( store.getState().name ).toBe('Billy')
  })
})

// actual test are to be placed here
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
})