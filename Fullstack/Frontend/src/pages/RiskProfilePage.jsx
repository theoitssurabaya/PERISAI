import { useState } from 'react'
import {
    IoHeartOutline,
    IoMoonOutline,
    IoWalkOutline,
    IoWarningOutline,
    IoClipboardOutline,
    IoWaterOutline
} from 'react-icons/io5'
import { predictRisk } from '../services/api'

function RiskProfilePage() {
    const [hasPredicted, setHasPredicted] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [predictions, setPredictions] = useState(null)

    // Form state corresponding to 14 ML features
    const [formData, setFormData] = useState({
        Age: '7', // default 50-54
        Sex: '0', // Female
        Weight: '70',
        Height: '170',
        Smoker: '0',
        PhysActivity: '1',
        Fruits: '1',
        Veggies: '1',
        HvyAlcoholConsump: '0',
        DiffWalk: '0',
        Stroke: '0',
        HeartDiseaseorAttack: '0',
        CholCheck: '1',
        GenHlth: '3', // Good
        SleepHours: '7'
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        try {
            // Convert everything to numbers before sending
            const numericData = {}
            for (const key in formData) {
                if (key !== 'Weight' && key !== 'Height') {
                    numericData[key] = Number(formData[key])
                }
            }
            
            // Calculate BMI
            const weight = Number(formData.Weight)
            const heightM = Number(formData.Height) / 100
            const bmi = weight / (heightM * heightM)
            numericData['BMI'] = Number(bmi.toFixed(2))
            const result = await predictRisk(numericData)
            if (result.success) {
                setPredictions(result.predictions)
                setHasPredicted(true)
            } else {
                setError(result.message || 'Error occurred')
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Error connecting to AI service')
        } finally {
            setLoading(false)
        }
    }

    if (!hasPredicted) {
        return (
            <div className="min-h-screen bg-[#E5E7EB] p-6">
                <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm p-8 border border-gray-200">
                    <h1 className="text-3xl font-bold text-[#0F172A] mb-2">Health Risk Assessment</h1>
                    <p className="text-[#64748B] mb-8">Please fill in your current health parameters to generate an AI prediction for Non-Communicable Diseases (PTM).</p>
                    
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Demographic & General */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold text-[#3B82F6] border-b pb-2">Demographics</h2>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Age Group</label>
                                <select name="Age" value={formData.Age} onChange={handleChange} className="w-full border-gray-300 rounded-lg p-2.5 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 outline-none border">
                                    <option value="1">18 to 24</option>
                                    <option value="2">25 to 29</option>
                                    <option value="3">30 to 34</option>
                                    <option value="4">35 to 39</option>
                                    <option value="5">40 to 44</option>
                                    <option value="6">45 to 49</option>
                                    <option value="7">50 to 54</option>
                                    <option value="8">55 to 59</option>
                                    <option value="9">60 to 64</option>
                                    <option value="10">65 to 69</option>
                                    <option value="11">70 to 74</option>
                                    <option value="12">75 to 79</option>
                                    <option value="13">80 or older</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Sex</label>
                                <select name="Sex" value={formData.Sex} onChange={handleChange} className="w-full border-gray-300 rounded-lg p-2.5 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 outline-none border">
                                    <option value="0">Female</option>
                                    <option value="1">Male</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                                    <input type="number" step="1" name="Weight" value={formData.Weight} onChange={handleChange} required className="w-full border-gray-300 rounded-lg p-2.5 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 outline-none border" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
                                    <input type="number" step="1" name="Height" value={formData.Height} onChange={handleChange} required className="w-full border-gray-300 rounded-lg p-2.5 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 outline-none border" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">General Health</label>
                                <select name="GenHlth" value={formData.GenHlth} onChange={handleChange} className="w-full border-gray-300 rounded-lg p-2.5 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 outline-none border">
                                    <option value="1">Excellent</option>
                                    <option value="2">Very Good</option>
                                    <option value="3">Good</option>
                                    <option value="4">Fair</option>
                                    <option value="5">Poor</option>
                                </select>
                            </div>
                        </div>

                        {/* Lifestyle & History */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold text-[#3B82F6] border-b pb-2">Lifestyle & Medical History</h2>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Smoker</label>
                                    <select name="Smoker" value={formData.Smoker} onChange={handleChange} className="w-full border-gray-300 rounded-lg p-2.5 bg-gray-50 focus:ring-blue-500 outline-none border">
                                        <option value="0">No</option>
                                        <option value="1">Yes</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Heavy Alcohol</label>
                                    <select name="HvyAlcoholConsump" value={formData.HvyAlcoholConsump} onChange={handleChange} className="w-full border-gray-300 rounded-lg p-2.5 bg-gray-50 focus:ring-blue-500 outline-none border">
                                        <option value="0">No</option>
                                        <option value="1">Yes</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phys. Activity</label>
                                    <select name="PhysActivity" value={formData.PhysActivity} onChange={handleChange} className="w-full border-gray-300 rounded-lg p-2.5 bg-gray-50 focus:ring-blue-500 outline-none border">
                                        <option value="0">No</option>
                                        <option value="1">Yes</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Sleep Hours</label>
                                    <input type="number" step="0.5" name="SleepHours" value={formData.SleepHours} onChange={handleChange} required className="w-full border-gray-300 rounded-lg p-2.5 bg-gray-50 focus:ring-blue-500 outline-none border" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Eat Fruits</label>
                                    <select name="Fruits" value={formData.Fruits} onChange={handleChange} className="w-full border-gray-300 rounded-lg p-2.5 bg-gray-50 focus:ring-blue-500 outline-none border">
                                        <option value="0">No</option>
                                        <option value="1">Yes</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Eat Veggies</label>
                                    <select name="Veggies" value={formData.Veggies} onChange={handleChange} className="w-full border-gray-300 rounded-lg p-2.5 bg-gray-50 focus:ring-blue-500 outline-none border">
                                        <option value="0">No</option>
                                        <option value="1">Yes</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 pt-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty Walking</label>
                                    <select name="DiffWalk" value={formData.DiffWalk} onChange={handleChange} className="w-full border-gray-300 rounded-lg p-2.5 bg-gray-50 focus:ring-blue-500 outline-none border">
                                        <option value="0">No</option>
                                        <option value="1">Yes</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Stroke History</label>
                                    <select name="Stroke" value={formData.Stroke} onChange={handleChange} className="w-full border-gray-300 rounded-lg p-2.5 bg-gray-50 focus:ring-blue-500 outline-none border">
                                        <option value="0">No</option>
                                        <option value="1">Yes</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Heart Disease</label>
                                    <select name="HeartDiseaseorAttack" value={formData.HeartDiseaseorAttack} onChange={handleChange} className="w-full border-gray-300 rounded-lg p-2.5 bg-gray-50 focus:ring-blue-500 outline-none border">
                                        <option value="0">No</option>
                                        <option value="1">Yes</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Cholesterol Check</label>
                                    <select name="CholCheck" value={formData.CholCheck} onChange={handleChange} className="w-full border-gray-300 rounded-lg p-2.5 bg-gray-50 focus:ring-blue-500 outline-none border">
                                        <option value="0">No (Last 5 Yrs)</option>
                                        <option value="1">Yes (Last 5 Yrs)</option>
                                    </select>
                                </div>
                            </div>

                        </div>

                        <div className="md:col-span-2 pt-6">
                            <button disabled={loading} type="submit" className="w-full bg-[#3B82F6] hover:bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg transition-colors flex justify-center items-center gap-2">
                                {loading ? 'Analyzing with PERISAI AI...' : 'Generate Risk Prediction'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }

    // Mapping API targets to UI risk factors
    const riskFactors = [
        {
            title: 'Diabetes Risk',
            percent: (predictions.Diabetes * 100).toFixed(1),
            status: predictions.Diabetes > 0.5 ? 'High' : (predictions.Diabetes > 0.3 ? 'Medium' : 'Low'),
            color: predictions.Diabetes > 0.5 ? 'red' : (predictions.Diabetes > 0.3 ? 'orange' : 'green'),
            icon: <IoWaterOutline size={20} />,
        },
        {
            title: 'Hypertension Risk',
            percent: (predictions.HighBP * 100).toFixed(1),
            status: predictions.HighBP > 0.5 ? 'High' : (predictions.HighBP > 0.3 ? 'Medium' : 'Low'),
            color: predictions.HighBP > 0.5 ? 'red' : (predictions.HighBP > 0.3 ? 'orange' : 'green'),
            icon: <IoHeartOutline size={20} />,
        },
        {
            title: 'High Cholesterol',
            percent: (predictions.HighChol * 100).toFixed(1),
            status: predictions.HighChol > 0.5 ? 'High' : (predictions.HighChol > 0.3 ? 'Medium' : 'Low'),
            color: predictions.HighChol > 0.5 ? 'red' : (predictions.HighChol > 0.3 ? 'orange' : 'green'),
            icon: <IoWarningOutline size={20} />,
        }
    ]

    // Calculate overall average risk
    const avgRisk = ((predictions.Diabetes + predictions.HighBP + predictions.HighChol) / 3 * 100).toFixed(0);
    const overallColor = avgRisk > 50 ? 'border-red-400 text-red-500' : (avgRisk > 30 ? 'border-orange-400 text-orange-500' : 'border-green-400 text-[#10B981]');
    const overallStatus = avgRisk > 50 ? 'High Risk' : (avgRisk > 30 ? 'Moderate Risk' : 'Low Risk');

    return (
        <div className="min-h-screen bg-[#E5E7EB] p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-[#0F172A]">AI Risk Profile</h1>
                    <p className="text-[#64748B] mt-1">Your PERISAI Deep Learning analysis results</p>
                </div>
                <button onClick={() => setHasPredicted(false)} className="bg-white border border-gray-300 text-gray-700 font-medium px-4 py-2 rounded-xl shadow-sm hover:bg-gray-50">
                    Retake Assessment
                </button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
                {/* Risk Overview */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-[#0F172A] mb-6">Overall Risk Index</h2>
                    <div className="flex flex-col md:flex-row md:items-center gap-8">
                        <div className="relative w-48 h-48 flex items-center justify-center">
                            <div className="absolute inset-0 rounded-full border-[14px] border-gray-200"></div>
                            <div className={`absolute inset-0 rounded-full border-[14px] ${overallColor.split(' ')[0]} border-t-transparent border-l-transparent rotate-[135deg]`}></div>
                            <div className="text-center">
                                <h3 className="text-5xl font-bold text-[#0F172A]">{avgRisk}%</h3>
                                <p className={`font-medium mt-2 ${overallColor.split(' ')[1]}`}>{overallStatus}</p>
                            </div>
                        </div>
                        <div className="flex-1">
                            <p className="text-[#64748B] leading-relaxed">
                                Your average Non-Communicable Disease (PTM) risk is <span className={`font-medium ${overallColor.split(' ')[1]}`}>{overallStatus}</span> based on 14 clinical and lifestyle parameters.
                            </p>
                            <div className="bg-blue-50 rounded-xl p-4 mt-6">
                                <p className="text-sm text-[#64748B]">Powered by PERISAI TensorFlow Architecture with custom loss constraints.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Risk Factors */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-[#0F172A] mb-6">Specific Disease Probabilities</h2>
                    <div className="space-y-6">
                        {riskFactors.map((item, index) => (
                            <div key={index}>
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${item.color === 'orange' ? 'bg-orange-100 text-orange-500' : (item.color === 'red' ? 'bg-red-100 text-red-500' : 'bg-green-100 text-[#10B981]')}`}>
                                            {item.icon}
                                        </div>
                                        <p className="text-sm font-medium text-[#0F172A]">{item.title}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${item.color === 'orange' ? 'bg-orange-50 text-orange-500 border-orange-200' : (item.color === 'red' ? 'bg-red-50 text-red-500 border-red-200' : 'bg-green-50 text-[#10B981] border-green-200')}`}>
                                            {item.status}
                                        </span>
                                        <span className="text-sm text-[#64748B] font-bold">{item.percent}%</span>
                                    </div>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className={`h-2 rounded-full ${item.color === 'orange' ? 'bg-orange-400' : (item.color === 'red' ? 'bg-red-500' : 'bg-[#10B981]')}`} style={{ width: `${item.percent}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl border border-blue-100 shadow-sm p-6">
                <div className="flex items-center gap-4">
                    <div className="bg-white p-4 rounded-2xl">
                        <IoClipboardOutline size={28} className="text-[#3B82F6]" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-[#0F172A]">AI Medical Disclaimer</h2>
                        <p className="text-sm text-[#64748B] mt-1">This prediction is generated by an experimental Deep Learning model and should not replace professional medical diagnosis.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RiskProfilePage