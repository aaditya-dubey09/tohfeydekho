import React from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { Info } from 'lucide-react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const AnalyticsSection = ({ analytics }) => {
    if (!analytics) return null;

    const { ga4, productStats } = analytics;

    return (
        <div className="space-y-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-lg">
                    <p className="text-blue-100 text-sm font-bold uppercase tracking-widest">Total Products</p>
                    <p className="text-4xl font-black mt-2">{analytics.summary.totalProducts}</p>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-2xl shadow-lg">
                    <p className="text-green-100 text-sm font-bold uppercase tracking-widest">Quiz Submissions</p>
                    <p className="text-4xl font-black mt-2">{analytics.summary.totalQuizzes}</p>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-2xl shadow-lg">
                    <p className="text-purple-100 text-sm font-bold uppercase tracking-widest">Consultations</p>
                    <p className="text-4xl font-black mt-2">{analytics.summary.totalConsultations}</p>
                </div>
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-2xl shadow-lg">
                    <p className="text-orange-100 text-sm font-bold uppercase tracking-widest">Active Users (GA4)</p>
                    <p className="text-4xl font-black mt-2">
                        {ga4?.overall?.totals?.[0] && ga4.overall.totals[0] !== 'N/A' ? ga4.overall.totals[0] : 'N/A'}
                    </p>
                </div>
            </div>

            {/* GA4 Data Status */}
            {ga4?.error && (
                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-6">
                    <div className="flex items-start gap-3">
                        <Info className="text-yellow-600 flex-shrink-0 mt-1" />
                        <div>
                            <h4 className="font-bold text-yellow-900 mb-1">Google Analytics Not Configured</h4>
                            <p className="text-yellow-800 text-sm">{ga4.message}</p>
                            <p className="text-yellow-700 text-xs mt-2">
                                Please configure GA4_PROPERTY_ID and GA4_SERVICE_ACCOUNT_KEY_PATH in your environment variables.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Chart Section - GA4 Data */}
            {ga4 && !ga4.error && (
                <>
                    {/* Daily Activity Chart */}
                    {ga4.overall?.daily && ga4.overall.daily.length > 0 && (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <h3 className="font-bold text-xl mb-6">Daily Activity (Last 30 Days)</h3>
                            <div className="h-80">
                                <Line
                                    data={{
                                        labels: ga4.overall.daily.map(d => {
                                            const dateStr = d.dimensions[0];
                                            return dateStr.slice(4, 6) + '/' + dateStr.slice(6, 8);
                                        }),
                                        datasets: [
                                            {
                                                label: 'Active Users',
                                                data: ga4.overall.daily.map(d => d.metrics[0]),
                                                borderColor: 'rgb(59, 130, 246)',
                                                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                                                tension: 0.4
                                            },
                                            {
                                                label: 'Page Views',
                                                data: ga4.overall.daily.map(d => d.metrics[2]),
                                                borderColor: 'rgb(16, 185, 129)',
                                                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                                                tension: 0.4
                                            }
                                        ]
                                    }}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: { position: 'top' }
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Page Views by Page */}
                    {ga4.pageViews && ga4.pageViews.length > 0 && (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <h3 className="font-bold text-xl mb-6">Top Pages by Views</h3>
                            <div className="h-80">
                                <Bar
                                    data={{
                                        labels: ga4.pageViews.slice(0, 10).map(p => p.dimensions[0]),
                                        datasets: [
                                            {
                                                label: 'Page Views',
                                                data: ga4.pageViews.slice(0, 10).map(p => p.metrics[0]),
                                                backgroundColor: 'rgba(59, 130, 246, 0.8)',
                                            }
                                        ]
                                    }}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        indexAxis: 'y',
                                        plugins: {
                                            legend: { display: false }
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Event Distribution */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Quiz Events */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <h3 className="font-bold text-lg mb-4">Quiz Events</h3>
                            {ga4.quizEvents && ga4.quizEvents.length > 0 ? (
                                <div className="space-y-3">
                                    {ga4.quizEvents.map((event, idx) => (
                                        <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                            <span className="text-sm font-medium">{event.dimensions[0]}</span>
                                            <span className="font-bold text-blue-600">{event.metrics[0]}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-4 bg-blue-50 rounded-lg text-center">
                                    <p className="text-sm text-blue-600 font-medium">No quiz events yet</p>
                                    <p className="text-xs text-blue-500 mt-1">Quiz tracking is active, waiting for first submission</p>
                                </div>
                            )}
                        </div>

                        {/* Expert Consultation Events */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <h3 className="font-bold text-lg mb-4">Expert Consultation Events</h3>
                            {ga4.expertEvents && ga4.expertEvents.length > 0 ? (
                                <div className="space-y-3">
                                    {ga4.expertEvents.map((event, idx) => (
                                        <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                            <span className="text-sm font-medium">{event.dimensions[0]}</span>
                                            <span className="font-bold text-purple-600">{event.metrics[0]}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-4 bg-purple-50 rounded-lg text-center">
                                    <p className="text-sm text-purple-600 font-medium">No expert events yet</p>
                                    <p className="text-xs text-purple-500 mt-1">Expert tracking is active, waiting for first interaction</p>
                                </div>
                            )}
                        </div>

                        {/* External Clicks */}
                        {ga4.externalClicks && ga4.externalClicks.length > 0 && (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                                <h3 className="font-bold text-lg mb-4">External Link Clicks</h3>
                                <div className="space-y-3">
                                    {ga4.externalClicks.map((event, idx) => (
                                        <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                            <span className="text-sm font-medium">{event.dimensions[0]}</span>
                                            <span className="font-bold text-green-600">{event.metrics[0]}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Error Events */}
                        {ga4.errorEvents && ga4.errorEvents.length > 0 && (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                                <h3 className="font-bold text-lg mb-4">Error Events</h3>
                                <div className="space-y-3">
                                    {ga4.errorEvents.map((event, idx) => (
                                        <div key={idx} className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                                            <span className="text-sm font-medium text-red-800">{event.dimensions[0]}</span>
                                            <span className="font-bold text-red-600">{event.metrics[0]}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Quiz Details */}
                    {ga4.quizDetails && ga4.quizDetails.length > 0 && (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <h3 className="font-bold text-lg mb-4">Quiz Details (Relations & Occasions)</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {ga4.quizDetails.map((detail, idx) => {
                                    const displayValue = (val) => val === '(not set)' ? 'General Activity' : val;
                                    const dimensionText = displayValue(detail.dimensions[0]) || displayValue(detail.dimensions[1]) || 'Unknown';
                                    return (
                                        <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                            <span className="text-sm font-medium">{dimensionText}</span>
                                            <span className="font-bold text-indigo-600">{detail.metrics[0]}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Product Stats Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 border-b">
                    <h3 className="font-bold text-lg">Top Products</h3>
                </div>
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-4 font-bold text-sm">Product Name</th>
                            <th className="px-6 py-4 font-bold text-sm">Views</th>
                            <th className="px-6 py-4 font-bold text-sm">Wishlists</th>
                            <th className="px-6 py-4 font-bold text-sm">Carts</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {productStats && productStats.map((stat, idx) => (
                            <tr key={idx} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium">{stat.name}</td>
                                <td className="px-6 py-4 text-gray-600">{stat.views || 0}</td>
                                <td className="px-6 py-4 text-gray-600">{stat.wishlist_count || 0}</td>
                                <td className="px-6 py-4 text-gray-600">{stat.cart_count || 0}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AnalyticsSection;
