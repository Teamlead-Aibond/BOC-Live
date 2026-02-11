import {AppConfig} from 'config';

export const environment = {
    production: true,
    isMockEnabled: false, // You have to switch this, when your real back-end is done
    Authorization: '',
    api: {
        apiURL: window.location.protocol + AppConfig.backendURL
    }
};
