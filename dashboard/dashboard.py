import os
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import streamlit as st
import PIL
from PIL import Image
Image.MAX_IMAGE_PIXELS = None 
sns.set_theme(style="whitegrid")

import matplotlib as mpl
mpl.rcParams['figure.dpi'] = 100

st.set_page_config(
    page_title="PERISAI - Dashboard Analisis PTM",
    page_icon="🏥",
    layout="wide",
    initial_sidebar_state="expanded"
)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PATH = os.path.join(BASE_DIR, '../data/ml_dataset_final_clean.csv')
TARGETS = ['Diabetes', 'HighBP', 'HighChol']
TARGET_LABELS = {'Diabetes': 'Diabetes', 'HighBP': 'Hipertensi', 'HighChol': 'Kolesterol Tinggi'}
BMI_CLASSES = [0, 18.5, 25, 30, 35, 50]
BMI_LABELS = ['Underweight', 'Normal', 'Overweight', 'Obesitas I', 'Obesitas II']
AGE_LABELS = ['18-30', '31-45', '46-60', '61-75', '75+']
AGE_CODE_MAP = {
    1: '18-30', 2: '18-30',
    3: '31-45', 4: '31-45', 5: '31-45',
    6: '46-60', 7: '46-60', 8: '46-60', 9: '46-60',
    10: '61-75', 11: '61-75',
    12: '75+', 13: '75+'
}

@st.cache_data
def load_data():
    df = pd.read_csv('../data/ml_dataset_final_clean.csv')
    for c in TARGETS:
        df[c] = df[c].astype(int)
    for c in ['Smoker', 'PhysActivity', 'Fruits', 'Veggies', 'HvyAlcoholConsump', 'Stroke', 'HeartDiseaseorAttack', 'CholCheck', 'DiffWalk', 'Sex']:
        df[c] = df[c].astype(int)
    df['AgeGroup'] = df['Age'].map(AGE_CODE_MAP)
    df['BMIClass'] = pd.cut(df['BMI'], bins=BMI_CLASSES, labels=BMI_LABELS, right=False)
    return df

df = load_data()

with st.sidebar:
    st.image("Logo (1).png", width=70)
    st.markdown("### 🏥 PERISAI")
    st.markdown("**P**rediksi & **E**dukasi **R**isiko Penyakit Tidak **M**enular")
    st.markdown("---")
    menu = st.radio(
        "Navigasi",
        ["📊 Ringkasan", "🔍 Eksplorasi Data", "🎮 What-If Simulation", "📋 Risk Assessment", "ℹ️ Tentang"]
    )

