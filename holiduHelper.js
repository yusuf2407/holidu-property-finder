const BASE_URL = 'https://api.holidu.com';

async function getAvailabilities(propertyId){
    let response = await fetch(BASE_URL + "/search/v1/offers/" + propertyId + "/availability?domainId=1")
    let data = await response.json();
    
    return data;
}

function getPrice(){

}

async function getOffer(propertyId){
    let response = await fetch(BASE_URL + "/rest/v6.2/search/offers/" + propertyId + "?domainId=1")
    let data = await response.json();
   
    return data
}
