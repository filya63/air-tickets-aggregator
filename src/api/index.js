export default {
    getSearchId: async () => {
        let response;

        try {
            response = await fetch('https://front-test.beta.aviasales.ru/search');
        } catch( error ) {
            throw new Error( error.message );
        }

        const { searchId } = await response.json();
        return searchId;
    },

    getTickets: async ( searchId ) => {
        let response;

        try {
            response = await fetch(`https://front-test.beta.aviasales.ru/tickets?searchId=${searchId}`);
        } catch( error ) {
            throw new Error( error.message );
        }

        const { tickets } = await response.json();
        return tickets;
    },
}
