// Main holidu domains (holidu.xx) - On-Request properties need special handling on these
const MAIN_HOLIDU_DOMAINS = [
    'www.holidu.de',
    'www.holidu.com',
    'www.holidu.at',
    'www.holidu.ch',
    'www.holidu.fr',
    'www.holidu.es',
    'www.holidu.co.uk',
    'www.holidu.nl',
    'www.holidu.dk',
    'www.holidu.it',
    'www.holidu.be',
    'www.holidu.no',
    'www.holidu.se',
    'www.holidu.pl',
    'www.holidu.pt',
    'www.holidu.co.nz',
    'www.holidu.com.au',
    'www.holidu.ca',
    'www.holidu.ie',
    'www.holidu.com.br',
    'www.holidu.com.mx',
    'www.holidu.gr'
];

// Domain mapping - user can type domain name or ID
const DOMAIN_MAP = {
    // Main Holidu domains
    '1': 'www.holidu.de',
    '2': 'www.holidu.com',
    '261': 'www.holidu.fr',
    '341': 'www.holidu.at',
    '342': 'www.holidu.ch',
    '361': 'www.holidu.es',
    '362': 'www.holidu.co.uk',
    '401': 'www.holidu.nl',
    '421': 'www.holidu.dk',
    '621': 'www.holidu.it',
    '854': 'www.holidu.be',
    '898': 'www.holidu.no',
    '899': 'www.holidu.se',
    '900': 'www.holidu.pl',
    '1158': 'www.holidu.pt',
    '1220': 'www.holidu.co.nz',
    '1221': 'www.holidu.com.au',
    '1240': 'www.holidu.ca',
    '1241': 'www.holidu.ie',
    '1242': 'www.holidu.com.br',
    '1462': 'www.holidu.com.mx',
    '2519': 'www.holidu.gr',
    // Pirate sites
    '2399': 'urlaubspiraten.holidu.com',
    '2400': 'urlaubspiraten-at.holidu.com',
    '2419': 'holidaypirates.holidu.com',
    '2439': 'voyagespirates.holidu.com',
    '2440': 'wakacyjnipiraci.holidu.com',
    '2459': 'piratinviaggio.holidu.com',
    '2460': 'vakantiepiraten.holidu.com',
    '2461': 'ferienpiraten.holidu.com',
    '2479': 'viajerospiratas.holidu.com',
    '2480': 'travelpirates.holidu.com',
    // Special domains
    '3520': 'holiduhost.com',
    '701': 'bookiply.com',
    '1138': 'bookiply.es',
    '1899': 'bookiply.de',
    '1839': 'bookiply.fr',
    '1859': 'bookiply.it',
    '1879': 'bookiply.nl',
    '1919': 'bookiply.pt',
    '2539': 'bookiply.gr',
    '1679': 'hundredrooms.com',
    '1699': 'hundredrooms.net',
    '1700': 'hundredrooms.co.uk',
    '2360': 'ferienwohnungen-spanien.de',
    '2181': 'ferienwohnungen-italien.de',
    '2261': 'vakantiehuizen-frankrijk.nl',
    '2301': 'locations-vacances-france.com',
    '2401': 'ferienwohnungen-frankreich.de',
    '2321': 'locations-vacances-espagne.com',
    '2341': 'ferienhaeuser-spanien.de'
};

