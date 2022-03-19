<template>
   <div class="ticket">
      <div class="ticket-header">
         <span class="ticket-header__price">
            {{ ticket.price }} руб.
         </span>
         <span class="ticket-header__carrier">
            Авиакомпания: {{ ticket.carrier }}
         </span>
      </div>
      <div
         class="ticket-informations"
         v-for="segment in ticket.segments"
         :key ="segment"
      >
         <div class="ticket-informations__item">
            <h3 class="ticket-informations__item-title">
               {{ segment.origin }} - {{ segment.destination }}
            </h3>
            <span class="ticket-informations__item-date">
               {{ segment.date.days }}.{{ segment.date.month }}.{{ segment.date.year }} {{ segment.date.hours }}:{{ segment.date.minutes }}
            </span>
         </div>
         <div class="ticket-informations__item">
            <h3 class="ticket-informations__item-title">
               В пути
            </h3>
            <span class="ticket-informations__item-duration">
               {{ segment.normalizedDuration }}
            </span>
         </div>
         <div class="ticket-informations__item">
            <h3 class="ticket-informations__item-title">
               {{ normalizeNumberStopsText( segment.stops.length ) }}
            </h3>
            <span class="ticket-informations__item-stops">
               {{ segment.stops.join(', ') }}
            </span>
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
      },
   },

   methods: {
      normalizeNumberStopsText( number ) {
         switch( number ) {
            case 0:
               return 'Без пересадок';
            case 1:
               return '1 пересадка';
            case 2:
               return '2 пересадки';
            case 3:
               return '3 пересадки';
         }
      },
   },
};
</script>

<style lang="scss">
   .ticket {
      background: white;
      border-radius: 5px;
      margin-bottom: 20px;
      padding: 20px;
      box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
      &:last-child {
         margin-bottom: 0;
      }
      &-header {
         display: flex;
         justify-content: space-between;
         align-items: center;
         margin-bottom: 26px;
         &__price {
            font-weight: 600;
            font-size: 24px;
            line-height: 24px;
            color: #2196F3;
         }
      }
      &-informations {
         display: flex;
         margin-bottom: 20px;
         &:last-child {
            margin-bottom: 0;
         }
         &__item {
            display: flex;
            flex-direction: column;
            margin-right: 90px;
            margin-bottom: 10px;
            text-align: center;
            span {
               font-weight: 600;
            }
            &-title {
               color: #A0B0B9;
               text-transform: uppercase;
               margin-bottom: 5px;
            }
            &:last-child {
               margin-right: 0;
               margin-bottom: 0;
            }
         }
      }
   }
</style>
