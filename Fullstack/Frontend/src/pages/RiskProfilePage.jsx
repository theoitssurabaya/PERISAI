import {
    IoHeartOutline,
    IoMoonOutline,
    IoWalkOutline,
    IoWarningOutline,
} from 'react-icons/io5'

function RiskProfilePage() {

    const riskFactors = [
        {
            title: 'Heart Risk',
            percent: 65,
            status: 'Medium',
            color: 'orange',
            icon: <IoHeartOutline size={20} />,
        },
        {
            title: 'Stress Risk',
            percent: 30,
            status: 'Low',
            color: 'green',
            icon: <IoWarningOutline size={20} />,
        },
        {
            title: 'Sleep Risk',
            percent: 60,
            status: 'Medium',
            color: 'orange',
            icon: <IoMoonOutline size={20} />,
        },
        {
            title: 'Lifestyle Risk',
            percent: 35,
            status: 'Low',
            color: 'green',
            icon: <IoWalkOutline size={20} />,
        },
    ]

    const recommendations = [
        {
            title: 'Improve Sleep Quality',
            desc: 'Try to sleep at least 7-8 hours every night.',
        },
        {
            title: 'Manage Stress',
            desc: 'Take a few minutes daily for meditation or deep breathing.',
        },
        {
            title: 'Stay Active',
            desc: 'Keep up your daily activity and aim for 10K steps.',
        },
        {
            title: 'Eat Balanced Meals',
            desc: 'Maintain a healthy diet with more whole foods.',
        },
    ]

    return (
        <div className="min-h-screen bg-[#E5E7EB] p-6">

            {/* Header */}
            <div className="mb-6">

                <h1 className="text-3xl font-bold text-[#0F172A]">
                    Risk Profile
                </h1>

                <p className="text-[#64748B] mt-1">
                    Your AI-generated health analysis
                </p>

            </div>

            {/* Top Section */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">

                {/* Risk Overview */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">

                    <h2 className="text-lg font-semibold text-[#0F172A] mb-6">
                        Risk Overview
                    </h2>

                    <div className="flex flex-col md:flex-row md:items-center gap-8">

                        {/* Circle */}
                        <div className="relative w-48 h-48 flex items-center justify-center">

                            <div className="absolute inset-0 rounded-full border-[14px] border-gray-200"></div>

                            <div className="absolute inset-0 rounded-full border-[14px] border-orange-400 border-t-transparent border-l-transparent rotate-[135deg]"></div>

                            <div className="text-center">

                                <h3 className="text-5xl font-bold text-[#0F172A]">
                                    67%
                                </h3>

                                <p className="text-orange-400 font-medium mt-2">
                                    Moderate Risk
                                </p>

                            </div>

                        </div>

                        {/* Description */}
                        <div className="flex-1">

                            <p className="text-[#64748B] leading-relaxed">

                                Your overall health risk is
                                <span className="text-orange-400 font-medium">
                                    {' '}Moderate
                                </span>.
                                Keep maintaining a healthy lifestyle to reduce
                                potential risks.

                            </p>

                            <div className="bg-blue-50 rounded-xl p-4 mt-6">

                                <p className="text-sm text-[#64748B]">
                                    This score is generated based on your habits,
                                    medical data, sleep quality, stress level,
                                    and physical activity.
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

                {/* Risk Factors */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">

                    <h2 className="text-lg font-semibold text-[#0F172A] mb-6">
                        Risk Factors
                    </h2>

                    <div className="space-y-6">

                        {riskFactors.map((item, index) => (

                            <div key={index}>

                                <div className="flex items-center justify-between mb-2">

                                    <div className="flex items-center gap-3">

                                        <div className={`
                                            p-2 rounded-lg

                                            ${item.color === 'orange'
                                                ? 'bg-orange-100 text-orange-500'
                                                : 'bg-green-100 text-[#10B981]'
                                            }
                                        `}>

                                            {item.icon}

                                        </div>

                                        <p className="text-sm font-medium text-[#0F172A]">
                                            {item.title}
                                        </p>

                                    </div>

                                    <div className="flex items-center gap-3">

                                        <span className={`
                                            px-3 py-1 rounded-full text-xs font-medium border

                                            ${item.color === 'orange'
                                                ? 'bg-orange-50 text-orange-500 border-orange-200'
                                                : 'bg-green-50 text-[#10B981] border-green-200'
                                            }
                                        `}>
                                            {item.status}
                                        </span>

                                        <span className="text-sm text-[#64748B]">
                                            {item.percent}%
                                        </span>

                                    </div>

                                </div>

                                {/* Progress */}
                                <div className="w-full bg-gray-200 rounded-full h-2">

                                    <div
                                        className={`
                                            h-2 rounded-full

                                            ${item.color === 'orange'
                                                ? 'bg-orange-400'
                                                : 'bg-[#10B981]'
                                            }
                                        `}
                                        style={{ width: `${item.percent}%` }}
                                    ></div>

                                </div>

                            </div>

                        ))}

                    </div>

                </div>

            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">

                {/* Trend */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">

                    <div className="flex items-center justify-between mb-6">

                        <div>

                            <h2 className="text-lg font-semibold text-[#0F172A]">
                                Risk Score Trend
                            </h2>

                            <p className="text-sm text-[#64748B] mt-1">
                                Daily PTM risk trend based on health history and habits
                            </p>

                        </div>

                        <button className="bg-gray-100 hover:bg-gray-200 text-sm px-4 py-2 rounded-xl transition-colors">
                            7 Days
                        </button>

                    </div>

                    {/* Chart */}
                    <div className="flex items-end justify-between gap-4 h-52 mt-10">

                        {/* Monday */}
                        <div className="flex flex-col items-center gap-3 w-full h-full justify-end">

                            <div
                                className="bg-blue-200 rounded-t-xl w-full"
                                style={{ height: '55%' }}
                            />

                            <span className="text-xs text-[#64748B]">
                                Mon 52%
                            </span>

                        </div>

                        {/* Tuesday */}
                        <div className="flex flex-col items-center gap-3 w-full h-full justify-end">

                            <div
                                className="bg-blue-300 rounded-t-xl w-full"
                                style={{ height: '65%' }}
                            />

                            <span className="text-xs text-[#64748B]">
                                Tue 65%
                            </span>

                        </div>

                        {/* Wednesday */}
                        <div className="flex flex-col items-center gap-3 w-full h-full justify-end">

                            <div
                                className="bg-blue-400 rounded-t-xl w-full"
                                style={{ height: '70%' }}
                            />

                            <span className="text-xs text-[#64748B]">
                                Wed 70%
                            </span>

                        </div>

                        {/* Thursday */}
                        <div className="flex flex-col items-center gap-3 w-full h-full justify-end">

                            <div
                                className="bg-blue-500 rounded-t-xl w-full"
                                style={{ height: '60%' }}
                            />

                            <span className="text-xs text-[#64748B]">
                                Thu 60%
                            </span>

                        </div>

                        {/* Friday */}
                        <div className="flex flex-col items-center gap-3 w-full h-full justify-end">

                            <div
                                className="bg-blue-600 rounded-t-xl w-full"
                                style={{ height: '67%' }}
                            />

                            <span className="text-xs text-[#64748B]">
                                Fri 67%
                            </span>

                        </div>

                    </div>

                </div>

                {/* AI Recommendations */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">

                    <h2 className="text-lg font-semibold text-[#0F172A] mb-2">
                        AI Recommendations
                    </h2>

                    <p className="text-sm text-[#64748B] mb-6">
                        Suggestions to help improve your health.
                    </p>

                    <div className="space-y-4">

                        {recommendations.map((item, index) => (

                            <div
                                key={index}
                                className="bg-gray-50 hover:bg-gray-100 transition-colors rounded-xl p-4 flex items-start justify-between gap-4"
                            >

                                <div>

                                    <h3 className="text-sm font-semibold text-[#0F172A]">
                                        {item.title}
                                    </h3>

                                    <p className="text-sm text-[#64748B] mt-1">
                                        {item.desc}
                                    </p>

                                </div>

                                <span className="text-[#64748B]">
                                    →
                                </span>

                            </div>

                        ))}

                    </div>

                </div>

            </div>

            {/* Consistency Card */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl border border-blue-100 shadow-sm p-6">

                <div className="flex items-center gap-4">

                    <div className="bg-white p-4 rounded-2xl">

                        <IoHeartOutline
                            size={28}
                            className="text-[#3B82F6]"
                        />

                    </div>

                    <div>

                        <h2 className="text-lg font-semibold text-[#0F172A]">
                            Stay Consistent!
                        </h2>

                        <p className="text-sm text-[#64748B] mt-1">
                            Small healthy habits today can reduce future PTM risks.
                        </p>

                    </div>

                </div>

            </div>

        </div>
    )
}

export default RiskProfilePage