// Normalize domain input (convert ID to domain name, add www. if needed)
function normalizeDomainInput(input) {
    if (!input) return 'current';
    
    const trimmed = input.trim();
    
    // Check if it's a domain ID
    if (DOMAIN_MAP[trimmed]) {
        return DOMAIN_MAP[trimmed];
    }
    
    // If it's already a domain, ensure it has www. prefix (for main holidu domains)
    if (trimmed.includes('.')) {
        // Check if it's an environment/internal domain
        // These domains should NEVER have www. prefix
        const isEnvDomain = trimmed.includes('.holidu.io') ||      // holidu-client-test.holidu.io, holidu-client-develop.holidu.io
                           trimmed.includes('.holidu.cloud') ||    // stage.holidu.cloud
                           trimmed.includes('.holidu.com') ||      // Pirate sites (urlaubspiraten.holidu.com)
                           trimmed.startsWith('stage.') ||         // Legacy stage domains
                           trimmed.startsWith('develop.') ||       // Legacy develop domains
                           trimmed.startsWith('test.');            // Legacy test domains
        
        // If it's an env domain, return as-is
        if (isEnvDomain) {
            return trimmed;
        }
        
        // Add www. only for plain holidu domains (holidu.de, holidu.com, etc.) without www.
        if (trimmed.includes('holidu.') && !trimmed.startsWith('www.')) {
            return 'www.' + trimmed;
        }
        
        return trimmed;
    }
    
    // Fallback
    return trimmed;
}

