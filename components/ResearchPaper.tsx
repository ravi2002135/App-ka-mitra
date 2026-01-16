
import React from 'react';

const ResearchPaper: React.FC = () => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="h-full flex flex-col bg-white overflow-y-auto">
      {/* Print Control Bar */}
      <div className="p-4 bg-slate-100 border-b border-slate-200 flex justify-between items-center print:hidden">
        <div>
          <h2 className="text-sm font-bold text-slate-700">Academic View</h2>
          <p className="text-[10px] text-slate-500">Optimized for PDF export</p>
        </div>
        <button 
          onClick={handlePrint}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-lg hover:bg-indigo-700 active:scale-95 transition-all flex items-center"
        >
          <i className="fas fa-file-pdf mr-2"></i> Save as PDF
        </button>
      </div>

      {/* Actual Paper Content */}
      <article className="max-w-[800px] mx-auto p-12 bg-white shadow-sm print:shadow-none print:p-0 font-serif leading-relaxed text-slate-900">
        <header className="text-center mb-10">
          <h1 className="text-2xl font-bold mb-4 uppercase tracking-tight leading-tight">
            App Ka Mitra: An Intelligent Multilingual Framework for Smart Heritage Tourism Using Generative AI and Augmented Reality
          </h1>
          <div className="text-sm font-medium space-y-1">
            <p className="font-bold">Authors: Ravi Yadav, Surrendra Bahadur Singh</p>
            <p>Guide: Dr. Avinash Tyagi</p>
            <p className="text-slate-500 text-xs italic">Department of Computer Science & Engineering</p>
          </div>
        </header>

        <section className="mb-8">
          <h2 className="text-lg font-bold border-b border-slate-200 mb-2 uppercase tracking-wide">Abstract</h2>
          <p className="text-sm italic text-justify">
            With the rapid globalization of heritage tourism, the demand for personalized, linguistically accessible, and safe travel experiences has surged. This paper proposes App Ka Mitra, a novel smart tourism application specifically tailored for the Indian subcontinent. Built upon the Google Gemini 2.5 Flash architecture, the system integrates real-time multilingual Natural Language Processing (NLP), Google Maps grounding for precision navigation, and Augmented Reality (AR) vision for landmark identification. Unlike traditional travel apps, App Ka Mitra provides a "safety-first" approach by incorporating offline emergency hubs and localized helpline data. Our research demonstrates how Generative AI can bridge the gap between complex historical narratives and modern traveler needs, ensuring a culturally immersive and secure experience.
          </p>
          <p className="mt-3 text-sm"><strong>Keywords:</strong> Smart Tourism, Generative AI, Gemini API, Augmented Reality, Heritage Tourism, Multilingual Support, Indian Tourism.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-bold border-b border-slate-200 mb-2 uppercase tracking-wide">I. Introduction</h2>
          <p className="text-sm text-justify">
            India possesses one of the world's most diverse cultural landscapes, encompassing thousands of years of history across numerous languages and religious traditions. However, international and domestic tourists often face significant barriers:
          </p>
          <ul className="list-disc ml-6 mt-2 text-sm space-y-1">
            <li><strong>Linguistic Complexity:</strong> Navigating regional languages such as Hindi, Tamil, Bengali, etc.</li>
            <li><strong>Contextual Gaps:</strong> Understanding the intricate history and protocols of religious sites.</li>
            <li><strong>Safety Concerns:</strong> Quick access to verified emergency services in unfamiliar regions.</li>
          </ul>
          <p className="mt-2 text-sm text-justify">
            The "App Ka Mitra" project addresses these challenges by consolidating an AI-powered multilingual chatbot, real-time GPS tracking, and an AR-based vision guide into a single, cohesive mobile framework.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-bold border-b border-slate-200 mb-2 uppercase tracking-wide">II. System Architecture and Methodology</h2>
          <p className="text-sm text-justify">
            The architecture of App Ka Mitra is modular, leveraging the latest advancements in Large Language Models (LLMs) and Vision-Language Models (VLMs).
          </p>
          <div className="mt-3 space-y-4">
            <div>
              <h3 className="text-md font-bold italic">A. Core Intelligence Engine</h3>
              <p className="text-sm text-justify">The system utilizes the Gemini 2.5 Flash model via the @google/genai SDK. This model was selected for its high-speed inference and "long context" window, allowing for detailed historical storytelling.</p>
            </div>
            <div>
              <h3 className="text-md font-bold italic">B. Grounding and Real-Time Navigation</h3>
              <p className="text-sm text-justify">The application employs Google Search and Maps Grounding. This ensures that the AI does not "hallucinate" locations. When a user queries for "Nearby Temples," the system fetches live coordinates and provides direct URI links to Google Maps for navigation.</p>
            </div>
            <div>
              <h3 className="text-md font-bold italic">C. AR Vision Module</h3>
              <p className="text-sm text-justify">Using the device’s camera, the AR module captures frames and transmits them to the Gemini Vision API. The model performs zero-shot identification of historical structures, returning JSON-structured data including significance and religious protocols.</p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-bold border-b border-slate-200 mb-2 uppercase tracking-wide">III. Key Features and Implementation</h2>
          <p className="text-sm text-justify mb-2">The implementation focuses on three pillars of the traveler experience:</p>
          <div className="space-y-3">
            <p className="text-sm"><strong>1. Multilingual Support:</strong> App Ka Mitra detects user input language and switches its internal system instruction to match the cultural nuances of that specific Indian region.</p>
            <p className="text-sm"><strong>2. The Emergency and Safety Hub:</strong> Recognizing that connectivity can be intermittent, critical helpline numbers (112, 100, 1091) are stored locally. It integrates a "One-Tap SOS" feature.</p>
            <p className="text-sm"><strong>3. Crowd-Sourced Review Analysis:</strong> The system incorporates a review feed that filters feedback specifically for cultural insights, helping travelers understand site protocols.</p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-bold border-b border-slate-200 mb-2 uppercase tracking-wide">IV. Discussion and Future Scope</h2>
          <p className="text-sm text-justify">
            Preliminary testing indicates that App Ka Mitra significantly reduces the time tourists spend searching for logistical information, allowing more time for cultural engagement. Future work includes the integration of Offline LLMs like Gemini Nano and real-time Audio-to-Audio interactions.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-bold border-b border-slate-200 mb-2 uppercase tracking-wide">V. Conclusion</h2>
          <p className="text-sm text-justify">
            The App Ka Mitra framework represents a paradigm shift in smart tourism. By combining the reasoning capabilities of Gemini AI with the spatial awareness of Google Maps and AR, we have created a tool that acts not just as a map, but as a culturally aware companion. This research highlights the potential of AI to preserve and promote Indian heritage in a modern, safe, and accessible manner.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-lg font-bold border-b border-slate-200 mb-2 uppercase tracking-wide">References</h2>
          <ol className="list-decimal ml-6 text-[10px] space-y-1 text-slate-600">
            <li>Google DeepMind. (2024). Gemini 2.5: A New Frontier in Multi-modal Reasoning.</li>
            <li>Buhalis, D., & Law, R. (2024). Twenty years of tourism technology and smart tourism research.</li>
            <li>Ministry of Tourism, Government of India. Annual Report on Heritage Tourism 2023-2024.</li>
          </ol>
        </section>

        <footer className="text-center text-[10px] text-slate-400 mt-20 border-t pt-4">
          © 2024 App Ka Mitra Framework - Ravi Yadav & Surrendra Bahadur Singh - Submitted under guidance of Dr. Avinash Tyagi
        </footer>
      </article>

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          article, article * {
            visibility: visible;
          }
          article {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 2cm;
            box-shadow: none;
          }
        }
      `}</style>
    </div>
  );
};

export default ResearchPaper;
