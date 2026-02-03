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
    const responses = await Promise.all([
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
                value: 'expert'
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
                value: 'not_found'
              }
            }
          }
        })),
      // 7. Get all quiz data details (all dimensions at once)
      (console.log('   📊 Calling runReport for all quiz details...'),
        client.runReport({
          property: `properties/${propertyId}`,
          dateRanges: [{ startDate, endDate }],
          dimensions: [
            { name: 'customEvent:quiz_relation_selected' },
            { name: 'customEvent:quiz_occasion_selected' },
            { name: 'customEvent:quiz_budget_selected' },
            { name: 'customEvent:quiz_emotion_selected' },
            { name: 'customEvent:quiz_personality_selected' }
          ],
          metrics: [{ name: 'eventCount' }],
          dimensionFilter: {
            filter: {
              fieldName: 'eventName',
              stringFilter: { matchType: 'EXACT', value: 'quiz_submission' }
            }
          }
        })),
      // 8. Get top search terms
      (console.log('   🔍 Calling runReport for search terms...'),
        client.runReport({
          property: `properties/${propertyId}`,
          dateRanges: [{ startDate, endDate }],
          dimensions: [{ name: 'customEvent:search_term' }],
          metrics: [{ name: 'eventCount' }],
          dimensionFilter: {
            filter: {
              fieldName: 'eventName',
              stringFilter: { matchType: 'EXACT', value: 'search' }
            }
          },
          orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }],
          limit: 15
        })),
      // 9. Get sign_up events
      (console.log('   📝 Calling runReport for signups...'),
        client.runReport({
          property: `properties/${propertyId}`,
          dateRanges: [{ startDate, endDate }],
          dimensions: [{ name: 'eventName' }],
          metrics: [{ name: 'eventCount' }],
          dimensionFilter: {
            filter: {
              fieldName: 'eventName',
              stringFilter: { matchType: 'EXACT', value: 'sign_up' }
            }
          }
        })),
      // 10. Get wishlist events
      (console.log('   💜 Calling runReport for wishlist...'),
        client.runReport({
          property: `properties/${propertyId}`,
          dateRanges: [{ startDate, endDate }],
          dimensions: [{ name: 'eventName' }],
          metrics: [{ name: 'eventCount' }],
          dimensionFilter: {
            filter: {
              fieldName: 'eventName',
              stringFilter: { matchType: 'CONTAINS', value: 'wishlist' }
            }
          }
        })),
      // 15. Get cart events
      (console.log('   🛒 Calling runReport for cart...'),
        client.runReport({
          property: `properties/${propertyId}`,
          dateRanges: [{ startDate, endDate }],
          dimensions: [{ name: 'eventName' }],
          metrics: [{ name: 'eventCount' }],
          dimensionFilter: {
            filter: {
              fieldName: 'eventName',
              stringFilter: { matchType: 'CONTAINS', value: 'cart' }
            }
          }
        }))
    ]);

    // 2. NOW LOG THE RAW DATA
    // console.log("--- RAW GA4 RESPONSE START ---");
    // console.dir(responses, { depth: null, colors: true });
    // console.log("--- RAW GA4 RESPONSE END ---");

    const [
      overallRes, pageViewsRes, quizEventsRes, expertEventsRes,
      externalClicksRes, errorEventsRes, quizDetailsRes,
      searchTermsRes, signUpRes, wishlistRes, cartRes
    ] = responses;

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

    // Helper to extract specific dimension data from multi-dimensional rows
    const getDimData = (res, index) => {
      const rows = res?.[0]?.rows || [];
      return rows
        .map(row => ({
          dimensions: [row.dimensionValues?.[index]?.value],
          metrics: [row.metricValues?.[0]?.value]
        }))
        .filter(item => item.dimensions[0] && item.dimensions[0] !== '(not set)');
    };

    // Helper to filter out (not set) values
    const filterNotSet = (rows) => {
      return rows.filter(row => row.dimensions[0] && row.dimensions[0] !== '(not set)');
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
      quizDetails: {
        relations: getDimData(quizDetailsRes, 0),
        occasions: getDimData(quizDetailsRes, 1),
        budgets: getDimData(quizDetailsRes, 2),
        emotions: getDimData(quizDetailsRes, 3),
        personalities: getDimData(quizDetailsRes, 4)
      },
      searchTerms: filterNotSet(formatRows(searchTermsRes)),
      signUps: formatRows(signUpRes),
      wishlist: formatRows(wishlistRes),
      cart: formatRows(cartRes)
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
