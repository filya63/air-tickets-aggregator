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
      v-if="isShowButtonMoreTickets"
      class="tickets-pagination__button"
      :disabled="isErrorMessage"
      @click="showMoreTickets"
   >
      Показать еще 5 билетов
   </button>
</template>

<script>
import TicketsItem from './TicketsItem.vue';
import ErrorMessage from './ErrorMessage.vue';

import { MAX_NUMBER_RETRIES } from '../constants';
import api from '../api';

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
      },

      isShowButtonMoreTickets() {
         if( this.changedTicketList.length ) {
            return this.renderedTickets <= this.changedTicketList.length;
         }

         return this.renderedTickets <= this.originalTicketList.length;
      },
   },

   methods: {
      async getSearchId( retries ) {
         try {
            this.searchId = await api.getSearchId();
         } catch( errorMessage ) {
            if( retries <= 0 ) {
               this.errorMessage = errorMessage;
            }

            return this.getSearchId( retries - 1 );
         }
      },

      async getTickets( retries ) {
         try {
            this.originalTicketList = await api.getTickets( this.searchId );
         } catch( errorMessage ) {
            if( retries <= 0 ) {
               this.errorMessage = errorMessage;
            }

            return this.getTickets( retries - 1 );
         }
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
               this.sortTickets( 'changedTicketList' );

               return;
            }

            this.sortTickets( 'originalTicketList' );
         }

         if( this.selectedTransfers.length ) {
            this.filterTransfers();
         }
      },

      sortTickets( tickets ) {
         this[ tickets ].sort(( nextTicket, currentTicket ) => {
            if( this.activeTab === 'tab-low-cost' ) {
               return nextTicket.price - currentTicket.price;
            }

            const [ nextTicketThere, nextTicketBack ] = nextTicket.segments;
            const [ currentTicketThere, currentTicketBack ] = currentTicket.segments;
            return ( nextTicketThere.duration + nextTicketBack.duration ) - ( currentTicketThere.duration + currentTicketBack.duration )
         });
      },

      filterTransfers() {
         this.changedTicketList = this.originalTicketList.filter(( ticket ) => {
            return this.selectedTransfers.includes( ticket.segments[0].stops.length );
         });
      },

      normalizeTicketsInfo() {
         this.originalTicketList = this.originalTicketList.map( ( ticket ) =>  {
            const [ ticketThere, ticketBack ] = ticket.segments;

            // Нормализуем данные со временем в билете в одну сторону
            const dateTicketThere = new Date( ticketThere.date );
            ticketThere.normalizedDuration = this.normalizeMinutes( ticketThere.duration );
            ticketThere.date = this.normalizeFullDate( dateTicketThere );

            // Нормализуем данные со временем в билете в другую сторону
            const dateTicketBack = new Date( ticketBack.date );
            ticketBack.normalizedDuration = this.normalizeMinutes( ticketBack.duration );
            ticketBack.date = this.normalizeFullDate( dateTicketBack );

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
      await this.getSearchId( MAX_NUMBER_RETRIES );
      await this.getTickets( MAX_NUMBER_RETRIES );

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
