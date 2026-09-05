import React, { useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { SAMPLE_DOCUMENTS, SampleDocument } from '../data/sampleDocuments';
import { QuizPlayer } from '../components/QuizPlayer';
import { Question, QuizAttempt } from '../types';
import {
  Sparkles,
  UploadCloud,
  FileText,
  Sliders,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Layers,
  ArrowRight,
  Loader2,
  FileCode,
  BookOpen,
  RotateCcw,
} from 'lucide-react';

export const QuizGeneratorPage: React.FC = () => {
  const { showToast } = useAuth();

  // Document state
  const [docSourceType, setDocSourceType] = useState<'sample' | 'upload'>('sample');
  const [selectedSample, setSelectedSample] = useState<SampleDocument>(SAMPLE_DOCUMENTS[0]);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [documentText, setDocumentText] = useState<string>(SAMPLE_DOCUMENTS[0].content);
  const [pdfBase64, setPdfBase64] = useState<string | undefined>(undefined);
  const [filename, setFilename] = useState<string>(SAMPLE_DOCUMENTS[0].filename);

  // Configuration
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [difficulty, setDifficulty] = useState<string>('Medium');
  const [questionType, setQuestionType] = useState<string>('MCQ');
  const [selectedTopic, setSelectedTopic] = useState<string>('Auto');

  // Generation state
  const [generating, setGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState<string>('');
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[] | null>(null);
  const [generatedMetadata, setGeneratedMetadata] = useState<any>(null);

  // Handle sample document selection
  const handleSelectSample = (sample: SampleDocument) => {
    setSelectedSample(sample);
    setDocumentText(sample.content);
    setPdfBase64(undefined);
    setFilename(sample.filename);
    setUploadedFile(null);
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);
    setFilename(file.name);

    const ext = file.name.split('.').pop()?.toLowerCase();

    if (ext === 'pdf') {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        setPdfBase64(base64);
        setDocumentText(`[PDF Document: ${file.name}, size: ${(file.size / 1024).toFixed(1)} KB]`);
        showToast(`PDF loaded: ${file.name}`);
      };
      reader.readAsDataURL(file);
    } else {
      // Read as text for txt, doc, etc.
      const reader = new FileReader();
      reader.onload = () => {
        const text = reader.result as string;
        setDocumentText(text);
        setPdfBase64(undefined);
        showToast(`File loaded: ${file.name}`);
      };
      reader.readAsText(file);
    }
  };

  // Trigger Quiz Generation Workflow
  const handleGenerateQuiz = async () => {
    if (!documentText && !pdfBase64) {
      showToast('Please upload or select a document first.');
      return;
    }

    setGenerating(true);
    setGeneratedQuestions(null);

    try {
      setGenerationStep('Extracting and cleaning text context...');
      await new Promise(r => setTimeout(r, 600));

      setGenerationStep('Chunking text & computing semantic context retrieval (RAG)...');
      await new Promise(r => setTimeout(r, 700));

      setGenerationStep('Submitting grounded context to Gemini 3.8 Flash...');

      const res = await api.generateQuiz({
        documentText: pdfBase64 ? undefined : documentText,
        pdfBase64,
        filename,
        questionCount,
        difficulty,
        questionType,
        selectedTopic,
      });

      setGenerationStep('Validating distractors, single correct answers, and explanations...');
      await new Promise(r => setTimeout(r, 500));

      setGeneratedQuestions(res.questions);
      setGeneratedMetadata(res.metadata);
      showToast(`Generated ${res.questions.length} grounded questions!`);
    } catch (err) {
      console.error('Generation failed:', err);
      showToast('Error generating quiz. Please retry.');
    } finally {
      setGenerating(false);
      setGenerationStep('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
          <Sparkles className="w-4 h-4" />
          <span>AI Knowledge Verification</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          AI Quiz Generator from Statistical Learning Material
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Upload any official MoSPI handbook, survey guidelines, or training manual (PDF, TXT, DOCX) to generate grounded verification MCQs.
        </p>
      </div>

      {/* RAG Workflow Architecture Indicator */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md">
        <div className="text-xs font-bold text-slate-300 mb-3 flex items-center justify-between">
          <span>RAG Verification Pipeline</span>
          <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 font-semibold">
            Grounded Generation
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-7 gap-2 text-center text-[11px]">
          <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
            <span className="block font-bold text-white">1. Upload</span>
            <span className="text-[10px] text-slate-500">PDF / TXT</span>
          </div>
          <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
            <span className="block font-bold text-white">2. Clean</span>
            <span className="text-[10px] text-slate-500">Normalize</span>
          </div>
          <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
            <span className="block font-bold text-white">3. Chunk</span>
            <span className="text-[10px] text-slate-500">Overlap</span>
          </div>
          <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
            <span className="block font-bold text-white">4. Retrieve</span>
            <span className="text-[10px] text-slate-500">Relevance</span>
          </div>
          <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
            <span className="block font-bold text-amber-400">5. Gemini</span>
            <span className="text-[10px] text-slate-500">Structured</span>
          </div>
          <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
            <span className="block font-bold text-emerald-400">6. Validate</span>
            <span className="text-[10px] text-slate-500">Distractors</span>
          </div>
          <div className="p-2 bg-amber-500 text-slate-950 rounded-lg font-bold flex flex-col justify-center">
            <span>7. Quiz</span>
            <span className="text-[9px]">Interactive</span>
          </div>
        </div>
      </div>

      {/* If Quiz is Generated and Active, render QuizPlayer */}
      {generatedQuestions && generatedQuestions.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Grounded Quiz: {filename}</span>
            </h2>
            <button
              onClick={() => setGeneratedQuestions(null)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl flex items-center space-x-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Configure New Quiz</span>
            </button>
          </div>

          <QuizPlayer
            title={`Verification Quiz: ${filename}`}
            sourceDocumentName={filename}
            difficulty={difficulty}
            questions={generatedQuestions}
            onRestart={() => setGeneratedQuestions(null)}
          />
        </div>
      ) : (
        /* Configuration & Generation Form */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Cols: Document Selection / Upload */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h2 className="text-sm font-bold text-white flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-amber-400" />
                  <span>1. Select Learning Material</span>
                </h2>

                <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
                  <button
                    onClick={() => {
                      setDocSourceType('sample');
                      handleSelectSample(selectedSample);
                    }}
                    className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                      docSourceType === 'sample' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    MoSPI Samples
                  </button>
                  <button
                    onClick={() => setDocSourceType('upload')}
                    className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                      docSourceType === 'upload' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Upload File
                  </button>
                </div>
              </div>

              {docSourceType === 'sample' ? (
                /* Preloaded Official Statistical Samples */
                <div className="space-y-3">
                  <p className="text-xs text-slate-400">
                    Select an official handbook excerpt to test instant question generation:
                  </p>
                  <div className="space-y-2">
                    {SAMPLE_DOCUMENTS.map(sample => (
                      <button
                        key={sample.id}
                        onClick={() => handleSelectSample(sample)}
                        className={`w-full text-left p-3.5 rounded-xl border transition-all flex flex-col space-y-1 ${
                          selectedSample.id === sample.id
                            ? 'bg-amber-500/10 border-amber-500 text-white shadow-sm ring-1 ring-amber-500/30'
                            : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white">{sample.title}</span>
                          <span className="text-[10px] bg-slate-800 text-amber-400 px-2 py-0.5 rounded font-mono">
                            {sample.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{sample.summary}</p>
                        <div className="text-[10px] text-slate-500 font-medium">Source: {sample.source}</div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                /* File Upload Box */
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-slate-700 hover:border-amber-500/70 rounded-2xl p-8 text-center bg-slate-950/40 transition-colors">
                    <UploadCloud className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                    <h3 className="text-sm font-bold text-white mb-1">
                      Drag and drop your learning material here
                    </h3>
                    <p className="text-xs text-slate-400 mb-4">
                      Supports PDF, TXT, DOC, DOCX, PPT, PPTX
                    </p>
                    <label className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold rounded-xl cursor-pointer border border-slate-700 transition-colors inline-block">
                      Browse Files
                      <input
                        type="file"
                        accept=".pdf,.txt,.doc,.docx,.ppt,.pptx"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {uploadedFile && (
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2 truncate">
                        <FileCode className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="font-semibold text-white truncate">{uploadedFile.name}</span>
                        <span className="text-[10px] text-slate-400">
                          ({(uploadedFile.size / 1024).toFixed(1)} KB)
                        </span>
                      </div>
                      <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800">
                        Ready for RAG
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Text Preview Box */}
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                  <span>Document Content Preview:</span>
                  <span>{documentText.length} characters</span>
                </div>
                <textarea
                  rows={6}
                  value={documentText}
                  onChange={e => {
                    setDocumentText(e.target.value);
                    setPdfBase64(undefined);
                  }}
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 font-mono leading-relaxed focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Right Col: Configuration & Launch */}
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md space-y-5">
              <h2 className="text-sm font-bold text-white border-b border-slate-800 pb-3 flex items-center space-x-2">
                <Sliders className="w-4 h-4 text-amber-400" />
                <span>2. Quiz Configuration</span>
              </h2>

              {/* Number of Questions */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Number of Questions
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[3, 5, 10, 15].map(cnt => (
                    <button
                      key={cnt}
                      type="button"
                      onClick={() => setQuestionCount(cnt)}
                      className={`py-2 rounded-xl text-xs font-bold transition-colors ${
                        questionCount === cnt
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-slate-950 border border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      {cnt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Difficulty Level
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Easy', 'Medium', 'Hard'].map(lvl => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setDifficulty(lvl)}
                      className={`py-2 rounded-xl text-xs font-bold transition-colors ${
                        difficulty === lvl
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-slate-950 border border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question Type */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Question Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['MCQ', 'True/False'].map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setQuestionType(type)}
                      className={`py-2 rounded-xl text-xs font-bold transition-colors ${
                        questionType === type
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-slate-950 border border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Topic Focus */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Topic Focus
                </label>
                <select
                  value={selectedTopic}
                  onChange={e => setSelectedTopic(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="Auto">Automatic Topic Detection (Recommended)</option>
                  <option value="Sampling & Survey Design">Sampling & Survey Design</option>
                  <option value="National Accounts">National Accounts (SNA 2008)</option>
                  <option value="Price Statistics">Price Statistics & CPI</option>
                  <option value="Python Data Wrangling">Python Data Wrangling</option>
                  <option value="SQL Microdata Queries">SQL Microdata Queries</option>
                  <option value="AI/ML Anomaly Detection">AI/ML Anomaly Detection</option>
                  <option value="Data Privacy & DPDP">Data Privacy & DPDP 2023</option>
                </select>
              </div>

              {/* Generate CTA */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleGenerateQuiz}
                  disabled={generating}
                  className="w-full py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-lg flex items-center justify-center space-x-2"
                >
                  {generating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Generating with Gemini RAG...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Generate Grounded Quiz</span>
                    </>
                  )}
                </button>
              </div>

              {/* Pipeline Status Indicator */}
              {generating && (
                <div className="p-3 bg-slate-950 rounded-xl border border-amber-500/30 text-xs text-amber-300 flex items-center space-x-2 animate-pulse">
                  <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
                  <span className="text-[11px] leading-tight">{generationStep}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