if menu == "📊 Ringkasan":
    st.title("🏥 Dashboard Analisis Penyakit Tidak Menular")
    st.markdown("Dashboard interaktif untuk menganalisis risiko **Diabetes**, **Hipertensi**, dan **Kolesterol Tinggi** berdasarkan data gaya hidup dan kesehatan.")

    col1, col2, col3, col4 = st.columns(4)
    with col1:
        st.metric("Total Responden", f"{len(df):,}")
    with col2:
        st.metric("Fitur Analisis", f"{len(df.columns) - 4}")
    with col3:
        st.metric("Diabetes", f"{df['Diabetes'].mean()*100:.1f}%")
    with col4:
        st.metric("Hipertensi", f"{df['HighBP'].mean()*100:.1f}%")

    st.markdown("### 📈 Prevalensi Penyakit Tidak Menular")
    prev_data = pd.DataFrame({
        'Penyakit': [TARGET_LABELS[t] for t in TARGETS],
        'Terdiagnosis': [int(df[t].sum()) for t in TARGETS],
        'Normal': [int((1 - df[t]).sum()) for t in TARGETS],
        'Persentase': [f"{df[t].mean()*100:.1f}%" for t in TARGETS]
    })
    cola, colb = st.columns([1, 1])
    with cola:
        fig, ax = plt.subplots(figsize=(8, 4), dpi=100)
        x = np.arange(len(TARGETS))
        w = 0.35
        bars1 = ax.bar(x - w/2, prev_data['Normal'], w, label='Normal', color='#4CAF50')
        bars2 = ax.bar(x + w/2, prev_data['Terdiagnosis'], w, label='Terdiagnosis', color='#F44336')
        ax.set_xticks(x)
        ax.set_xticklabels([TARGET_LABELS[t] for t in TARGETS])
        ax.set_ylabel('Jumlah Responden')
        ax.set_title('Perbandingan Kasus Diabetes, Hipertensi, & Kolesterol')
        ax.legend()
        for bar in bars1:
            ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 300, f'{int(bar.get_height()):,}', ha='center', va='bottom', fontsize=9)
        for bar in bars2:
            ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 300, f'{int(bar.get_height()):,}', ha='center', va='bottom', fontsize=9)
        st.pyplot(fig)
        plt.close(fig)
    with colb:
        st.dataframe(prev_data, hide_index=True, use_container_width=True)
        st.markdown("""
        **Insight:**
        - Dataset menggunakan **50:50 split** untuk Diabetes
        - **Hipertensi** memiliki prevalensi tertinggi
        - Ketiga penyakit memiliki proporsi kasus yang signifikan
        """)

    st.markdown("### 👥 Demografi Responden")
    colx, coly = st.columns(2)
    with colx:
        age_dist = df['AgeGroup'].value_counts().sort_index()
        fig, ax = plt.subplots(figsize=(8, 4), dpi=100)
        bars = ax.bar(age_dist.index.astype(str), age_dist.values, color='#2196F3')
        ax.set_title('Distribusi Usia')
        ax.set_xlabel('Kelompok Usia')
        ax.set_ylabel('Jumlah')
        for bar in bars:
            ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 100,
                    f'{int(bar.get_height()):,}', ha='center', va='bottom', fontsize=8)
        print(f"DPI: {fig.dpi}, Size: {fig.get_size_inches()}, Total px: {fig.dpi * fig.get_size_inches()[0] * fig.dpi * fig.get_size_inches()[1]}")
        st.pyplot(fig)
        plt.close(fig)
    with coly:
        sex_data = df['Sex'].map({0: 'Perempuan', 1: 'Laki-laki'}).value_counts()
        print(sex_data)
        fig, ax = plt.subplots(figsize=(6, 4), dpi=100)
        ax.pie(sex_data.values, labels=sex_data.index, autopct='%1.1f%%', 
            startangle=90, colors=['#E91E63', '#2196F3'])
        ax.set_title('Distribusi Jenis Kelamin')
        st.pyplot(fig)
        plt.close(fig)

