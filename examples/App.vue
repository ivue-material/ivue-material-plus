<template>
  <div class="container">
    <nav>
      <ul>
        <li>
          <router-link to="/Affix">Affix</router-link>
        </li>
        <li>
          <router-link to="/Icon">Icon</router-link>
        </li>
        <li>
          <router-link to="/Input">Input</router-link>
        </li>
        <li>
          <router-link to="/Button">Button</router-link>
        </li>
      </ul>
    </nav>

    <router-view />
  </div>
</template>

<style lang="scss">
nav {
  margin-bottom: 40px;

  ul {
    display: flex;
    flex-wrap: wrap;
  }
  li {
    display: inline-block;
  }
  li + li {
    border-left: solid 1px #bbb;
    padding-left: 10px;
    margin-left: 10px;
  }
}
.container {
  padding: 10px 8px 50px;
}
</style>
