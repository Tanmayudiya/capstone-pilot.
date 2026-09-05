import ProjectWorkspace from "@/components/generator/ProjectWorkspace";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <header className="border-b border-slate-800 bg-slate-900">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              CapstonePilot
            </h1>
            <p className="text-sm text-slate-500 mt-1">PromptWars x Parul University Hackathon</p>
          </div>
        </div>
      </header>

      <main className="py-12">
        <ProjectWorkspace />
      </main>
    </div>
  );
}
