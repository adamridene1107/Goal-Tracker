import { useState } from "react"
import { Search, ExternalLink, Star } from "lucide-react"

const FAV_KEY = "goaltracker_favs"
const loadFavs = () => { try { return JSON.parse(localStorage.getItem(FAV_KEY) || "[]") } catch { return [] } }
const saveFavs = f => localStorage.setItem(FAV_KEY, JSON.stringify(f))

const RESOURCES_BY_GOAL = {
  homework: {
    types: { lecon:"Leçon", qcm:"QCM", video:"Vidéo", pratique:"Pratique" },
    subjects: [
      { id:"maths", label:"Mathématiques", emoji:"📐", resources:[
        { id:"m1", title:"Khan Academy – Maths", desc:"Leçons et exercices interactifs", url:"https://fr.khanacademy.org/", type:"lecon" },
        { id:"m2", title:"Maths et Tiques", desc:"Exercices corrigés", url:"https://www.maths-et-tiques.fr/", type:"qcm" },
      ]},
      { id:"francais", label:"Français", emoji:"📝", resources:[
        { id:"f1", title:"LeConjugueur", desc:"Conjugaison facile et rapide", url:"https://www.leconjugueur.com/", type:"pratique" },
        { id:"f2", title:"Bescherelle", desc:"Orthographe et grammaire", url:"https://www.bescherelle.com/", type:"lecon" },
      ]},
      { id:"histoire", label:"Histoire", emoji:"🏛️", resources:[
        { id:"h1", title:"Histoire pour tous", desc:"Résumés et fiches de cours", url:"https://www.histoire-pour-tous.fr/", type:"lecon" },
      ]},
      { id:"sciences", label:"Sciences", emoji:"🔬", resources:[
        { id:"s1", title:"Cité des Sciences", desc:"Biologie & Physique", url:"https://www.cite-sciences.fr/", type:"lecon" },
        { id:"s2", title:"Futura Sciences", desc:"Articles et vidéos scientifiques", url:"https://www.futura-sciences.com/", type:"video" },
      ]},
      { id:"anglais", label:"Anglais", emoji:"🇬🇧", resources:[
        { id:"a1", title:"BBC Learning English", desc:"Exercices et podcasts", url:"https://www.bbc.co.uk/learningenglish", type:"pratique" },
        { id:"a2", title:"Duolingo", desc:"Plateforme interactive", url:"https://www.duolingo.com/", type:"pratique" },
      ]},
      { id:"espagnol", label:"Espagnol", emoji:"🇪🇸", resources:[
        { id:"e1", title:"Duolingo – Espagnol", desc:"Apprendre l'espagnol en jouant", url:"https://www.duolingo.com/", type:"pratique" },
        { id:"e2", title:"Cervantes – Espagnol", desc:"Ressources officielles espagnol", url:"https://www.cervantes.es/", type:"lecon" },
      ]},
    ]
  },
  creative: {
    types: { tuto:"Tutoriel", inspiration:"Inspiration", outil:"Outil", cours:"Cours" },
    subjects: [
      { id:"dessin", label:"Dessin & Illustration", emoji:"🎨", resources:[
        { id:"d1", title:"Proko – Dessin", desc:"Tutoriels anatomie et figure humaine", url:"https://www.proko.com/", type:"tuto" },
        { id:"d2", title:"Ctrl+Paint", desc:"Peinture numérique gratuite", url:"https://www.ctrlpaint.com/", type:"cours" },
      ]},
      { id:"musique", label:"Musique", emoji:"🎵", resources:[
        { id:"mu1", title:"Musicca", desc:"Théorie musicale interactive", url:"https://musicca.com/", type:"cours" },
        { id:"mu2", title:"Ultimate Guitar", desc:"Accords et tablatures", url:"https://www.ultimate-guitar.com/", type:"pratique" },
      ]},
      { id:"video", label:"Vidéo & Montage", emoji:"🎬", resources:[
        { id:"v1", title:"DaVinci Resolve Tutos", desc:"Montage vidéo gratuit", url:"https://www.youtube.com/results?search_query=davinci+resolve+tutoriel", type:"tuto" },
        { id:"v2", title:"Canva", desc:"Créer des visuels facilement", url:"https://www.canva.com/", type:"outil" },
      ]},
      { id:"code", label:"Code créatif", emoji:"💻", resources:[
        { id:"c1", title:"p5.js", desc:"Programmation créative et art génératif", url:"https://p5js.org/", type:"outil" },
        { id:"c2", title:"OpenProcessing", desc:"Galerie et inspiration code créatif", url:"https://openprocessing.org/", type:"inspiration" },
      ]},
    ]
  },
  organization: {
    types: { methode:"Méthode", outil:"Outil", template:"Template", guide:"Guide" },
    subjects: [
      { id:"planning", label:"Planning & Agenda", emoji:"📅", resources:[
        { id:"p1", title:"Notion", desc:"Outil tout-en-un pour s'organiser", url:"https://www.notion.so/", type:"outil" },
        { id:"p2", title:"Todoist", desc:"Gestionnaire de tâches simple", url:"https://todoist.com/", type:"outil" },
      ]},
      { id:"productivite", label:"Productivité", emoji:"⚡", resources:[
        { id:"pr1", title:"Technique Pomodoro", desc:"Méthode de travail par intervalles", url:"https://fr.wikipedia.org/wiki/Technique_Pomodoro", type:"methode" },
        { id:"pr2", title:"Getting Things Done", desc:"Méthode GTD expliquée", url:"https://gettingthingsdone.com/", type:"methode" },
      ]},
      { id:"finances", label:"Finances perso", emoji:"💰", resources:[
        { id:"fi1", title:"YNAB", desc:"Budget et gestion financière", url:"https://www.ynab.com/", type:"outil" },
        { id:"fi2", title:"Budget Insight", desc:"Conseils budget personnel", url:"https://www.budget-insight.com/", type:"guide" },
      ]},
    ]
  },
  sport: {
    types: { programme:"Programme", tuto:"Tutoriel", nutrition:"Nutrition", suivi:"Suivi" },
    subjects: [
      { id:"cardio", label:"Cardio & Running", emoji:"🏃", resources:[
        { id:"ca1", title:"Nike Run Club", desc:"Plans d'entraînement running", url:"https://www.nike.com/fr/nrc-app", type:"programme" },
        { id:"ca2", title:"Strava", desc:"Suivi de tes activités sportives", url:"https://www.strava.com/", type:"suivi" },
        { id:"ca3", title:"Garmin Connect", desc:"Suivi GPS et analyse de performance", url:"https://connect.garmin.com/", type:"suivi" },
        { id:"ca4", title:"Runkeeper", desc:"Coaching running personnalisé", url:"https://runkeeper.com/", type:"programme" },
      ]},
      { id:"muscu", label:"Musculation", emoji:"💪", resources:[
        { id:"ms1", title:"Jefit", desc:"Programmes muscu et suivi", url:"https://www.jefit.com/", type:"programme" },
        { id:"ms2", title:"Athlean-X", desc:"Tutoriels musculation scientifiques", url:"https://athleanx.com/", type:"tuto" },
        { id:"ms3", title:"StrengthLog", desc:"Journal d'entraînement gratuit", url:"https://www.strengthlog.com/", type:"suivi" },
        { id:"ms4", title:"Jeff Nippard", desc:"Programmes basés sur la science", url:"https://www.youtube.com/@JeffNippard", type:"tuto" },
      ]},
      { id:"yoga", label:"Yoga & Stretching", emoji:"🧘", resources:[
        { id:"y1", title:"Yoga with Adriene", desc:"Séances yoga gratuites YouTube", url:"https://www.youtube.com/@yogawithadriene", type:"tuto" },
        { id:"y2", title:"Down Dog", desc:"App yoga personnalisée", url:"https://www.downdogapp.com/", type:"programme" },
        { id:"y3", title:"Stretching Daily", desc:"Routines d'étirements guidées", url:"https://www.youtube.com/results?search_query=stretching+daily+routine", type:"tuto" },
      ]},
      { id:"hiit", label:"HIIT & CrossFit", emoji:"��", resources:[
        { id:"h1", title:"HASfit", desc:"Entraînements HIIT gratuits", url:"https://hasfit.com/", type:"programme" },
        { id:"h2", title:"CrossFit HQ", desc:"WODs et tutoriels CrossFit officiels", url:"https://www.crossfit.com/", type:"tuto" },
        { id:"h3", title:"FitOn", desc:"App HIIT et cardio gratuite", url:"https://fitonapp.com/", type:"programme" },
      ]},
      { id:"natation", label:"Natation & Sports aquatiques", emoji:"🏊", resources:[
        { id:"sw1", title:"MySwimPro", desc:"Plans d'entraînement natation", url:"https://myswimpro.com/", type:"programme" },
        { id:"sw2", title:"Swimrankings", desc:"Suivi et classements natation", url:"https://www.swimrankings.net/", type:"suivi" },
      ]},
      { id:"recuperation", label:"Récupération & Sommeil", emoji:"😴", resources:[
        { id:"r1", title:"Whoop", desc:"Suivi récupération et sommeil", url:"https://www.whoop.com/", type:"suivi" },
        { id:"r2", title:"Headspace Sport", desc:"Méditation et récupération mentale", url:"https://www.headspace.com/", type:"programme" },
        { id:"r3", title:"Therabody", desc:"Conseils récupération musculaire", url:"https://www.therabody.com/", type:"tuto" },
      ]},
      { id:"nutrition", label:"Nutrition & Alimentation", emoji:"🥗", resources:[
        { id:"n1", title:"Eat This Much", desc:"Planificateur de repas selon tes macros", url:"https://www.eatthismuch.com/", type:"nutrition" },
        { id:"n2", title:"Healthline – Nutrition", desc:"Articles et conseils nutrition scientifiques", url:"https://www.healthline.com/nutrition", type:"nutrition" },
        { id:"n3", title:"Cronometer", desc:"Suivi détaillé des micronutriments", url:"https://cronometer.com/", type:"suivi" },
      ]},
      { id:"outils-nutrition", label:"Applications & Outils", emoji:"📱", resources:[
        { id:"no1", title:"MyFitnessPal", desc:"Suivi calories et macros", url:"https://www.myfitnesspal.com/", type:"suivi" },
        { id:"no2", title:"Yazio", desc:"Plan alimentaire personnalisé", url:"https://www.yazio.com/", type:"nutrition" },
        { id:"no3", title:"MacroFactor", desc:"Coach nutrition adaptatif basé sur tes données", url:"https://macrofactorapp.com/", type:"suivi" },
      ]},
    ]
  },
}

