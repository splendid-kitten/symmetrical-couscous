import { mount } from '@vue/test-utils'
import Dashboard from './Dashboard.vue'
import { expect, test } from 'vitest'

test('Dashboard is a Vue instance', () => {
  const wrapper = mount(Dashboard)
  expect(wrapper.vm).toBeTruthy()
})