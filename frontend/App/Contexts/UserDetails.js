import {API_ROOT} from './../../apiroot';

const getUserDetails = async (token) => {
    const response = await fetch(API_ROOT + '/user-profile/', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`
        }
    });

    return await response.json();
}

export default getUserDetails;