elif menu == "🔍 Eksplorasi Data":
    st.title("🔍 Eksplorasi Data Interaktif")
    st.markdown("Jelajahi hubungan antara gaya hidup dan risiko penyakit tidak menular.")

    tab1, tab2, tab3 = st.tabs(["📊 Distribusi Penyakit", "🔥 Korelasi Faktor Risiko", "📈 Analisis BMI"])

    with tab1:
        st.markdown("### Distribusi Penyakit per Faktor")
        col1, col2 = st.columns([1, 3])
        with col1:
            penyakit = st.selectbox("Pilih Penyakit", options=TARGETS, format_func=lambda x: TARGET_LABELS[x])
            faktor = st.selectbox("Kelompok Berdasarkan", options=['Sex', 'Smoker', 'PhysActivity', 'Fruits', 'Veggies', 'HvyAlcoholConsump', 'AgeGroup', 'BMIClass'])
            FAKTOR_LABELS = {
                'Sex': {0: 'Perempuan', 1: 'Laki-laki'},
                'Smoker': {0: 'Tidak', 1: 'Ya'},
                'PhysActivity': {0: 'Tidak', 1: 'Ya'},
                'Fruits': {0: 'Tidak', 1: 'Ya'},
                'Veggies': {0: 'Tidak', 1: 'Ya'},
                'HvyAlcoholConsump': {0: 'Tidak', 1: 'Ya'},
            }
        with col2:
            fig, ax = plt.subplots(figsize=(10, 5), dpi=100)
            crosstab = pd.crosstab(df[faktor], df[penyakit], normalize='index') * 100
            crosstab.columns = ['Normal', 'Terdiagnosis']
            crosstab.plot(kind='bar', ax=ax, color=['#4CAF50', '#F44336'])
            ax.set_title(f'Distribusi {TARGET_LABELS[penyakit]} berdasarkan {faktor}')
            ax.set_ylabel('Persentase (%)')
            ax.set_xlabel(faktor)
            ax.legend(title='Status')
            if faktor in FAKTOR_LABELS:
                ax.set_xticklabels([FAKTOR_LABELS[faktor].get(int(t.get_text()), t.get_text()) for t in ax.get_xticklabels()], rotation=45, ha='right')
            else:
                ax.set_xticklabels(ax.get_xticklabels(), rotation=45, ha='right')
            st.pyplot(fig)
            plt.close(fig)

    with tab2:
        st.markdown("### Korelasi Faktor Gaya Hidup vs Risiko PTM")
        col1, col2 = st.columns([1, 3])
        with col1:
            fitur_korelasi = st.multiselect(
                "Pilih Faktor", 
                options=['BMI', 'Smoker', 'PhysActivity', 'HvyAlcoholConsump', 'GenHlth', 'SleepHours', 'Fruits', 'Veggies', 'Age', 'Sex'],
                default=['BMI', 'Smoker', 'PhysActivity', 'HvyAlcoholConsump', 'GenHlth']
            )
        with col2:
            if fitur_korelasi:
                corr_matrix = df[fitur_korelasi + TARGETS].corr().loc[fitur_korelasi, TARGETS]
                corr_matrix.columns = [TARGET_LABELS[t] for t in TARGETS]
                fig, ax = plt.subplots(figsize=(len(fitur_korelasi) * 0.8 + 2, 5), dpi=100)
                sns.heatmap(corr_matrix, annot=True, cmap='RdYlGn', center=0, vmin=-0.5, vmax=0.5, ax=ax)
                ax.set_title('Korelasi Faktor Risiko terhadap PTM')
                st.pyplot(fig)
                plt.close(fig)
                st.markdown("""
                **Interpretasi:**
                - **GenHlth** (Kesehatan Umum): Korelasi terkuat terhadap ketiga penyakit
                - **BMI**: Korelasi positif signifikan dengan Diabetes & Hipertensi
                - **PhysActivity**: Korelasi negatif (aktivitas fisik = pelindung)
                """)

    with tab3:
        st.markdown("### Analisis BMI terhadap Penyakit")
        col1, col2 = st.columns(2)
        with col1:
            penyakit_bmi = st.radio("Pilih Penyakit", options=TARGETS, format_func=lambda x: TARGET_LABELS[x], horizontal=True, key="bmi_radio")
            fig, ax = plt.subplots(figsize=(8, 4), dpi=100)
            sns.boxplot(data=df, x=penyakit_bmi, y='BMI', ax=ax, palette=['#4CAF50', '#F44336'])
            ax.set_xticklabels(['Normal', 'Terdiagnosis'])
            ax.set_title(f'Distribusi BMI berdasarkan {TARGET_LABELS[penyakit_bmi]}')
            st.pyplot(fig)
            plt.close(fig)
        with col2:
            bmi_means = df.groupby('BMIClass')[TARGETS].mean() * 100
            bmi_means.columns = [TARGET_LABELS[t] for t in TARGETS]
            fig, ax = plt.subplots(figsize=(8, 4), dpi=100)
            bmi_means.plot(kind='line', marker='o', ax=ax, linewidth=2)
            ax.set_title('Prevalensi Penyakit per Klasifikasi BMI')
            ax.set_xlabel('Klasifikasi BMI')
            ax.set_ylabel('Prevalensi (%)')
            ax.legend(title='Penyakit')
            ax.set_xticklabels(ax.get_xticklabels(), rotation=45, ha='right')
            ax.set_ylim(0, 100)
            st.pyplot(fig)
            plt.close(fig)

        st.info("**Rata-rata BMI**: Semakin tinggi BMI, semakin tinggi risiko Diabetes dan Hipertensi. Obesitas (BMI ≥ 30) menunjukkan prevalensi penyakit yang jauh lebih tinggi.")

