<!--
Parameters:
    - region : Required : Number
        The region this route lies in.

    - route : Required : Number
        The route number for this route.

    - height : Required : Number
        The height of this route element.

    - width : Required : Number
        The width of this route element.

    - x : Required : Number
        x axis position of this route element.

    - y : Required : Number
        y axis position of this route element.

    - textx : Required when noText is not false : Number
        x axis position of the route number text.

    - texty : Required when noText is not false : Number
        y axis position of the route number text.

    - rotate : Optional : Boolean
        Indicates if this element should be rotated 90 degrees about (0,0).

    - noText : Optional : Boolean
        Indicates if this element should not add text for it's route number.
 -->
<template>
  <g
    :transform="locals.rotate?'rotate(90 , '+locals.x * 16+',' + locals.y * 16+')' :''"
    @click="gClick"
  >
    <rect
      :data-route=" locals.route "
      :class="rectClass"
      :height=" locals.height * 16 "
      :width=" locals.width * 16 "
      :x=" locals.x * 16 "
      :y=" locals.y * 16 - (locals.rotate ? locals.height * 16 : 0 ) "
    />
    <text
      v-if="!locals.noText"
      style="font-size: 32px"
      :x=" (locals.x * 16 + (locals.width * 16) / 2 - ((locals.name || locals.route).toString().length * 8)) + (locals.textX || 0) "
      :y=" (locals.y * 16 + (locals.height * 16) / 2 + (locals.rotate ? -38 : 10)) + (locals.textY || 0) "
    >
      {{ locals.name || locals.route }}
    </text>
  </g>
</template>
<script setup lang="ts">
import MapHelper from '~/scripts/worldmap/MapHelper'

const props = defineProps<{
  locals: {
    height: 0
    region: 0
    route: 0
    width: 0
    x: 0
    y: 0
  }
}>()
onMounted(() => {
})
const gClick = () => {
  MapHelper.moveToRoute(props.locals.route, props.locals.region)
}
const rectClass = () => {
  console.log('rectClass')
  MapHelper.calculateRouteCssClass(props.locals.route, props.locals.region)
}
</script>
