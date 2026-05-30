import {
    IoSearchOutline,
    IoEllipsisVertical,
    IoAddOutline,
} from 'react-icons/io5'

import {
    MdOutlineMonitorHeart,
} from 'react-icons/md'

function MedicalRecordsPage() {

    const records = [
        {
            title: 'Blood Pressure',
            value: '120/80',
            unit: 'mmHg',
            subtitle: 'Sys / Dia',
            status: 'Normal',
            date: 'Last Apr 10, 2026',
            color: 'blue',
        },
        {
            title: 'Cholesterol',
            value: '180',
            unit: 'mg/dL',
            subtitle: 'Cholesterol',
            status: 'Normal',
            date: 'Last Apr 8, 2026',
            color: 'orange',
        },
        {
            title: 'Blood Sugar',
            value: '95',
            unit: 'mg/dL',
            subtitle: 'Blood Sugar',
            status: 'Normal',
            date: 'Last Apr 8, 2026',
            color: 'red',
        },
        {
            title: 'BMI',
            value: '24.8',
            unit: '',
            subtitle: 'BMI',
            status: 'Normal',
            date: 'Last Apr 10, 2026',
            color: 'blue',
        },
    ]

    const history = [
        {
            date: 'May 10, 2026',
            pressure: '120/80',
            cholesterol: 180,
            sugar: 95,
            bmi: 24.8,
            sleep: 7,
            stress: 'Moderate',
            activity: 45,
            status: 'Normal',
        },
        {
            date: 'May 9, 2026',
            pressure: '130/90',
            cholesterol: 195,
            sugar: 105,
            bmi: 25.1,
            sleep: 6,
            stress: 'High',
            activity: 30,
            status: 'Overweight',
        },
        {
            date: 'May 8, 2026',
            pressure: '120/80',
            cholesterol: 180,
            sugar: 95,
            bmi: 24.6,
            sleep: 6.5,
            stress: 'Moderate',
            activity: 35,
            status: 'Normal',
        },
    ]

    return (
        <div className="min-h-screen bg-[#E5E7EB] p-6">

            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">

                <div>
                    <h1 className="text-3xl font-bold text-[#0F172A]">
                        Medical Records
                    </h1>

                    <p className="text-[#64748B] mt-1">
                        Monitor your health history and PTM risk indicators
                    </p>
                </div>

                <button className="bg-[#3B82F6] hover:bg-blue-600 text-white font-medium px-5 py-3 rounded-xl transition-colors flex items-center gap-2 w-fit">

                    <IoAddOutline size={18} />

                    Add Health Data

                </button>

            </div>

            {/* Search */}
            <div className="bg-white rounded-xl border border-gray-300 px-4 py-3 flex items-center gap-3 mb-6 max-w-md">

                <IoSearchOutline
                    size={18}
                    className="text-[#64748B]"
                />

                <input
                    type="text"
                    placeholder="Search records"
                    className="bg-transparent outline-none w-full text-sm text-[#0F172A] placeholder-[#64748B]"
                />

            </div>

            {/* Health Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

                {records.map((item, index) => (

                    <div
                        key={index}
                        className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6"
                    >

                        {/* Top */}
                        <div className="flex items-start justify-between mb-6">

                            <div className="flex items-center gap-3">

                                <div
                                    className={`
                                        p-3 rounded-xl
                                        ${item.color === 'blue' && 'bg-blue-100'}
                                        ${item.color === 'orange' && 'bg-orange-100'}
                                        ${item.color === 'red' && 'bg-red-100'}
                                    `}
                                >

                                    <MdOutlineMonitorHeart
                                        size={24}
                                        className={`
                                            ${item.color === 'blue' && 'text-[#3B82F6]'}
                                            ${item.color === 'orange' && 'text-orange-500'}
                                            ${item.color === 'red' && 'text-red-500'}
                                        `}
                                    />

                                </div>

                                <div>

                                    <h2 className="text-lg font-semibold text-[#0F172A]">
                                        {item.title}
                                    </h2>

                                    <p className="text-sm text-[#64748B] mt-1">
                                        {item.date}
                                    </p>

                                </div>

                            </div>

                            <button className="text-[#64748B] hover:text-[#0F172A] transition-colors">

                                <IoEllipsisVertical size={18} />

                            </button>

                        </div>

                        {/* Value */}
                        <div className="flex items-end gap-2">

                            <h3 className="text-4xl font-bold text-[#0F172A]">
                                {item.value}
                            </h3>

                            <span className="text-[#64748B] mb-1">
                                {item.unit}
                            </span>

                        </div>

                        <p className="text-sm text-[#64748B] mt-2">
                            {item.subtitle}
                        </p>

                        {/* Bottom */}
                        <div className="flex items-center justify-between mt-6">

                            <span className="bg-green-50 text-[#10B981] border border-green-200 px-4 py-1.5 rounded-full text-xs font-medium">
                                {item.status}
                            </span>

                            <button className="text-[#3B82F6] text-sm font-medium hover:text-blue-600 transition-colors">
                                View History →
                            </button>

                        </div>

                    </div>

                ))}

            </div>

            {/* History Table */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">

                <div className="flex items-center justify-between mb-6">

                    <div>
                        <h2 className="text-lg font-semibold text-[#0F172A]">
                            Recent Health Data
                        </h2>

                        <p className="text-sm text-[#64748B] mt-1">
                            Minimum 3-day history for AI risk analysis
                        </p>
                    </div>

                </div>

                {/* Table */}
                <div className="overflow-x-auto">

                    <table className="w-full">

                        <thead>
                            <tr className="border-b border-gray-200">

                                <th className="text-left py-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                                    Date
                                </th>

                                <th className="text-left py-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                                    Blood Pressure
                                </th>

                                <th className="text-left py-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                                    Cholesterol
                                </th>

                                <th className="text-left py-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                                    Blood Sugar
                                </th>

                                <th className="text-left py-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                                    BMI
                                </th>

                                <th className="text-left py-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                                    Sleep
                                </th>

                                <th className="text-left py-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                                    Stress
                                </th>

                                <th className="text-left py-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                                    Activity
                                </th>

                                <th className="text-left py-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                                    Status
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {history.map((item, index) => (

                                <tr
                                    key={index}
                                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                                >

                                    <td className="py-4 text-sm text-[#0F172A]">
                                        {item.date}
                                    </td>

                                    <td className="py-4 text-sm text-[#0F172A]">
                                        {item.pressure}
                                    </td>

                                    <td className="py-4 text-sm text-[#0F172A]">
                                        {item.cholesterol}
                                    </td>

                                    <td className="py-4 text-sm text-[#0F172A]">
                                        {item.sugar}
                                    </td>

                                    <td className="py-4 text-sm text-[#0F172A]">
                                        {item.bmi}
                                    </td>

                                    <td className="py-4 text-sm text-[#0F172A]">
                                        {item.sleep} hrs
                                    </td>

                                    <td className="py-4 text-sm text-[#0F172A]">
                                        {item.stress}
                                    </td>

                                    <td className="py-4 text-sm text-[#0F172A]">
                                        {item.activity} mins
                                    </td>

                                    <td className="py-4">

                                        <span
                                            className={`
                                                px-3 py-1 rounded-full text-xs font-medium border

                                                ${item.status === 'Normal'
                                                    ? 'bg-green-50 text-[#10B981] border-green-200'
                                                    : 'bg-orange-50 text-orange-500 border-orange-200'
                                                }
                                            `}
                                        >
                                            {item.status}
                                        </span>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    )
}

export default MedicalRecordsPage