elif menu == "🎮 What-If Simulation":
    st.title("🎮 What-If Simulation")
    st.markdown("Simulasikan bagaimana perubahan gaya hidup memengaruhi risiko kesehatan berdasarkan referensi medis.")

    with st.expander("📖 Tentang Simulasi Ini", expanded=False):
        st.markdown("""
        Simulasi ini menggunakan bobot perubahan berdasarkan referensi medis global:
        - **AHA (American Heart Association)**: Pengaruh garam terhadap tekanan darah
        - **WHO**: Pengaruh aktivitas fisik terhadap kesehatan kardiovaskular
        - **Studi Klinis**: Pengaruh tidur dan stres terhadap profil lipid & tekanan darah
        """)

    col1, col2 = st.columns([1, 1.5])
    with col1:
        st.markdown("### ⚙️ Atur Parameter")
        usia = st.slider("Usia", 18, 90, 45)
        bmi = st.slider("BMI", 15.0, 50.0, 27.0, 0.1)
        weight_change = st.slider("Penurunan Berat Badan (kg)", 0, 20, 0)

        st.markdown("---")
        salt_slider = st.slider("Asupan Garam per Hari (gram)", 0.0, 15.0, 8.0, 0.5)
        salt_reduction = st.slider("Pengurangan Asupan Garam (gram)", 0.0, 5.0, 0.0, 0.5)

        st.markdown("---")
        sleep_hours = st.slider("Durasi Tidur (jam)", 4.0, 11.0, 7.0, 0.5)
        stress_level = st.slider("Tingkat Stres (1=Rendah, 10=Tinggi)", 1, 10, 5)
        phys_active = st.toggle("Aktif Olahraga Rutin (>30 menit/hari)", value=False)

    bp_initial = 120 + (bmi - 25) * 1.5 + (usia - 40) * 0.5 + max(0, (salt_slider - 5) * 1.2)
    bp_initial = min(max(bp_initial, 90), 200)
    chol_initial = 180 + (bmi - 25) * 2 + (stress_level - 5) * 5 + max(0, (salt_slider - 5) * 3)
    chol_initial = min(max(chol_initial, 100), 350)

    bp_final = bp_initial
    chol_final = chol_initial

    systolic_drop = 0
    if weight_change > 0:
        drop_w = weight_change * 1.0
        systolic_drop += drop_w
        bp_final -= drop_w
    if salt_reduction > 0:
        drop_salt = salt_reduction * 2.0
        systolic_drop += drop_salt
        bp_final -= drop_salt
    if phys_active:
        drop_act = 5.0
        systolic_drop += drop_act
        bp_final -= drop_act
        chol_final *= 0.95
    if sleep_hours < 6:
        sleep_deficit = 6 - sleep_hours
        bp_final += sleep_deficit * 1.5
    elif sleep_hours < 8:
        sleep_gain = sleep_hours - 6
        bp_final -= sleep_gain * 1.5
    stress_drop = 0
    if stress_level > 5:
        stress_drop = (stress_level - 5) * 0.5
        chol_final *= (1 - stress_drop / 100)
    elif stress_level < 5:
        stress_drop = (5 - stress_level) * 0.5
        chol_final *= (1 + stress_drop / 100)

    bp_final = min(max(bp_final, 90), 200)
    chol_final = min(max(chol_final, 100), 350)

    bp_change = bp_final - bp_initial
    chol_change = chol_final - chol_initial

    def risk_category(val, lower, upper):
        if val < lower:
            return "Rendah", "#4CAF50"
        elif val < upper:
            return "Sedang", "#FFC107"
        else:
            return "Tinggi", "#F44336"

    bp_cat, bp_color = risk_category(bp_final, 120, 140)
    chol_cat, chol_color = risk_category(chol_final, 200, 240)

    with col2:
        st.markdown("### 📊 Hasil Simulasi")
        met_col1, met_col2, met_col3 = st.columns(3)
        with met_col1:
            st.metric(
                "Tekanan Darah Sistolik",
                f"{bp_final:.0f} mmHg",
                delta=f"{bp_change:+.0f}" if abs(bp_change) > 0.5 else "0",
                delta_color="inverse"
            )
        with met_col2:
            st.metric(
                "Kolesterol Total",
                f"{chol_final:.0f} mg/dL",
                delta=f"{chol_change:+.0f}" if abs(chol_change) > 0.5 else "0",
                delta_color="inverse"
            )
        with met_col3:
            initial_risk = (bp_initial > 130) + (chol_initial > 200)
            final_risk = (bp_final > 130) + (chol_final > 200)
            risk_delta = final_risk - initial_risk
            st.metric(
                "Jumlah Faktor Risiko",
                f"{final_risk} / 2",
                delta=f"{risk_delta:+d}" if risk_delta != 0 else "0",
                delta_color="inverse"
            )

        st.markdown("### Status Risiko")
        colr1, colr2 = st.columns(2)
        with colr1:
            st.markdown(
                f"<div style='background:{bp_color}30; padding:15px; border-radius:10px; border-left:5px solid {bp_color};'>"
                f"<b>Tekanan Darah</b><br>"
                f"<span style='font-size:24px; color:{bp_color};'>{bp_cat}</span><br>"
                f"{bp_final:.0f} mmHg</div>", unsafe_allow_html=True
            )
        with colr2:
            st.markdown(
                f"<div style='background:{chol_color}30; padding:15px; border-radius:10px; border-left:5px solid {chol_color};'>"
                f"<b>Kolesterol</b><br>"
                f"<span style='font-size:24px; color:{chol_color};'>{chol_cat}</span><br>"
                f"{chol_final:.0f} mg/dL</div>", unsafe_allow_html=True
            )

        if bp_change < 0 or phys_active or weight_change > 0 or salt_reduction > 0:
            st.success(f"**Perubahan positif terdeteksi!** "
                       f"{'Tekanan darah turun ' + str(round(abs(systolic_drop))) + ' mmHg. ' if abs(systolic_drop) > 0 else ''}"
                       f"{'Aktivitas fisik membantu menurunkan kolesterol 5%.' if phys_active else ''}")

