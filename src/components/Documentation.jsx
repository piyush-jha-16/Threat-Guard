import React from 'react';
import './Documentation.css';

const Documentation = () => {
  const architectureLayers = [
    {
      title: 'Frontend Interface (React)',
      points: [
        'Interactive views for Documents, Executables, and URLs scanning',
        'Top and bottom navigation for quick workflow switching',
        'Real-time rendering of threat levels, matched patterns, and metadata'
      ]
    },
    {
      title: 'Backend API (Flask)',
      points: [
        'Receives files/URLs through REST endpoints',
        'Validates request format and orchestrates scanner execution',
        'Returns normalized response payloads for consistent UI display'
      ]
    },
    {
      title: 'Scanning Pipeline',
      points: [
        'Magic bytes analyzer checks file signature consistency',
        'Entropy measurement estimates obfuscation or packed content',
        'Keyword extraction and rule evaluation generate weighted threat score'
      ]
    }
  ];

  const strengths = [
    'Explainable detection: each alert maps to concrete matched indicators.',
    'Fast analysis: no model loading or external inference service required.',
    'Deterministic output: same input produces stable, reproducible decisions.',
    'Operational simplicity: low infrastructure footprint and easy debugging.',
    'Strong baseline for known attack patterns in phishing, macro abuse, and ransomware notes.'
  ];

  const ruleBasedBenefits = [
    {
      title: 'Auditable Security Logic',
      description: 'Security teams can review, approve, and version rules like policy-as-code, which is critical for compliance and governance.'
    },
    {
      title: 'Low False-Positive Tuning Cost',
      description: 'Thresholds, pattern lists, and severity mappings can be changed directly without retraining a model.'
    },
    {
      title: 'No Training Data Dependency',
      description: 'The system is usable immediately, even where labeled malware datasets are limited or sensitive.'
    },
    {
      title: 'Predictable Runtime',
      description: 'Execution cost scales with file size and rule count, enabling straightforward capacity planning.'
    }
  ];

  const limitations = [
    'Novel attacks can evade static signatures by changing wording or structure.',
    'Encrypted or heavily compressed payloads reduce visibility during static inspection.',
    'Context blindness: isolated file/URL analysis may miss campaign-level behavior.',
    'Rule drift: stale indicators can lose accuracy as attacker techniques evolve.'
  ];

  const failureCases = [
    {
      title: 'Obfuscated Social Engineering Content',
      detail: 'Attack text can be split, encoded, or visually altered to bypass direct keyword detection.'
    },
    {
      title: 'File Type Spoofing with Valid Containers',
      detail: 'Some malicious documents keep legitimate container headers while hiding active payloads deeper in content.'
    },
    {
      title: 'Low-and-Slow Indicators',
      detail: 'A sample may contain weak indicators across many categories that do not exceed individual rule thresholds.'
    },
    {
      title: 'Benign Administrative Scripts',
      detail: 'Legitimate IT automation can resemble suspicious execution patterns and trigger medium/high alerts.'
    }
  ];

  const mitigationStrategies = [
    'Continuously refresh indicator dictionaries and severity mappings.',
    'Introduce rule-combination scoring to capture weak but correlated signals.',
    'Add sandbox-assisted dynamic checks for selected medium/high-risk files.',
    'Integrate URL intelligence feeds and reputation lookups for better context.',
    'Establish feedback loops from analyst verdicts to rule refinement.'
  ];

  return (
    <section className="documentation-section">
      <header className="documentation-hero">
        <p className="documentation-badge">Threat Guard Project Documentation</p>
        <h1>System Overview and Technical Assessment</h1>
        <p>
          This page documents how Threat Guard is built, why its rule-based design is effective,
          where it can fail, and how to improve resilience over time. It is meant for technical
          reviewers, researchers, and security engineers.
        </p>
      </header>

      <div className="documentation-grid">
        <article className="documentation-card span-2">
          <h2>High-Level Architecture</h2>
          <p>
            Threat Guard follows a three-tier architecture that separates user interaction,
            API orchestration, and threat evaluation logic.
          </p>
          <div className="layer-grid">
            {architectureLayers.map((layer) => (
              <div key={layer.title} className="layer-card">
                <h3>{layer.title}</h3>
                <ul>
                  {layer.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </article>

        <article className="documentation-card">
          <h2>Why This Project Is Good</h2>
          <ul>
            {strengths.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="documentation-card">
          <h2>Why Rule-Based Detection Is Good</h2>
          <div className="feature-stack">
            {ruleBasedBenefits.map((item) => (
              <div key={item.title} className="feature-item">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="documentation-card">
          <h2>Known Limitations</h2>
          <ul>
            {limitations.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="documentation-card">
          <h2>When the Project Can Fail</h2>
          <div className="failure-list">
            {failureCases.map((item) => (
              <div key={item.title} className="failure-item">
                <h3>{item.title}</h3>
                <p>{item.detail}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="documentation-card span-2">
          <h2>Improvement Roadmap</h2>
          <ul>
            {mitigationStrategies.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="documentation-card span-2 paper-card">
          <h2>Research Paper</h2>
          <p>
            Download the project paper for detailed design rationale, methodology,
            threat taxonomy, and evaluation notes.
          </p>
          <a
            className="paper-download-button"
            href="/Threat_Guard_IEEE_Paper_v2.docx"
            download="Threat_Guard_IEEE_Paper_v2.docx"
          >
            Download Research Paper
          </a>
        </article>
      </div>
    </section>
  );
};

export default Documentation;
