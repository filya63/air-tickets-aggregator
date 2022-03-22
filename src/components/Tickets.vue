<template>
   <template v-if="!isErrorMessage">
      <TicketsItem
         v-for="ticket in tickets"
         :ticket="ticket"
         :key="ticket"
      />
   </template>
   <ErrorMessage
      v-if="isErrorMessage"
      :error-message="errorMessage"
   />
   <button
      class="tickets-pagination__button"
      :disabled="isErrorMessage"
      @click="showMoreTickets"
   >
      Показать еще 5 билетов
   </button>
</template>

<script>
import TicketsItem from './TicketsItem.vue';
import api from '../api';
import ErrorMessage from './ErrorMessage.vue';

export default {
   components: {
    TicketsItem,
    ErrorMessage,
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
         originalTicketList: [], // Список билетов полученных с сервера
         changedTicketList: [], // Измененный список билетов по неким критериям
         tickets: [], // Билеты для отрисовки пользователю
         searchId: null,
         renderedTickets: 5,
         errorMessage: '',
      };
   },

   watch: {
      activeTab() {
         if( !this.selectedTransfers.length ) {
            this.changedTicketList = [];
         }

         this.changeTicketList();
         this.renderFirstTickets();
      },

      selectedTransfers: {
         handler( newSelectedTransfers ) {
            const isNotChangeTicketList = !newSelectedTransfers.length && !this.activeTab;

            if( isNotChangeTicketList ) {
               this.changedTicketList = [];
            }

            this.changeTicketList();
            this.renderFirstTickets();
         },
         deep: true,
      },
   },

   computed: {
      isErrorMessage() {
         return !!this.errorMessage;
      }
   },

   methods: {
      async getSearchId() {
         const searchId = await api.getSearchId();
         this.searchId = searchId;
      },

      async getTickets() {
         let tickets;

         try {
            tickets = await api.getTickets( this.searchId );
         } catch( error ) {
            this.errorMessage = error;
         }

         this.originalTicketList = tickets;
      },

      renderFirstTickets() {
         this.renderedTickets = 5;

         if( this.changedTicketList.length ) {
            this.tickets = this.changedTicketList.slice( 0, this.renderedTickets );

            return;
         }

         this.tickets = this.originalTicketList.slice( 0, this.renderedTickets );
      },

      showMoreTickets() {
         let nextTickets = this.originalTicketList.slice( this.renderedTickets, this.renderedTickets + 5 );

         if( this.changedTicketList.length ) {
            nextTickets = this.changedTicketList.slice( this.renderedTickets, this.renderedTickets + 5 );
         }

         this.tickets.push( ...nextTickets );
         this.renderedTickets += 5;
      },

      changeTicketList() {
         if( this.activeTab ) {
            if( this.selectedTransfers.length ) {
               this.filterTransfers();
               this.sortTickets('changedTicketList');

               return;
            }

            this.sortTickets('originalTicketList');
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
         this.changedTicketList = this.originalTicketList.filter(( ticket ) => {
            return this.selectedTransfers.indexOf( ticket.segments[0].stops.length ) !== -1;
         });
      },

      normalizeTicketsInfo() {
         this.originalTicketList = this.originalTicketList.map( ( ticket ) =>  {

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
               &:disabled {
                  background: #C0C0C0;
               }
               border-radius: 5px;
               padding: 20px 0;
               width: 100%;
               color: white;
               margin-bottom: 20px;
            }
        }
   }
</style>