elif menu == "📋 Risk Assessment":
    st.title("📋 Risk Assessment")
    st.markdown("Hitung skor risiko penyakit tidak menular berdasarkan profil kesehatan Anda.")

    with st.expander("📖 Metodologi"):
        st.markdown("""
        Skor risiko dihitung menggunakan formula linear berdasarkan analisis data BRFSS 2015:
        - **Skor Diabetes**: BMI, Usia, Stroke, Heart Disease, PhysActivity, GenHlth
        - **Skor Hipertensi**: Usia, BMI, Smoker, PhysActivity, GenHlth
        - **Skor Kolesterol**: BMI, Usia, Veggies, GenHlth, Smoker
        """)

    col1, col2 = st.columns([1, 1.5])
    with col1:
        st.markdown("### Masukkan Data")
        age = st.number_input("Usia", min_value=18, max_value=100, value=45)
        bmi_val = st.number_input("BMI", min_value=15.0, max_value=50.0, value=26.0, step=0.1)
        sex = st.radio("Jenis Kelamin", options=[0, 1], format_func=lambda x: "Perempuan" if x == 0 else "Laki-laki", horizontal=True)
        smoker = st.toggle("Perokok", value=False)
        phys_act = st.toggle("Aktif Fisik (>30 menit/hari)", value=True)
        fruits = st.toggle("Konsumsi Buah (>=1 porsi/hari)", value=True)
        veggies = st.toggle("Konsumsi Sayur (>=1 porsi/hari)", value=True)
        heavy_alcohol = st.toggle("Konsumsi Alkohol Berat", value=False)
        stroke = st.toggle("Riwayat Stroke", value=False)
        heart_disease = st.toggle("Riwayat Penyakit Jantung", value=False)
        diff_walk = st.toggle("Kesulitan Berjalan", value=False)
        chol_check = st.toggle("Cek Kolesterol Rutin", value=True)
        gen_hlth = st.select_slider("Kesehatan Umum", options=[1, 2, 3, 4, 5], value=3, format_func=lambda x: ["Sangat Baik", "Baik", "Cukup", "Kurang", "Sangat Kurang"][x-1])

    def risk_score(age, bmi, smoker, phys_act, stroke, heart_disease, gen_hlth, veggies):
        diab = (
            bmi * 0.04 + age * 0.01 + stroke * 0.6 + heart_disease * 0.5 -
            phys_act * 0.2 + gen_hlth * 0.15
        )
        hbp = (
            age * 0.03 + bmi * 0.02 + smoker * 0.4 - phys_act * 0.1 + gen_hlth * 0.2
        )
        chol = (
            bmi * 0.05 + age * 0.02 - veggies * 0.3 + gen_hlth * 0.15 + smoker * 0.2
        )
        return diab, hbp, chol

    age_scaled = 4 if age < 30 else (8 if age < 45 else (11 if age < 60 else (12 if age < 75 else 13)))

    diab_score, hbp_score, chol_score = risk_score(
        age_scaled, bmi_val, int(smoker), int(phys_act),
        int(stroke), int(heart_disease), gen_hlth, int(veggies)
    )

    thresholds = {
        'Diabetes': 2.0,
        'Hipertensi': 2.8,
        'Kolesterol': 2.5
    }

    results = {
        'Diabetes': ("Terdiagnosis" if diab_score > thresholds['Diabetes'] else "Normal", diab_score),
        'Hipertensi': ("Terdiagnosis" if hbp_score > thresholds['Hipertensi'] else "Normal", hbp_score),
        'Kolesterol': ("Terdiagnosis" if chol_score > thresholds['Kolesterol'] else "Normal", chol_score)
    }

    with col2:
        st.markdown("### Hasil Assessment")
        for disease, (status, score) in results.items():
            color = "#F44336" if status == "Terdiagnosis" else "#4CAF50"
            pct = min(score / (thresholds[disease] * 1.5) * 100, 100)
            st.markdown(
                f"<div style='background:{color}15; padding:15px; border-radius:10px; margin:10px 0; border-left:5px solid {color};'>"
                f"<b>{disease}</b><br>"
                f"<span style='font-size:20px; color:{color};'>{status}</span><br>"
                f"Skor Risiko: {score:.2f} (Threshold: {thresholds[disease]})</div>",
                unsafe_allow_html=True
            )
            st.progress(int(pct), text="")

        n_risk = sum(1 for s, _ in results.values() if s == "Terdiagnosis")
        if n_risk >= 2:
            st.warning(f"⚠️ **{n_risk} dari 3 penyakit terdeteksi berisiko.** Disarankan konsultasi medis lebih lanjut.")
        elif n_risk >= 1:
            st.info(f"📋 **{n_risk} dari 3 penyakit terdeteksi berisiko.** Pertimbangkan perubahan gaya hidup.")
        else:
            st.success("✅ **Semua hasil normal.** Pertahankan gaya hidup sehat!")

