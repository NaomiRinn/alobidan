import { useState } from 'react';
import { useApp } from '../context/AppContext.js';

export default function SymptomChecker({ setCurrentPage }) {
  const { symptoms, diseases, dataLoading } = useApp();
  const [step, setStep] = useState(1);
  const [selected, setSelected] = useState([]);
  const [results, setResults] = useState([]);
  const [analyzed, setAnalyzed] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleSymptom = (id) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const analyze = async () => {
    if (selected.length === 0) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 2000));

    // Match diseases
    const matched = diseases
      .map(disease => {
        const matchedSymptoms = disease.symptoms.filter(s => selected.includes(s));
        const hasRequired = disease.requiredSymptoms.some(s => selected.includes(s));
        const score = hasRequired ? (matchedSymptoms.length / disease.symptoms.length) * 100 : 0;
        return { ...disease, score: Math.round(score), matchedSymptoms };
      })
      .filter(d => d.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    setResults(matched);
    setLoading(false);
    setAnalyzed(true);
    setStep(3);
  };

  const reset = () => {
    setStep(1);
    setSelected([]);
    setResults([]);
    setAnalyzed(false);
  };

  const urgencyConfig = {
    darurat: { color: '#ef4444', bg: '#fef2f2', label: 'DARURAT', btn: 'Ke RS Sekarang' },
    segera: { color: '#f59e0b', bg: '#fffbeb', label: 'Sgera Periksa', btn: 'Buat Janji Bidan' },
    normal: { color: '#10b981', bg: '#ecfdf5', label: 'Kondisi Umum', btn: 'Konsultasi Bidan' },
  };

  if (dataLoading) {
    return (
      <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="page-hero-mini">
        <div className="container">
          <h1 className="page-title">🤰 Cek Keluhan Bunda</h1>
          <p className="page-subtitle">Identifikasi kondisi kesehatan kehamilan berdasarkan keluhan yang Bunda rasakan</p>
        </div>
      </div>

      <div className="container symptom-page">
        {/* Disclaimer */}
        <div className="symptom-disclaimer">
          ⚠️ <strong>Perhatian:</strong> Fitur ini hanya panduan awal dan bukan diagnosa mutlak. Selalu konsultasikan dengan Bidan atau Dokter Kandungan untuk penanganan pasti.
        </div>

        {/* Stepper */}
        <div className="symptom-stepper">
          {['Pilih Keluhan', 'Konfirmasi', 'Hasil Analisis'].map((label, i) => (
            <div key={i} className={`step ${step > i ? 'completed' : step === i + 1 ? 'active' : ''}`}>
              <div className="step-circle">{step > i + 1 ? '✓' : i + 1}</div>
              <span className="step-label">{label}</span>
              {i < 2 && <div className="step-line"></div>}
            </div>
          ))}
        </div>

        {/* Step 1: Select Symptoms */}
        {step === 1 && (
          <div className="symptom-step">
            <h2 className="step-title">Pilih Keluhan Bunda Pagi Ini</h2>
            <p className="step-subtitle">Pilih semua keluhan yang Bunda rasa mengganggu</p>

            <div className="symptoms-grid">
              {symptoms.map(sym => (
                <button
                  key={sym.id}
                  className={`symptom-btn ${selected.includes(sym.id) ? 'selected' : ''}`}
                  onClick={() => toggleSymptom(sym.id)}
                  id={`symptom-${sym.id}`}
                >
                  <span className="sym-icon">{sym.icon}</span>
                  <span className="sym-label">{sym.label}</span>
                  {selected.includes(sym.id) && <span className="sym-check">✓</span>}
                </button>
              ))}
            </div>

            <div className="symptom-selected-count">
              <span>{selected.length} keluhan dipilih</span>
              {selected.length > 0 && (
                <div className="selected-tags">
                  {selected.map(id => {
                    const sym = symptoms.find(s => s.id === id);
                    return (
                      <span key={id} className="selected-tag">
                        {sym.icon} {sym.label}
                        <button onClick={() => toggleSymptom(id)}>✕</button>
                      </span>
                    );
                  })}
                </div>
              )}
            </div>

            <button
              className={`btn-next-step ${selected.length === 0 ? 'disabled' : ''}`}
              onClick={() => selected.length > 0 && setStep(2)}
              disabled={selected.length === 0}
            >
              Lanjut →
            </button>
          </div>
        )}

        {/* Step 2: Confirm */}
        {step === 2 && (
          <div className="symptom-step">
            <h2 className="step-title">Konfirmasi Keluhan Bunda</h2>
            <p className="step-subtitle">Pastikan daftar keluhan berikut sudah tepat:</p>

            <div className="confirm-symptoms">
              {selected.map(id => {
                const sym = symptoms.find(s => s.id === id);
                return (
                  <div key={id} className="confirm-item">
                    <span>{sym.icon}</span>
                    <span>{sym.label}</span>
                    <button className="remove-sym" onClick={() => toggleSymptom(id)}>✕</button>
                  </div>
                );
              })}
            </div>

            <div className="step-actions">
              <button className="btn-back-step" onClick={() => setStep(1)}>← Kembali</button>
              <button
                className={`btn-analyze ${loading ? 'loading' : ''}`}
                onClick={analyze}
                disabled={loading}
                id="analyze-btn"
              >
                {loading ? (
                  <>
                    <span className="loading-spinner"></span>
                    Menganalisis...
                  </>
                ) : (
                  '🔍 Cek Kondisi'
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Results */}
        {step === 3 && analyzed && (
          <div className="symptom-step">
            <h2 className="step-title">Hasil Analisis Kehamilan</h2>

            {results.length > 0 ? (
              <div className="results-list">
                {results.map((disease, i) => {
                  const urgency = urgencyConfig[disease.urgency];
                  return (
                    <div key={disease.id} className="result-card" style={{ '--urgency-color': urgency.color }}>
                      <div className="result-rank">#{i + 1}</div>
                      <div className="result-header">
                        <div>
                          <h3 className="result-name">{disease.name}</h3>
                          <div className="result-score-bar">
                            <div
                              className="result-score-fill"
                              style={{ width: `${disease.score}%`, background: urgency.color }}
                            ></div>
                          </div>
                          <span className="result-score-text">Kesesuaian: {disease.score}%</span>
                        </div>
                        <div className="urgency-badge" style={{ background: urgency.bg, color: urgency.color }}>
                          {urgency.label}
                        </div>
                      </div>
                      <p className="result-desc">{disease.description}</p>
                      <div className="result-matched-symptoms">
                         <span>Keluhan Cocok:</span>
                        {disease.matchedSymptoms.map(id => {
                          const sym = symptoms.find(s => s.id === id);
                          return <span key={id} className="matched-tag">{sym?.icon} {sym?.label}</span>;
                        })}
                      </div>
                      <div className="result-recommendation">
                        <strong>💡 Arahan Bidan:</strong>
                        <p>{disease.recommendation}</p>
                      </div>
                      <div className="result-actions">
                        <button
                          className="btn-result-action"
                          style={{ background: urgency.color }}
                          onClick={() => setCurrentPage(disease.urgency === 'darurat' ? 'home' : 'doctors')}
                        >
                          {urgency.btn}
                        </button>
                        <span className="result-specialist">👩‍⚕️ {disease.specialist}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="no-result">
                <div className="no-result-icon">🤔</div>
                <h3>Keluhan Spesifik</h3>
                <p>Keluhan Bunda kurang cocok dengan pola kehamilan umum. Sangat disarankan untuk menghubungi Bidan atau jadwalkan periksa ke klinik.</p>
              </div>
            )}

            <div className="result-important-note">
               <strong>⚠️ Penting:</strong> Hasil ini hanya sebagai panduan awal dan bukan diagnosa medis resmi.
            </div>

            <div className="step-actions">
              <button className="btn-back-step" onClick={reset}>🔄 Cek Ulang</button>
              <a className="btn-consult-doctor" href="https://wa.me/6285640814083" target="_blank" rel="noopener noreferrer">
                💬 Hubungi Bidan via WA
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
