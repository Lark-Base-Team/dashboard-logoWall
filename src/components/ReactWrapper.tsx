import { defineComponent, h, onMounted, onUnmounted, ref, watch } from 'vue'
import * as React from 'react'
import { createRoot } from 'react-dom/client'
import type { Root } from 'react-dom/client'

export function createReactWrapper(Component: any) {
  return defineComponent({
    name: 'ReactWrapper',
    inheritAttrs: true, // 接收所有传递的属性
    setup(props, { attrs, slots }) {
      const containerRef = ref<HTMLDivElement>()
      const rootRef = ref<Root>()

      const renderReactComponent = () => {
        if (!containerRef.value) return
        // 将kebab-case转换为camelCase，适配React组件
        const reactProps: Record<string, any> = {}
        for (const key in attrs) {
          const camelKey = key.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase())
          reactProps[camelKey] = attrs[key]
        }
        const element = React.createElement(Component, {
          ...reactProps,
          key: JSON.stringify(attrs) // 强制重新渲染当 attrs 改变时
        })
        // 使用 React 18 的 createRoot API
        if (!rootRef.value) {
          rootRef.value = createRoot(containerRef.value)
        }
        rootRef.value!.render(element)
      }

      onMounted(() => {
        renderReactComponent()
      })

      watch(() => attrs, () => {
        renderReactComponent()
      }, { deep: true })

      onUnmounted(() => {
        if (rootRef.value) {
          // @ts-ignore - unmount 类型定义问题
          rootRef.value.unmount()
        }
      })

      return () => h('div', {
        ref: containerRef,
        style: { width: '100%', height: '100%' }
      })
    }
  })
}