elif menu == "ℹ️ Tentang":
    st.title("ℹ️ Tentang PERISAI")
    st.markdown("""
    **PERISAI** (Prediksi & Edukasi Risiko Penyakit Tidak Menular) adalah platform analisis data kesehatan yang
    menggunakan pendekatan data-driven untuk memprediksi risiko Penyakit Tidak Menular (PTM).

    ### 🎯 Tujuan
    - Menganalisis faktor risiko Diabetes, Hipertensi, dan Kolesterol Tinggi
    - Menyediakan simulasi *what-if* untuk edukasi perubahan gaya hidup
    - Memberikan assessment risiko berbasis data

    ### 📊 Sumber Data
    - **BRFSS 2015** (Behavioral Risk Factor Surveillance System) - CDC
    - Dataset diabetes_binary_5050split dengan 70.692 responden
    - 22 fitur kesehatan dan gaya hidup

    ### 🔬 Metodologi
    - **Exploratory Data Analysis**: Analisis distribusi dan korelasi
    - **Feature Engineering**: Transformasi log harian menjadi fitur model
    - **What-If Simulation**: Menggunakan bobot medis dari AHA/WHO
    - **Risk Scoring**: Model linear berdasarkan pola dataset

    ### 👨‍💻 Pengembang
    Dashboard ini dikembangkan sebagai bagian dari proyek capstone Dicoding.
    """)
    st.markdown("---")
    st.markdown("**Teknologi:** Python, Streamlit, Pandas, Seaborn, Matplotlib, Scikit-learn")
