import { AVIASALES_URL } from '../constants';

export default {
    async getSearchId() {
        try {
            const response = await fetch(`${AVIASALES_URL}/search`);
            const { searchId } = await response.json();

            return searchId;
        } catch( error ) {
            throw new Error( error.message );
        }
    },

    async getTickets( searchId ) {
        try {
            const response = await fetch(`${AVIASALES_URL}/tickets?searchId=${searchId}`);
            const { tickets } = await response.json();

            return tickets;
        } catch( error ) {
            throw new Error( error.message );
        }
    },
}
