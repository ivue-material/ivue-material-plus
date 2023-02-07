<template>
  <div class="container">
    <nav>
      <ul>
        <li>
          <router-link to="/affix">Affix</router-link>
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
