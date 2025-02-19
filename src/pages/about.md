<script setup lang="ts">
// No setup needed for this page
</script>

<template>
  <div>
    <div class="text-center">
      <div i-carbon-dicom-overlay class="text-4xl -mb-6 m-auto" />
      <h3>About</h3>
    </div>

    <p>
      <a href="https://github.com/antfu/vitesse" target="_blank" rel="noreferrer">Vitesse</a> is an opinionated <a href="https://github.com/vitejs/vite" target="_blank" rel="noreferrer">Vite</a> starter template made by <a href="https://github.com/antfu" target="_blank" rel="noreferrer">@antfu</a> for mocking apps swiftly. With <strong>file-based routing</strong>, <strong>components auto importing</strong>, <strong>markdown support</strong>, I18n, PWA and uses <strong>UnoCSS</strong> for styling and icons.
    </p>

    <pre class="language-js">
      <code>
// syntax highlighting example
function vitesse() {
  const foo = 'bar'
  console.log(foo)
}
      </code>
    </pre>

    <p>
      Check out the <a href="https://github.com/antfu/vitesse" target="_blank" rel="noreferrer">GitHub repo</a> for more details.
    </p>
  </div>
</template>

<route lang="yaml">
meta:
  title: About
  layout: default
</route>

<style scoped>
.language-js {
  background: #f8f8f8;
  padding: 1rem;
  border-radius: 4px;
  margin: 1rem 0;
}
</style>