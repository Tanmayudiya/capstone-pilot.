"use client";

import { useState } from "react";
import type { ProjectIdea } from "@/lib/validation";

export default function ProjectWorkspace() {
  const [loading, setLoading] = useState(false);
  const [ideas, setIdeas] = useState<ProjectIdea[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const [domains, setDomains] = useState(["AI/ML"]);
  const [skills, setSkills] = useState(["Python", "React"]);
  const [teamSize, setTeamSize] = useState(3);
  const [durationWeeks, setDurationWeeks] = useState(12);
  const [targetOutcome, setTargetOutcome] = useState("MVP");

  const generate = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/generate-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domains, skills, teamSize, durationWeeks, targetOutcome })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setIdeas(data.ideas);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 w-full max-w-6xl mx-auto p-4">
      {/* Intake Wizard */}
      <div className="w-full md:w-1/3 bg-slate-900 text-white p-6 rounded-xl border border-slate-800 shadow-xl">
        <h2 className="text-xl font-bold mb-4">Project Parameters</h2>
        <div className="space-y-4 text-sm">
          <div>
            <label className="block text-slate-400 mb-1">Domains (comma separated)</label>
            <input aria-label="Domains" type="text" value={domains.join(", ")} onChange={(e) => setDomains(e.target.value.split(",").map(s => s.trim()))} className="w-full bg-slate-800 border border-slate-700 rounded p-2" />
          </div>
          <div>
            <label className="block text-slate-400 mb-1">Skills (comma separated)</label>
            <input aria-label="Skills" type="text" value={skills.join(", ")} onChange={(e) => setSkills(e.target.value.split(",").map(s => s.trim()))} className="w-full bg-slate-800 border border-slate-700 rounded p-2" />
          </div>
          <div>
            <label className="block text-slate-400 mb-1">Team Size: {teamSize}</label>
            <input aria-label="Team Size" type="range" min="1" max="4" value={teamSize} onChange={(e) => setTeamSize(parseInt(e.target.value))} className="w-full" />
          </div>
          <div>
            <label className="block text-slate-400 mb-1">Duration: {durationWeeks} weeks</label>
            <input aria-label="Duration" type="range" min="4" max="16" value={durationWeeks} onChange={(e) => setDurationWeeks(parseInt(e.target.value))} className="w-full" />
          </div>
          <button 
            onClick={generate}
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-colors mt-6"
          >
            {loading ? "Generating..." : "Generate Proposals"}
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="w-full md:w-2/3 space-y-6">
        {error && <div className="bg-red-900/50 text-red-200 p-4 rounded-lg border border-red-800" role="alert">{error}</div>}
        {!loading && ideas.length === 0 && !error && (
          <div className="flex items-center justify-center h-full text-slate-500 border-2 border-dashed border-slate-700 rounded-xl">
            Submit the form to generate project ideas.
          </div>
        )}
        
        {loading && (
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 bg-slate-800 rounded-xl border border-slate-700"></div>
            ))}
          </div>
        )}

        {!loading && ideas.map((idea, idx) => (
          <div key={idx} className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-xl space-y-4">
            <div className="flex justify-between items-start">
              <h3 className="text-2xl font-bold text-white">{idea.title}</h3>
              <div className="flex gap-2">
                <span className="bg-indigo-900/50 text-indigo-300 px-3 py-1 rounded-full text-xs font-medium">Novelty: {idea.noveltyScore}</span>
                <span className="bg-emerald-900/50 text-emerald-300 px-3 py-1 rounded-full text-xs font-medium">Feasible: {idea.feasibilityScore}</span>
              </div>
            </div>
            <p className="text-slate-300 italic">{idea.tagline}</p>
            <p className="text-slate-400 text-sm leading-relaxed">{idea.problemStatement}</p>
            
            <div className="flex flex-wrap gap-2 pt-2">
              {idea.techStack.map((tech, i) => (
                <span key={i} className="bg-slate-800 text-slate-300 px-2 py-1 rounded text-xs">{tech}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
