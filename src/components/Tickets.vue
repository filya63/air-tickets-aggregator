<template>
   <TicketsItem
      v-for="ticket in tickets"
      :ticket="ticket"
      :key="ticket"
   />
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
      }
   },

   data() {
      return {
         tickets: [],
         filteredTickets: [],
         searchId: null,
      };
   },

   // watch: {
   //    selectedTransfers: function(newValue, oldValue) {
   //       this.filteredTickets = this.tickets.filter(ticket => ticket)
   //    },
   // },

   methods: {
      async getSearchId() {
         const response = await fetch('https://front-test.beta.aviasales.ru/search');
         const { searchId } = await response.json();
         this.searchId = searchId;
      },

      async getTickets() {
         const response = await fetch(`https://front-test.beta.aviasales.ru/tickets?searchId=${this.searchId}`);
         const { tickets } = await response.json();
         this.tickets = tickets;
      },

      normalizeTicketsInfo() {
         this.tickets = this.tickets.map( ( ticket ) =>  {

            // Нормализуем данные со временем в билете в одну сторону
            const dateTicketThere = new Date( ticket.segments[0].date );
            ticket.segments[0].duration = this.normalizeMinutes( ticket.segments[0].duration );
            ticket.segments[0].date = this.normalizeFullDate( dateTicketThere );

            // Нормализуем данные со временем в билете в другую сторону
            const dateTicketBack = new Date( ticket.segments[1].date );
            ticket.segments[1].duration = this.normalizeMinutes( ticket.segments[1].duration );
            ticket.segments[1].date = this.normalizeFullDate( dateTicketBack );

            return ticket;
         } );
      },

      normalizeFullDate( date ) {
         const fullDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;

         return {
            minutes: date.getMinutes(),
            hour: date.getHours(),
            fullDate,
         }
      },

      normalizeMinutes( initialMinutes ) {
         const hours = Math.trunc( initialMinutes / 60 );
         const minutes = initialMinutes % 60;
         return `${hours} часов ${minutes} минут`;
      }
   },
   
   async created() {
      await this.getSearchId();
      await this.getTickets();

      this.normalizeTicketsInfo();
    }
}

</script>
