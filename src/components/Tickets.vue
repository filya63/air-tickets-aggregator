<template>
   <TicketsItem
      v-for="ticket in tickets"
      :ticket="ticket"
      :key="ticket"
   />
   <button
      class="tickets-pagination__button"
      @click="showMoreTickets"
   >
      Показать еще 5 билетов
   </button>
</template>

<script>
import TicketsItem from './TicketsItem.vue';

export default {
   components: {
      TicketsItem,
   },

   props: {
      selectedTransfers: {
         type: Array,
         default: () => [],
      },

      activeTab: {
         type: String,
         default: () => null,
      },
   },

   data() {
      return {
         originalTickets: [],
         searchId: null,
         tickets: [],
         filteredTickets: [],
         renderedTickets: 5,
      };
   },

   watch: {
      activeTab( newTab ) {
         if( !newTab ) {
            return;
         }

         if( !this.selectedTransfers.length ) {
            this.filteredTickets = [];
         }

         this.sortOrFilterTickets();
         this.renderFirstTickets();
      },

      selectedTransfers: {
         handler( newSelectedTransfers ) {
            if( !newSelectedTransfers.length && !this.activeTab ) {
               this.filteredTickets = [];

               return;
            }

            this.sortOrFilterTickets();
            this.renderFirstTickets();
         },
         deep: true,
      },
   },

   methods: {
      async getSearchId() {
         const response = await fetch('https://front-test.beta.aviasales.ru/search');
         const { searchId } = await response.json();
         this.searchId = searchId;
      },

      async getTickets() {
         const response = await fetch(`https://front-test.beta.aviasales.ru/tickets?searchId=${this.searchId}`);
         const { tickets } = await response.json();
         this.originalTickets = tickets;
      },

      renderFirstTickets() {
         this.renderedTickets = 5;

         if( this.filteredTickets.length ) {
            this.tickets = this.filteredTickets.slice( 0, this.renderedTickets );

            return;
         }

         this.tickets = this.originalTickets.slice( 0, this.renderedTickets );
      },

      showMoreTickets() {
         let nextTickets = this.originalTickets.slice( this.renderedTickets, this.renderedTickets + 5 );

         if( this.filteredTickets.length ) {
            nextTickets = this.filteredTickets.slice( this.renderedTickets, this.renderedTickets + 5 );
         }

         this.tickets.push( ...nextTickets );
         this.renderedTickets += 5;
      },

      sortOrFilterTickets() {
         if( this.activeTab ) {
            if( this.selectedTransfers.length ) {
               this.filterTransfers();
               this.sortTickets('filteredTickets');

               return;
            }

            this.sortTickets('originalTickets');
         }

         if( this.selectedTransfers.length ) {
            this.filterTransfers();
         }
      },

      sortTickets( tickets ) {
         this[tickets].sort(( nextTicket, currentTicket ) => {
            if( this.activeTab === 'tab-low-cost' ) {
               return nextTicket.price - currentTicket.price;
            }

            return ( nextTicket.segments[0].duration + nextTicket.segments[1].duration ) - ( currentTicket.segments[0].duration + currentTicket.segments[1].duration )
         });
      },

      filterTransfers() {
         this.filteredTickets = this.originalTickets.filter(( ticket ) => {
            return this.selectedTransfers.indexOf( ticket.segments[0].stops.length ) !== -1;
         });
      },

      normalizeTicketsInfo() {
         this.originalTickets = this.originalTickets.map( ( ticket ) =>  {

            // Нормализуем данные со временем в билете в одну сторону
            const dateTicketThere = new Date( ticket.segments[0].date );
            ticket.segments[0].normalizedDuration = this.normalizeMinutes( ticket.segments[0].duration );
            ticket.segments[0].date = this.normalizeFullDate( dateTicketThere );

            // Нормализуем данные со временем в билете в другую сторону
            const dateTicketBack = new Date( ticket.segments[1].date );
            ticket.segments[1].normalizedDuration = this.normalizeMinutes( ticket.segments[1].duration );
            ticket.segments[1].date = this.normalizeFullDate( dateTicketBack );

            return ticket;
         } );
      },

      normalizeFullDate( date ) {
         const minutes = date.getMinutes();
         const hours = date.getHours();
         const days = date.getDate();
         const month = date.getMonth() + 1;

         return {
            minutes: String(minutes).padStart(2, '0'),
            hours: String(hours).padStart(2, '0'),
            days: String(days).padStart(2, '0'),
            month: String(month).padStart(2, '0'),
            year: date.getFullYear(),
         }
      },

      normalizeMinutes( initialMinutes ) {
         const hours = Math.trunc( initialMinutes / 60 );
         const minutes = initialMinutes % 60;

         return `${hours}ч ${minutes}м`;
      }
   },
   
   async created() {
      await this.getSearchId();
      await this.getTickets();

      this.normalizeTicketsInfo();
      this.renderFirstTickets();
   },
};

</script>

<style lang="scss">
   .tickets {
      &-pagination {
            &__button {
                background: #2196F3;
                border-radius: 5px;
                padding: 20px 0;
                width: 100%;
                color: white;
                margin-bottom: 20px;
            }
        }
   }
</style>