async function findAvailableDates(propertyId, freeCancellation){

    let availabilities = await getAvailabilities(propertyId);
    let checkin, checkout = null;
  
    if (availabilities && availabilities.checkinDates && availabilities.checkinDates.length > 0){
      let i = 10;
      do {
        checkin = availabilities.checkinDates[Math.floor(Math.random() * availabilities.checkinDates.length)];
        checkout = availabilities.firstPossibleCheckout[checkin];
        i--;
      }
      while(i>0 && checkin && !(!freeCancellation || (Math.abs(new Date(checkin.replace( /(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3") ) - new Date())/ (1000 * 60 * 60 * 24)) >= freeCancellation ))
      
    }
    
    return { checkin, checkout };
}



function constructURL(propertyId, checkin, checkout, property) {
    
    let hostname = getHostname();
    
    // For On-Request properties, use urlaubspiraten.holidu.com if selected/current domain is a main holidu domain (holidu.xx)
    if (property && property.paymentType === 'On-Request') {
        console.log('🔍 On-Request property detected');
        console.log('   Current hostname from tab:', currentHostname);
        console.log('   Final hostname (after getHostname):', hostname);
        
        // Check if user input is empty (using current domain) or they explicitly selected a domain
        const userInput = selDomain.value.trim();
        const isUsingCurrentDomain = userInput === '' || userInput === 'current';
        
        console.log('   User input:', userInput === '' ? '(empty)' : userInput);
        console.log('   Is using current domain:', isUsingCurrentDomain);
        
        // Only redirect if:
        // 1. User is on a main holidu domain (if using current domain)
        // 2. OR user explicitly selected a main holidu domain
        let shouldRedirect = false;
        
        if (isUsingCurrentDomain) {
            // When using current domain, check the FINAL hostname (which comes from getHostname)
            // because getHostname already resolved currentHostname properly
            shouldRedirect = MAIN_HOLIDU_DOMAINS.includes(hostname);
            console.log('   Checking hostname in MAIN_HOLIDU_DOMAINS:', hostname, '→', shouldRedirect);
        } else {
            // Check if SELECTED domain is a main holidu domain
            shouldRedirect = MAIN_HOLIDU_DOMAINS.includes(hostname);
            console.log('   Checking selected hostname in MAIN_HOLIDU_DOMAINS:', hostname, '→', shouldRedirect);
        }
        
        if (shouldRedirect) {
            console.log('   ✅ Redirecting to urlaubspiraten.holidu.com');
            hostname = 'urlaubspiraten.holidu.com';
        } else {
            console.log('   ✅ Keeping original domain:', hostname);
        }
    }
    
    let host = "http://" + hostname;

    let selPage = document.querySelector("input[name=page]:checked").value;

    let checkinoutDates = null;
    if (checkin && checkout) checkinoutDates = "?checkin=" + checkin + "&checkout=" + checkout;

    // Use Europe for list page
    let locationSlug = 'Europe';
    
    // Format dates for list page (keep DD-MM-YYYY format as-is)
    let listPageDates = '';
    if (checkin && checkout) {
        // List page uses DD-MM-YYYY format (same as API provides)
        listPageDates = `?checkin=${checkin}&checkout=${checkout}&includeOfferIds=${propertyId}`;
        console.log('📅 List page with dates:', listPageDates);
    } else {
        console.log('📅 List page without dates (no availability found)');
        listPageDates = `?includeOfferIds=${propertyId}`;
    }

    if (selPage === 'list')
        openURL = host + "/s/" + locationSlug + listPageDates

    else if (selPage === 'checkout' && checkinoutDates)
        openURL = host + "/c/" + propertyId + checkinoutDates

    else if (selPage === 'checkout_new' && checkinoutDates)
        openURL = host + "/checkout/" + propertyId + checkinoutDates

    else if (selPage === 'details' && checkinoutDates)
        openURL = host + "/d/" + propertyId + checkinoutDates

    else if (selPage === 'list')
        openURL = host + "/s/" + locationSlug + "?includeOfferIds=" + propertyId

    else
        openURL = host + "/d/" + propertyId;

    chrome.tabs.create({ url: openURL });
}




//TODO: add it into getHostname => I get undefined because is async => could be also the default selection
// Get current domain
let currentHostname = null;
chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    currentHostname = new URL(tabs[0].url).hostname;
});

function getHostname(){
    
    let hostname = null;
    
    // Get user input and normalize it (handles domain names and IDs)
    const userInput = selDomain.value.trim();
    
    // Treat empty input as "current"
    const normalizedDomain = userInput === '' ? 'current' : normalizeDomainInput(userInput);

    console.log('📍 getHostname() called');
    console.log('   User input:', userInput === '' ? '(empty)' : userInput);
    console.log('   Normalized:', normalizedDomain);
    console.log('   Current tab hostname:', currentHostname);

    // Identify domain selected or use current
    if (normalizedDomain === 'current') {
        if (currentHostname) {
            // Check if current domain is localhost or a dev environment
            const isLocalhost = currentHostname.includes('localhost') || currentHostname.includes('127.0.0.1');
            const hostnameWithoutWww = currentHostname.replace(/^www\./, '');
            
            // Check if it's a valid Holidu domain
            const isValidDomain = currentHostname.includes('holidu') || 
                                  currentHostname.includes('bookiply') ||
                                  currentHostname.includes('holiduhost') ||
                                  Object.values(DOMAIN_MAP || {}).includes(currentHostname) ||
                                  Object.values(DOMAIN_MAP || {}).includes(hostnameWithoutWww);
            
            console.log('   Hostname without www:', hostnameWithoutWww);
            console.log('   Is localhost/dev?', isLocalhost);
            console.log('   Is valid Holidu domain?', isValidDomain);
            
            // Preserve localhost and dev environments, or valid Holidu domains
            if (isLocalhost || isValidDomain) {
                hostname = currentHostname;
                console.log('   → Using current hostname:', hostname);
            } else {
                // Only fallback to holidu.de for completely unknown/external domains
                hostname = 'www.holidu.de';
                console.log('   → Unknown domain, fallback to:', hostname);
            }
        } else {
            hostname = 'www.holidu.de';
            console.log('   → No currentHostname, fallback to:', hostname);
        }
    } else {
        hostname = normalizedDomain;
        console.log('   → Using normalized domain:', hostname);
    }

    return hostname;
}

// Initialize toggle buttons for positive/negative flags
document.addEventListener('DOMContentLoaded', function() {
    // Scroll to top on load
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    
    const flagButtons = document.querySelectorAll('.flag-toggle');
    
    flagButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const currentState = this.dataset.state;
            
            if (currentState === 'positive') {
                // Switch to negative
                this.dataset.state = 'negative';
                this.classList.remove('positive');
                this.classList.add('negative');
            } else {
                // Switch to positive
                this.dataset.state = 'positive';
                this.classList.remove('negative');
                this.classList.add('positive');
            }
        });
    });
});