const TYPE_COLORS = {
  lecon:"bg-blue-500/10 text-blue-400", qcm:"bg-purple-500/10 text-purple-400",
  video:"bg-red-500/10 text-red-400", pratique:"bg-emerald-500/10 text-emerald-400",
  tuto:"bg-amber-500/10 text-amber-400", inspiration:"bg-pink-500/10 text-pink-400",
  outil:"bg-sky-500/10 text-sky-400", cours:"bg-violet-500/10 text-violet-400",
  methode:"bg-orange-500/10 text-orange-400", template:"bg-teal-500/10 text-teal-400",
  guide:"bg-cyan-500/10 text-cyan-400", programme:"bg-green-500/10 text-green-400",
  nutrition:"bg-lime-500/10 text-lime-400", suivi:"bg-indigo-500/10 text-indigo-400",
}

export default function Resources({ goalId = "homework" }) {
  const config = RESOURCES_BY_GOAL[goalId] || RESOURCES_BY_GOAL.homework
  const { types, subjects } = config

  const [search, setSearch] = useState("")
  const [activeSubject, setActiveSubject] = useState("all")
  const [activeType, setActiveType] = useState("all")
  const [showFavsOnly, setShowFavsOnly] = useState(false)
  const [favs, setFavs] = useState(loadFavs)

  const toggleFav = (id) => {
    const next = favs.includes(id) ? favs.filter(f => f !== id) : [...favs, id]
    setFavs(next); saveFavs(next)
  }

  const allResources = subjects.flatMap(s => s.resources.map(r => ({ ...r, subjectId: s.id, subjectLabel: s.label })))
  const favResources = allResources.filter(r => favs.includes(r.id))

  const filtered = subjects.map(s => ({
    ...s,
    resources: s.resources.filter(r =>
      (activeSubject === "all" || activeSubject === s.id) &&
      (activeType === "all" || r.type === activeType) &&
      (search === "" || r.title.toLowerCase().includes(search.toLowerCase()) || r.desc.toLowerCase().includes(search.toLowerCase()))
    )
  })).filter(s => s.resources.length > 0)

  return (
    <div className="space-y-3 fade-in">
      <div className="card">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-white font-bold text-lg">Ressources</h2>
            <p className="text-white/50 text-xs mt-0.5">Liens et outils utiles</p>
          </div>
          {favResources.length > 0 && (
            <button onClick={() => setShowFavsOnly(!showFavsOnly)}
              className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full transition-all ${
                showFavsOnly ? "bg-white text-black" : "bg-white/[0.06] text-white/40 hover:text-white/70"
              }`}>
              <Star size={12} className={showFavsOnly ? "fill-black" : ""}/> {favResources.length}
            </button>
          )}
        </div>
      </div>

      {showFavsOnly && favResources.length > 0 && (
        <div className="card space-y-1.5">
          <p className="text-white/50 text-xs font-medium uppercase tracking-wider mb-3">Favoris</p>
          {favResources.map(r => (
            <a key={r.id} href={r.url} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-xl border border-white/[0.06] hover:border-white/20 transition-all group">
              <div className="flex-1 min-w-0">
                <p className="text-white/80 text-sm font-medium">{r.title}</p>
                <p className="text-white/50 text-xs mt-0.5">{r.subjectLabel}</p>
              </div>
              <ExternalLink size={13} className="text-white/40 group-hover:text-white/50 flex-shrink-0" />
            </a>
          ))}
        </div>
      )}

      <div className="card space-y-3">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher..." className="input pl-9 w-full" />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setActiveSubject("all")} className={`pill ${activeSubject==="all"?"pill-active":"pill-inactive"}`}>Tous</button>
          {subjects.map(s => (
            <button key={s.id} onClick={() => setActiveSubject(activeSubject===s.id?"all":s.id)}
              className={`pill ${activeSubject===s.id?"pill-active":"pill-inactive"}`}>
              {s.emoji} {s.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2 flex-wrap border-t border-white/[0.06] pt-3">
          <button onClick={() => setActiveType("all")} className={`pill ${activeType==="all"?"pill-active":"pill-inactive"}`}>Tous</button>
          {Object.entries(types).map(([v,l]) => (
            <button key={v} onClick={() => setActiveType(activeType===v?"all":v)}
              className={`pill ${activeType===v?"pill-active":"pill-inactive"}`}>
              {l}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card text-center py-10 text-white/40 text-sm">Aucune ressource trouvée.</div>
      ) : filtered.map(subject => (
        <div key={subject.id} className="card">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-base">{subject.emoji}</span>
            <h3 className="text-white/70 text-sm font-semibold">{subject.label}</h3>
            <span className="ml-auto text-white/40 text-xs">{subject.resources.length} lien{subject.resources.length>1?"s":""}</span>
          </div>
          <div className="space-y-1.5">
            {subject.resources.map(r => (
              <div key={r.id} className="flex items-center gap-2">
                <a href={r.url} target="_blank" rel="noopener noreferrer"
                  className="flex-1 flex items-start gap-3 p-3 rounded-xl border border-white/[0.06] hover:border-white/20 transition-all group min-w-0">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-white/80 text-sm font-medium">{r.title}</p>
                      <span className={`badge text-[10px] ${TYPE_COLORS[r.type]||""}`}>{types[r.type]}</span>
                    </div>
                    <p className="text-white/50 text-xs mt-0.5">{r.desc}</p>
                  </div>
                  <ExternalLink size={13} className="text-white/40 group-hover:text-white/50 flex-shrink-0 mt-0.5" />
                </a>
                <button onClick={() => toggleFav(r.id)} className="p-2 rounded-xl hover:bg-white/[0.06] transition-colors flex-shrink-0">
                  <Star size={14} className={favs.includes(r.id) ? "fill-white text-white" : "text-white/40"} />
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}