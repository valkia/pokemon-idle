<!--
Parameters:
    - name : Required : String
        The name of the Dungeon to be added.
        Should match what is used in the DungeonList.

    - moveToTown : Optional : String
        The name of a town to move to when this element is clicked.
        Used when the dungeon is accessed via a town.

    - x : Required : Number
        x axis position of the dungeon icon.

    - y : Required : Number
        y axis position of the dungeon icon. -->

<!--:data-bind="click:function(){},
        attr: { class: MapHelper.calculateTownCssClass(' locals.name.replace(/'/g, '\\\'') ') }"-->
<template>
  <rect
    class="city"
    :data-town=" locals.name "
    :x=" locals.x * 16 "
    :y=" locals.y * 16 "
    :height=" (locals.height || 3) * 16 "
    :width=" (locals.width || 4) * 16 "
    @click="move"
  />
</template>
<script setup lang="ts">
import MapHelper from '~/scripts/worldmap/MapHelper'

const props = defineProps<{
  locals: {}
}>()
const move = () => {
  const locals = props.locals
  MapHelper.moveToTown((locals.moveToTown) ? locals.moveToTown.replace(/'/g, '\\\'') : locals.name.replace(/'/g, '\\\''))
}
onMounted(() => {
})
</script>
