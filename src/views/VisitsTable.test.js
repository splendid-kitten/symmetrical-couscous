import { mount } from '@vue/test-utils'
import VisitsTable from './VisitsTable.vue'
import { expect, test } from 'vitest'

test('VisitsTablle is a Vue instance', () => {
  const wrapper = mount(VisitsTable)
  expect(wrapper.vm).toBeTruthy()
})