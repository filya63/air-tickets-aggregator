<template>
   <TicketsItem
      v-for="ticket in tickets" 
      v-bind:ticket="ticket"  
      :key="ticket"
   />
</template>

<script>
import TicketsItem from './TicketsItem.vue'

export default{
   components:{
      TicketsItem
   },

   data() {
      return {
         tickets: [],
         searchId: null,
    }
   },

   methods:{
      change(){
         this.tickets = this.tickets.map( ( item ) =>  {

            // Конструируем дату билета в одну сторону
            const dateTicketThere = new Date(item.segments[0].date);
            const fullDateThere = `${dateTicketThere.getDate()}-${dateTicketThere.getMonth() + 1}-${dateTicketThere.getFullYear()}`;
            item.segments[0].date = {
               minutes: dateTicketThere.getMinutes(),
               hour: dateTicketThere.getHours(),
               fullDate: fullDateThere,
            };

            // Конструируем дату билета в другую сторону
            const dateTicketBack = new Date(item.segments[1].date);
            const fullDateBack = `${dateTicketBack.getDate()}-${dateTicketBack.getMonth() + 1}-${dateTicketBack.getFullYear()}`;
            item.segments[1].date = {
               minutes: dateTicketBack.getMinutes(),
               hour: dateTicketBack.getHours(),
               fullDate: fullDateBack,
            };

            return item;
         } );
      },
   },
   
   async created() {
      const responseSearchId = await fetch('https://front-test.beta.aviasales.ru/search');
      const { searchId } = await responseSearchId.json();
      this.searchId = searchId;
      const responseTikets = await fetch(`https://front-test.beta.aviasales.ru/tickets?searchId=${this.searchId}`);
      const { tickets } = await responseTikets.json();
      this.tickets = tickets;

      await this.change();
      console.log(this.tickets);
    }
}

</script>
