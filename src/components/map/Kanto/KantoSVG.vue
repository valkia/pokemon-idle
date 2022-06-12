<template>
  <svg id="map" width="600" height="500" viewBox="0,0,1600,960" preserveAspectRatio="xMaxYMax meet">
    <g>
      <image width="1600" height="960" :xlink:href="'/map/kanto.png'" href="/map/kanto.png" />
      <!-- ------ -->
      <!-- ROUTES -->
      <!-- ------ -->

      <!--Route 1-->
      <map-route
        :locals="{route: 1, region: 0
                  , width: 7.5, height: 3
                  , x: 23, y: 29
                  , rotate: true
        }"
      />

      <!--Route 2-->
      <map-route
        :locals="{route: 2, region: 0
                  , width: 3, height: 3
                  , x: 23, y: 22
                  , rotate: true
        }"
      />
      <!--Extra bit of Route 2-->
      <map-route
        :locals="{route: 2, region: 0
                  , width: 3, height: 3.5
                  , x: 23, y: 14
                  , noText: true
        }"
      />

      <!--Route 3-->
      <map-route
        :locals="{route: 3, region: 0
                  , width: 15, height: 3
                  , x: 30, y: 11
        }"
      />

      <!--Route 4-->
      <map-route
        :locals="{route: 4, region: 0
                  , width: 12, height: 3
                  , x: 50, y: 10
        }"
      />

      <!--Route 5-->
      <map-route
        :locals="{route: 5, region: 0
                  , width: 1.5, height: 3
                  , x: 66, y: 16.5
                  , rotate: true
        }"
      />
      <!--Extra bit of Route 5-->
      <map-route
        :locals="{route: 5, region: 0
                  , width: 3.5, height: 2
                  , x: 66, y: 13
                  , rotate: true
                  , noText: true

        }"
      />

      <!--Route 6-->
      <map-route
        :locals="{route: 6, region: 0
                  , width: 5, height: 3
                  , x: 66, y: 26
                  , rotate: true
        }"
      />

      <!--Route 7-->
      <map-route
        :locals="{route: 7, region: 0
                  , width: 11, height: 3
                  , x: 49, y: 20
        }"
      />

      <!--Route 8-->
      <map-route
        :locals="{route: 8, region: 0
                  , width: 14, height: 3
                  , x: 71, y: 20
        }"
      />

      <!--Route 9-->
      <map-route
        :locals="{route: 9, region: 0
                  , width: 16, height: 3
                  , x: 71, y: 9
        }"
      />

      <!--Extra bit of Route 9-->
      <map-route
        :locals="{route: 9, region: 0
                  , width: 1, height: 1
                  , x: 87, y: 9
                  , noText: true
        }"
      />

      <!--Route 10-->
      <map-route
        :locals="{route: 10, region: 0
                  , width: 3, height: 1
                  , x: 88, y: 9
                  , noText: true
        }"
      />
      <!--Extra bit of Route 10-->
      <map-route
        :locals="{route: 10, region: 0
                  , width: 3, height: 3
                  , x: 88, y: 13
                  , rotate: true
        }"
      />
      <!--Extra bit of Route 10-->
      <map-route
        :locals="{route: 10, region: 0
                  , width: 1, height: 3
                  , x: 88, y: 16
                  , noText: true
        }"
      />

      <!--Route 11-->
      <map-route
        :locals="{route: 11, region: 0
                  , width: 12, height: 3
                  , x: 71, y: 32
        }"
      />
      <!--Extra bit of Route 11-->
      <map-route
        :locals="{route: 11, region: 0
                  , width: 3, height: 1.5
                  , x: 83, y: 33.5
                  , noText: true
        }"
      />
      <!--Extra bit of Route 11-->
      <map-route
        :locals="{route: 11, region: 0
                  , width: 2, height: 3
                  , x: 86, y: 32
                  , noText: true
        }"
      />

      <!--Route 12-->
      <map-route
        :locals="{route: 12, region: 0
                  , width: 8, height: 3
                  , x: 88, y: 24
                  , rotate: true
        }"
      />

      <!--Route 13-->
      <map-route
        :locals="{route: 13, region: 0
                  , width: 11, height: 3
                  , x: 88, y: 32
                  , rotate: true
        }"
      />

      <!--Route 14-->
      <map-route
        :locals="{route: 14, region: 0
                  , width: 13, height: 3
                  , x: 75, y: 40
        }"
      />

      <!--Route 15-->
      <map-route
        :locals="{route: 15, region: 0
                  , width: 23, height: 3
                  , x: 52, y: 44
        }"
      />
      <!--Extra bit of Route 15-->
      <map-route
        :locals="{route: 15, region: 0
                  , width: 3, height: 1
                  , x: 72, y: 43
                  , noText: true
        }"
      />

      <!--Route 16-->
      <map-route
        :locals="{route: 16, region: 0
                  , width: 6, height: 3
                  , x: 34, y: 20
        }"
      />

      <!--Route 17-->
      <map-route
        :locals="{route: 17, region: 0
                  , width: 21, height: 3
                  , x: 34, y: 23
                  , rotate: true
        }"
      />

      <!--Route 18-->
      <map-route
        :locals="{route: 18, region: 0
                  , width: 10, height: 3
                  , x: 34, y: 44
        }"
      />

      <!--Route 19-->
      <map-route
        :locals="{route: 19, region: 0
                  , width: 10, height: 3
                  , x: 41, y: 54
        }"
      />
      <!--Extra bit of Route 19-->
      <map-route
        :locals="{route: 19, region: 0
                  , width: 3, height: 5
                  , x: 48, y: 49
                  , noText: true
        }"
      />

      <!--Route 20-->
      <map-route
        :locals="{route: 20, region: 0
                  , width: 8, height: 3
                  , x: 27, y: 54
        }"
      />

      <!--Route 21-->
      <map-route
        :locals="{route: 21, region: 0
                  , width: 12, height: 3
                  , x: 23, y: 41
                  , rotate: true
        }"
      />

      <!--Route 22-->
      <map-route
        :locals="{route: 22, region: 0
                  , width: 16, height: 3
                  , x: 7, y: 26
        }"
      />

      <!--Route 23-->
      <map-route
        :locals="{route: 23, region: 0
                  , width: 3, height: 3
                  , x: 7, y: 23
                  , rotate: true
        }"
      />
      <!--Extra bit of Route 23-->
      <map-route
        :locals="{route: 23, region: 0
                  , width: 6, height: 3
                  , x: 7, y: 12
                  , noText: true
                  , rotate: true
        }"
      />

      <!--Route 24-->
      <map-route
        :locals="{route: 24, region: 0
                  , width: 4, height: 3
                  , x: 66, y: 5
                  , rotate: true
        }"
      />

      <!--Route 25-->
      <map-route
        :locals="{route: 25, region: 0
                  , width: 17, height: 3
                  , x: 66, y: 2
        }"
      />

      <!-- ----- -->
      <!-- TOWNS -->
      <!-- ----- -->

      <!--Pallet Town-->
      <map-town
        :locals="{name: 'Pallet Town'
                  , x: 22, y: 36.5
                  , width: 5, height: 4.5
                  , home: true
        }"
      />

      <!--Viridian City-->
      <map-town
        :locals="{name: 'Viridian City'
                  , x: 23, y: 25
        }"
      />

      <!--Viridian City extended-->
      <map-town
        :locals="{name: 'Viridian City'
                  , x: 27, y: 26
                  , width: 1, height: 3
        }"
      />

      <!--Pewter City-->
      <map-town
        :locals="{name: 'Pewter City'
                  , x: 22, y: 9
                  , width: 8, height: 5
        }"
      />
      <!--Pewter City extended-->
      <map-town
        :locals="{name: 'Pewter City'
                  , x: 23, y: 6
                  , width: 7, height: 3
        }"
      />

      <!--Cerulean City-->
      <map-town
        :locals="{name: 'Cerulean City'
                  , x: 62, y: 9
                  , width: 9, height: 4
        }"
      />

      <!--Vermilion City-->
      <map-town
        :locals="{name: 'Vermilion City'
                  , x: 61, y: 31
                  , width: 10, height: 4
        }"
      />

      <!--Lavender Town-->
      <map-town
        :locals="{name: 'Lavender Town'
                  , x: 85, y: 19
                  , width: 4, height: 5
        }"
      />

      <!--Celadon City-->
      <map-town
        :locals="{name: 'Celadon City'
                  , x: 40, y: 15.5
                  , width: 9, height: 10.5
        }"
      />

      <!--Celadon City extended-->
      <map-town
        :locals="{name: 'Celadon City'
                  , x: 40, y: 14
                  , width: 5, height: 1.5
        }"
      />

      <!--Saffron City-->
      <map-town
        :locals="{name: 'Saffron City'
                  , x: 60, y: 18
                  , width: 11, height: 8
        }"
      />

      <!--Saffron City extended-->
      <map-town
        :locals="{name: 'Saffron City'
                  , x: 60, y: 14
                  , width: 6, height: 4
        }"
      />

      <!--Fuchsia City-->
      <map-town
        :locals="{name: 'Fuchsia City'
                  , x: 44, y: 44
                  , width: 8, height: 5
        }"
      />

      <!--Cinnabar Island-->
      <map-town
        :locals="{name: 'Cinnabar Island'
                  , x: 22, y: 53
                  , width: 5, height: 5
        }"
      />

      <!--Cinnabar Island ext1-->
      <map-town
        :locals="{name: 'Cinnabar Island'
                  , x: 15, y: 58
                  , width: 8, height: 1
        }"
      />

      <!--Cinnabar Island ext2-->
      <map-town
        :locals="{name: 'Cinnabar Island'
                  , x: 15, y: 55
                  , width: 7, height: 3
        }"
      />

      <!--Indigo Plateau Kanto-->
      <map-town
        :locals="{name: 'Indigo Plateau Kanto'
                  , x: 3, y: 0
                  , width: 11, height: 12
        }"
      />

      <!-- -------- -->
      <!-- DUNGEONS -->
      <!-- -------- -->

      <!--Viridian Forest-->
      <map-dungeon
        :locals="{name: 'Viridian Forest'
                  , x: 21, y: 17.5
                  , width: 7, height: 4.5
        }"
      />

      <!--Digletts Cave Pewter-->
      <map-dungeon
        :locals="{name: 'Digletts Cave'
                  , x: 27, y: 14
                  , width: 3, height: 3
        }"
      />
      <!--Digletts Cave Vermilion-->
      <map-dungeon
        :locals="{name: 'Digletts Cave'
                  , x: 72, y: 29
                  , width: 3, height: 3
        }"
      />
      <!--Mt. Moon-->
      <map-dungeon
        :locals="{name: 'Mt. Moon'
                  , x: 41, y: 8
        }"
      />

      <!--Mt. Moon extended-->
      <map-dungeon
        :locals="{name: 'Mt. Moon'
                  , x: 45, y: 8
                  , width: 5, height: 6
        }"
      />

      <!--Rock Tunnel-->
      <map-dungeon
        :locals="{name: 'Rock Tunnel'
                  , x: 87, y: 10
        }"
      />

      <!--Power Plant-->
      <map-dungeon
        :locals="{name: 'Power Plant'
                  , x: 93, y: 14
                  , height: 4
        }"
      />
      <!--Power Plant Extenstion-->
      <map-dungeon
        :locals="{name: 'Power Plant'
                  , x: 91, y: 14
                  , width: 2, height: 2
        }"
      />

      <!--Pokémon Tower-->
      <map-dungeon
        :locals="{name: 'Pokemon Tower'
                  , x: 89, y: 16
                  , width: 4, height: 8
        }"
      />

      <!--Seafoam Islands-->
      <map-dungeon
        :locals="{name: 'Seafoam Islands'
                  , x: 37, y: 54
        }"
      />

      <!--Seafoam Islands extended-->
      <map-dungeon
        :locals="{name: 'Seafoam Islands'
                  , x: 35, y: 54
                  , width: 2, height: 4
        }"
      />

      <!--Pokémon Mansion-->
      <map-dungeon
        :locals="{name: 'Pokemon Mansion'
                  , x: 15, y: 50
                  , width: 7, height: 5
        }"
      />

      <!--Victory Road-->
      <map-dungeon
        :locals="{name: 'Victory Road'
                  , x: 6, y: 18
                  , width: 5, height: 4
        }"
      />
      <!--Victory Road Extension-->
      <map-dungeon
        :locals="{name: 'Victory Road'
                  , x: 7, y: 22
                  , width: 3, height: 1
        }"
      />

      <!--Cerulean Cave-->
      <map-dungeon
        :locals="{name: 'Cerulean Cave'
                  , x: 61, y: 5
        }"
      />

      <!-- ------------------ -->
      <!-- PLACES OF INTEREST -->
      <!-- ------------------ -->

      <!--
        , databind: "click:function(){BreedingController.openBreedingModal()}, attr: { class: App.game.breeding.canAccess() ? 'completed' : 'locked' }"

 -->
      <map-p-o-i
        :class="App?.game?.breeding?.canAccess() ? 'completed' : 'locked'"
        :locals="{name: 'Pokemon Day Care'
                  , x: 68, y: 13
                  , width: 4, height: 4
        }"
        @click="BreedingController.openBreedingModal()"
      />
      <!--
              , databind: "click:function(){Safari.openModal()}, attr: { class: Safari.canAccess() ? 'completed' : 'locked' }"

       -->
      <map-p-o-i
        :class="Safari?.canAccess() ? 'completed' : 'locked'"
        :locals="{name: 'Safari Zone'
                  , x: 47, y: 39
                  , width: 6, height: 5
        }"
        @click="Safari.openModal()"
      />
      <!--
              , databind: "click:function(){App.game.underground.openUndergroundModal()}, attr: { class: App.game.underground.canAccess() ? 'completed' : 'locked' }"

       -->
      <map-p-o-i
        :class="App?.game?.underground?.canAccess() ? 'completed' : 'locked'"
        :locals="{name: 'Underground Entrance'
                  , x: 83, y: 30
                  , width: 3, height: 4
        }"
        @click="App.game.underground.openUndergroundModal()"
      />
      <!--
              , databind: "click:function(){FarmController.openFarmModal()}, attr: { class: App.game.farming.canAccess() ? 'completed' : 'locked' }"

       -->
      <map-p-o-i
        :class="App?.game?.farming?.canAccess() ? 'completed' : 'locked'"
        :locals="{name: 'Farm'
                  , x: 72, y: 40
                  , width: 3, height: 3
        }"
        @click="MapHelper.openFarmModal()"
      />

      <!--
              , databind: "click:function(){MapHelper.openShipModal()}, attr:{ class: player.highestRegion() >= 1 ? 'completed' : 'locked'}"

       -->
      <map-p-o-i
        :class="player?.highestRegion() >= 1 ? 'completed' : 'locked'"
        :locals="{name: 'Dock'
                  , x: 61, y: 35
                  , width: 3, height: 2
        }"
        @click="MapHelper.openShipModal()"
      />
      <!--
               , databind: "click:function(){MapHelper.openShipModal()}, attr:{ class: player.highestRegion() >= 1 ? 'completed' : 'locked'}"

       -->
      <map-overlay
        v-if="player?.highestRegion() >= 1"
        :class="player?.highestRegion() >= 1 ? 'completed' : 'locked'"
        :locals="{name: 'SS-Anne'
                  , x: 58, y: 35
                  , width: 8, height: 3
                  , image: '/map/ship.png'
        }"
        @click="MapHelper.openShipModal()"
      />
      <!--
               , databind: "click:function(){MapHelper.moveToTown('Pallet Town')}, attr:{ class: MapHelper.calculateTownCssClass('Pallet Town') }"

       -->
      <map-overlay
        v-if="MapHelper?.ableToTravel() && player?.starter() != GameConstants?.Starter?.Pikachu"
        :class="MapHelper?.calculateTownCssClass('Pallet Town')"
        :locals="{name: 'Professor Oak`s Blimp'
                  , x: 27, y: 37
                  , width: 6, height: 3
                  , image: '/map/blimp_empty.png'
        }"
        @click="MapHelper.moveToTown('Pallet Town')"
      />
      <!--
               , databind: "click:function(){MapHelper.moveToTown('Pallet Town')}, attr:{ class: MapHelper.calculateTownCssClass('Pallet Town') }"

       -->
      <map-overlay
        v-if="MapHelper?.ableToTravel() && player?.starter() == GameConstants?.Starter?.Pikachu"
        :class="MapHelper?.calculateTownCssClass('Pallet Town')"
        :locals="{name: 'Professor Oak`s Blimp'
                  , x: 27, y: 37
                  , width: 6, height: 3
                  , image: '/map/blimp_pikachu.png'
        }"
        @click="MapHelper.moveToTown('Pallet Town')"
      />
    </g>
  </svg>
