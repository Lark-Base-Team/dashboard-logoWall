<script lang="ts" setup>
import { ref, watch, onMounted, onUnmounted } from "vue";
import { useDark } from "@vueuse/core";
import '@lark-base-open/js-sdk/dist/style/dashboard.css';
import Form from "./components/Form.vue";
import { bitable, ThemeModeType } from "@lark-base-open/js-sdk";
const isDark = useDark({
  selector: "body",
  attribute: "theme-mode",
});
// 监听主题变化
const off = bitable.bridge.onThemeChange((e) => {
  isDark.value = e.data.theme === ThemeModeType.DARK;
});
onMounted(() => {
  // 初始化主题
  bitable.bridge.getTheme().then((e) => {
    isDark.value = e === ThemeModeType.DARK;
  });
});
// 组件卸载时取消监听
onUnmounted(off);
</script>
<template>
  <main>
    <Form :isDark="isDark" />
  </main>
</template>
<style scoped>
main {
  width: 100vw;
  height: 100vh;
}
h4 {
  font-size: calc(1.275rem + 0.3vw);
  margin-bottom: 1rem;
}
code {
  font-size: 0.875em;
  color: var(--);
  word-wrap: break-word;
}
</style>
