<template>
  <div class="_name_-wrapper">
    组件的名称：{{data.name}}
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { _capitalized_Data } from '@/types/components/_capitalized_.types'
// import {  } from "@/components" // 组件

@Component({})
export default class _capitalized_ extends Vue {
    // prop
    @Prop({
      required: false,
      default: ''
    }) example!: string

    // data
    data: _capitalized_Data = {
      name: '_name_'
    }

    created() {
      //
    }

    activated() {
      //
    }

    mounted() {
      //
    }
}
</script>

<style lang="scss">
  @import "@/assets/scss/variables";

  ._name_-wrapper {
    width: 100%;
  }
</style>
