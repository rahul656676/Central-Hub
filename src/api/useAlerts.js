import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config/apiBase';

export function useAlerts(siteId = null) {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        let url = API_BASE_URL + '/alerts/';
        if (siteId && siteId !== 'All Locations') {
          // Mock mapping site names to IDs for now
          const mappedSiteId = siteId.includes('Lugoba') ? 'site_lugoba' : 'site_other';
          url += '?site_id=' + mappedSiteId;
        }
        
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setAlerts(data);
        }
      } catch (err) {
        console.error("Failed to fetch alerts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
    // Poll every 5 seconds for live updates
    const interval = setInterval(fetchAlerts, 5000);
    return () => clearInterval(interval);
  }, [siteId]);

  return { alerts, loading };
}
