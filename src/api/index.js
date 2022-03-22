export default {
    getSearchId: async () => {
        try {
            const response = await fetch('https://front-test.beta.aviasales.ru/search');
            const { searchId } = await response.json();
            return searchId;
        } catch( error ) {
            throw new Error( error.message );
        }
    },

    getTickets: async ( searchId ) => {
        try {
            const response = await fetch(`https://front-test.beta.aviasales.ru/tickets?searchId=${searchId}`);
            const { tickets } = await response.json();
            return tickets;
        } catch( error ) {
            throw new Error( error.message );
        }
    },
}