</template>
<script setup>
import mapDungeon from './mapDungeon.vue'
import mapOverlay from './mapOverlay.vue'
import mapPOI from './mapPOI.vue'
import mapRoute from './mapRoute.vue'
import mapTown from './mapTown.vue'
import App from '~/scripts/App.ts'

</script>
<style lang="scss">
// Map
$locked: #000000;
$currentPlace: #55ff00;
$incomplete: #ff9100;
$uncaughtPokemon: #3498db;
$uncaughtShinyPokemon: #ffee00;
$completed: #ffffff00;

// Usage: fill: var(--locked);
:root {
  --locked: $locked;
  --currentPlace: $currentPlace;
  --incomplete: $incomplete;
  --uncaughtPokemon: $uncaughtPokemon;
  --uncaughtShinyPokemon: $uncaughtShinyPokemon;
  --completed: $completed;
}
#map {
rect, path {
  cursor: pointer;
  fill: transparent;
}

text {
  pointer-events: none;
}

.currentLocation {
  fill: $currentPlace;
  opacity: 0.5;
}

.locked {
  fill: $locked;
  opacity: 0.5;
}

.unlockedUnfinished {
  fill: $incomplete;
  opacity: 0.6;
}

.uncaughtPokemon {
  fill: $uncaughtPokemon;
  opacity: 0.6;
}

.uncaughtShinyPokemon {
  fill: $uncaughtShinyPokemon;
  opacity: 0.6;
}

.completed {
  fill: $completed;
  opacity: 0.6;
}

.flash {
  opacity: 1;
  fill: #FFD700;
  stroke: black;
}
}

#mapTooltip {
  position: absolute;
  left: 0px;
  font-size: 13px;
  font-family: pokemonFont, "Helvetica Neue", sans-serif;
  padding: 3px;
  border: solid #7f7f7f 1px;
  pointer-events: none;
}

</style>
