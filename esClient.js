// Minimal ES client using Kibana proxy. Requires VPN.
const KIBANA_PROXY = "https://kibana-search-8.holidu.cloud/api/console/proxy?path=";
const ES_TIMEOUT_MS = 5000; // 5 second timeout

// Global flag to track if ES is down (to avoid repeated timeout attempts)
let esIsDown = false;
let esDownCheckTime = 0;
const ES_DOWN_CACHE_MS = 60000; // Cache "ES is down" status for 1 minute

async function esSearchInternal(index, body) {
  // Check if ES is marked as down recently (within cache period)
  const now = Date.now();
  if (esIsDown && (now - esDownCheckTime) < ES_DOWN_CACHE_MS) {
    console.log('⚠️ ES is marked as down, skipping request (cached for', Math.round((ES_DOWN_CACHE_MS - (now - esDownCheckTime)) / 1000), 'more seconds)');
    return { ids: [], hits: [], error: 'ES is down (cached)', esDown: true };
  }
  
  const url = `${KIBANA_PROXY}${encodeURIComponent(index)}/_search&method=POST`;
  
  // Create abort controller for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), ES_TIMEOUT_MS);
  
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "kbn-xsrf": "true",
      },
      body: JSON.stringify(body),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!res.ok) {
      return { ids: [], hits: [], error: `${res.status} ${res.statusText}` };
    }
    const data = await res.json();
    const hits = data?.hits?.hits || [];
    const ids = hits.map((h) => h?._source?.id).filter((x) => x != null);
    
    // ES is working - clear down flag
    esIsDown = false;
    
    // Log first hit for debugging
    if (hits.length > 0) {
      console.log("Sample ES hit:", JSON.stringify(hits[0]._source, null, 2));
    }
    
    return { ids, hits };
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      // Mark ES as down for caching
      esIsDown = true;
      esDownCheckTime = Date.now();
      console.log('🚫 ES timeout detected - marking as down for', ES_DOWN_CACHE_MS / 1000, 'seconds');
      return { ids: [], hits: [], error: 'ES request timeout - VPN might be off or ES is down', esDown: true };
    }
    // Check for CORS errors specifically
    if (error.message && error.message.includes('CORS')) {
      console.error('🚫 CORS error accessing ES8:', error.message);
      console.error('💡 Make sure you are connected to Holidu VPN');
      console.error('💡 ES8 endpoint might need different configuration');
      return { ids: [], hits: [], error: 'CORS error - VPN might be off or ES8 endpoint not accessible', esDown: true, corsError: true };
    }
    throw error;
  }
}

// Expose globally for browser usage
window.esSearch = async function (index, body) {
  try {
    return await esSearchInternal(index, body);
  } catch (e) {
    // Better error handling for CORS and network errors
    const errorMsg = e?.message || "esSearch failed";
    if (errorMsg.includes('CORS') || errorMsg.includes('Failed to fetch')) {
      console.error('🚫 ES8 access error:', errorMsg);
      console.error('💡 Check VPN connection and ES8 endpoint accessibility');
      return { ids: [], hits: [], error: `ES8 access failed: ${errorMsg} - Check VPN connection`, esDown: true, corsError: true };
    }
    return { ids: [], hits: [], error: errorMsg };
  }
};


