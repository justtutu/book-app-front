<script lang="ts" setup>
import type { ConfigProviderThemeVars } from 'wot-design-uni'

const themeVars: ConfigProviderThemeVars = {
  // colorTheme: 'red',
  // buttonPrimaryBgColor: '#07c160',
  // buttonPrimaryColor: '#07c160',
}
</script>

<template>
  <uni-safe-area>
    <wd-config-provider :theme-vars="themeVars">
      <slot />
      <wd-toast />
      <wd-message-box />
    </wd-config-provider>
  </uni-safe-area>
</template>
