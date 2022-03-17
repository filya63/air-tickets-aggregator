<template>
   <div class="ticket">
      <div  class="ticket__header">
         <p class="ticket__header-price">{{ ticket.price }}</p>
         <p class="ticket__header-code">{{ ticket.carrier }}</p>
      </div>
      <div class="ticket__section"
         v-for="segment in ticket.segments" 
         :key ="segment"
      >
         <div class="ticket__information">
            <p class="ticket__information-text">{{ segment.origin }}</p>
            <p class="ticket__information-data">{{ segment.date.fullDate }}</p>
         </div>
         <div class="ticket__information">
            <p class="ticket__information-text">В пути {{ segment.duration }}</p>
         </div>
         <div class="ticket__information" 
            v-for="(stop, index) in segment.stops"
            :key="stop"
         >
            <p class="ticket__information-text">Пересадка {{ index + 1 }}: {{stop}} </p>
         </div>
      </div>
   </div>
</template>

<script>
export default {
   props: {
      ticket: {
         type: Object,
         default: () => {},
      }
   }
}
</script>
