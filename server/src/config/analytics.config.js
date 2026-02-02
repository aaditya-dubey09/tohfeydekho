import { BetaAnalyticsDataClient } from '@google-analytics/data';

let analyticsDataClient = null;

// Initialize the GA4 client
const initializeGA4Client = () => {
  if (analyticsDataClient) return analyticsDataClient;

  try {
    const clientEmail = process.env.GA4_CLIENT_EMAIL;
    const privateKey = process.env.GA4_PRIVATE_KEY.replace(/\\n/g, '\n');
    const projectId = process.env.GA4_PROJECT_ID;
    const clientId = process.env.GA4_CLIENT_ID;

    if (!clientEmail || !privateKey || !projectId) {
      console.warn('GA4_CLIENT_EMAIL, GA4_PRIVATE_KEY, or GA4_PROJECT_ID not set. Analytics data will not be available.');
      return null;
    }

    analyticsDataClient = new BetaAnalyticsDataClient({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey,
      },
      project_id: projectId,
    });

    console.log('✅ Google Analytics Data API client initialized');
    return analyticsDataClient;
  } catch (error) {
    console.error('❌ Failed to initialize GA4 client:', error.message);
    return null;
  }
};

// Fetch GA4 data
export const fetchGA4Data = async (startDate = '30daysAgo', endDate = 'today') => {
  const client = initializeGA4Client();

  if (!client) {
    return {
      error: 'GA4 client not initialized',
      message: 'Please configure GA4_CLIENT_EMAIL, GA4_PRIVATE_KEY, and GA4_PROPERTY_ID'
    };
  }

  const propertyId = process.env.GA4_PROPERTY_ID;

  if (!propertyId) {
    return {
      error: 'GA4_PROPERTY_ID not set',
      message: 'Please set GA4_PROPERTY_ID in environment variables'
    };
  }

  try {
    const [
      overallRes,
      pageViewsRes,
      quizEventsRes,
      expertEventsRes,
      externalClicksRes,
      errorEventsRes,
      quizDetailsRes
    ] = await Promise.all([
      // 1. Get overall metrics
      client.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: 'date' }],
        metrics: [
          { name: 'activeUsers' },
          { name: 'sessions' },
          { name: 'screenPageViews' },
          { name: 'eventCount' }
        ]
      }),
      // 2. Get page views by page
      client.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: 'pagePath' }],
        metrics: [
          { name: 'screenPageViews' },
          { name: 'activeUsers' }
        ],
        orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
        limit: 10
      }),
      // 3. Get custom events (quiz, expert consultation, external clicks)
      client.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: 'eventName' }],
        metrics: [{ name: 'eventCount' }],
        dimensionFilter: {
          filter: {
            fieldName: 'eventName',
            stringFilter: {
              matchType: 'CONTAINS',
              value: 'quiz'
            }
          }
        }
      }),
      // 4. Get expert consultation events
      (console.log('   👨‍💼 Calling runReport for expert events...'),
        client.runReport({
          property: `properties/${propertyId}`,
          dateRanges: [{ startDate, endDate }],
          dimensions: [{ name: 'eventName' }],
          metrics: [{ name: 'eventCount' }],
          dimensionFilter: {
            filter: {
              fieldName: 'eventName',
              stringFilter: {
                matchType: 'CONTAINS',
                value: 'Expert'
              }
            }
          }
        })),
      // 5. Get external click events (retailer tracking)
      (console.log('   🔗 Calling runReport for external clicks...'),
        client.runReport({
          property: `properties/${propertyId}`,
          dateRanges: [{ startDate, endDate }],
          dimensions: [{ name: 'eventName' }],
          metrics: [{ name: 'eventCount' }],
          dimensionFilter: {
            filter: {
              fieldName: 'eventName',
              stringFilter: {
                matchType: 'CONTAINS',
                value: 'external'
              }
            }
          }
        })),
      // 6. Get error events (404, errors)
      (console.log('   ⚠️ Calling runReport for error events...'),
        client.runReport({
          property: `properties/${propertyId}`,
          dateRanges: [{ startDate, endDate }],
          dimensions: [{ name: 'eventName' }],
          metrics: [{ name: 'eventCount' }],
          dimensionFilter: {
            filter: {
              fieldName: 'eventName',
              stringFilter: {
                matchType: 'CONTAINS',
                value: 'error'
              }
            }
          }
        })),
      // 7. Get quiz data details (occasion, relation, etc.)
      (console.log('   📊 Calling runReport for quiz details...'),
        client.runReport({
          property: `properties/${propertyId}`,
          dateRanges: [{ startDate, endDate }],
          dimensions: [
            { name: 'customEvent:quiz_relation_selected' },
            { name: 'customEvent:quiz_occasion_selected' }
          ],
          metrics: [{ name: 'eventCount' }],
          limit: 20
        }))
    ]);

    // Format the data helper
    const formatRows = (res) => {
      // res[0] is the actual response from Google Analytics
      const rows = res?.[0]?.rows;
      if (!rows) return [];
      return rows.map(row => ({
        dimensions: row.dimensionValues?.map(d => d.value) || [],
        metrics: row.metricValues?.map(m => m.value) || []
      }));
    };

    const getTotals = (res) => {
      if (!res?.[0]?.rows || res[0].rows.length === 0) return ["0"];

      // Initialize an array to store sums for each metric
      const numMetrics = res[0].metricHeaders.length;
      const sums = new Array(numMetrics).fill(0);

      // Sum each metric across all rows
      res[0].rows.forEach(row => {
        row.metricValues.forEach((metric, index) => {
          sums[index] += parseInt(metric.value || 0);
        });
      });

      return sums.map(s => s.toString());
    };

    return {
      overall: {
        daily: formatRows(overallRes),
        totals: getTotals(overallRes)
      },
      pageViews: formatRows(pageViewsRes),
      quizEvents: formatRows(quizEventsRes),
      expertEvents: formatRows(expertEventsRes),
      externalClicks: formatRows(externalClicksRes),
      errorEvents: formatRows(errorEventsRes),
      quizDetails: formatRows(quizDetailsRes)
    };
  } catch (error) {
    console.error('Error fetching GA4 data:', error);
    return {
      error: 'Failed to fetch GA4 data',
      message: error.message
    };
  }
};

// Fetch specific event data with labels
export const fetchEventDetails = async (eventName, startDate = '30daysAgo', endDate = 'today') => {
  const client = initializeGA4Client();

  if (!client) {
    return { error: 'GA4 client not initialized' };
  }

  const propertyId = process.env.GA4_PROPERTY_ID;

  try {
    const [response] = await client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate, endDate }],
      dimensions: [
        { name: 'eventName' },
        { name: 'customEvent:label' }
      ],
      metrics: [{ name: 'eventCount' }],
      dimensionFilter: {
        filter: {
          fieldName: 'eventName',
          stringFilter: {
            value: eventName
          }
        }
      }
    });

    return {
      events: response.rows?.map(row => ({
        eventName: row.dimensionValues?.[0]?.value,
        label: row.dimensionValues?.[1]?.value,
        count: row.metricValues?.[0]?.value
      })) || []
    };
  } catch (error) {
    console.error(`Error fetching ${eventName} details:`, error);
    return { error: error.message };
  }
};

export default { fetchGA4Data, fetchEventDetails };
