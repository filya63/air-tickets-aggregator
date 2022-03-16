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

      normalizeDate() {
         this.tickets = this.tickets.map( ( ticket ) =>  {

            // Нормализуем даты билета в одну сторону
            const dateTicketThere = new Date(ticket.segments[0].date);
            const fullDateThere = `${dateTicketThere.getDate()}-${dateTicketThere.getMonth() + 1}-${dateTicketThere.getFullYear()}`;
            ticket.segments[0].duration = this.normalizeMinutes( ticket.segments[0].duration );
            ticket.segments[0].date = {
               minutes: dateTicketThere.getMinutes(),
               hour: dateTicketThere.getHours(),
               fullDate: fullDateThere,
            };

            // Нормализуем даты билета в другую сторону
            const dateTicketBack = new Date(ticket.segments[1].date);
            const fullDateBack = `${dateTicketBack.getDate()}-${dateTicketBack.getMonth() + 1}-${dateTicketBack.getFullYear()}`;
            ticket.segments[1].duration = this.normalizeMinutes( ticket.segments[1].duration );
            ticket.segments[1].date = {
               minutes: dateTicketBack.getMinutes(),
               hour: dateTicketBack.getHours(),
               fullDate: fullDateBack,
            };

            return ticket;
         } );
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

      this.normalizeDate();
    }
}

</script>
