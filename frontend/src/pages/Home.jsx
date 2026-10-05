import { 
  Hash, 
  Type, 
  AlignLeft, 
  FileText, 
  Activity, 
  ArrowRight, 
  CheckCircle2, 
  Server, 
  Brain, 
  Building2, 
  HeartPulse, 
  GraduationCap, 
  ShoppingBag, 
  Truck, 
  Landmark, 
  Sparkles, 
  Camera, 
  Languages, 
  Volume2, 
  FileSearch, 
  Cloud, 
  Bot, 
  ScanText, 
  ShieldCheck, 
  WandSparkles, 
} from "lucide-react"; 
 
const recognitionCards = [ 
  { 
    id: "digit", 
    title: "Digit Recognition", 
    description: "Recognize handwritten numbers from 0 to 9.", 
    icon: Hash, 
    color: "orange", 
    status: "Core Feature", 
  }, 
  { 
    id: "character", 
    title: "Character Recognition", 
    description: "Recognize individual handwritten A-Z characters.", 
    icon: Type, 
    color: "blue", 
    status: "AI Feature", 
  }, 
  { 
    id: "word", 
    title: "Word Recognition", 
    description: "Convert handwritten words into digital text.", 
    icon: AlignLeft, 
    color: "purple", 
    status: "Advanced", 
  }, 
  { 
    id: "text", 
    title: "Text Recognition", 
    description: "Understand complete handwritten text and notes.", 
    icon: FileText, 
    color: "green", 
    status: "Advanced", 
  }, 
]; 
 
const applications = [ 
  { 
    icon: Building2, 
    title: "Banking & Financial Forms", 
    use: "Read handwritten account numbers, forms and financial entries.", 
    example: "A bank can scan a handwritten account-opening form and extract the customer's written information.", 
  }, 
  { 
    icon: HeartPulse, 
    title: "Hospital & Medical Records", 
    use: "Digitize handwritten patient notes and medical information.", 
    example: "A hospital can convert a doctor's handwritten patient notes into searchable digital records.", 
  }, 
  { 
    icon: GraduationCap, 
    title: "Education & Answer Sheets", 
    use: "Convert handwritten answers and academic records into digital text.", 
    example: "A teacher can scan handwritten answer sheets and organize the written information digitally.", 
  }, 
  { 
    icon: ShoppingBag, 
    title: "Shops & Business Records", 
    use: "Digitize handwritten bills, stock entries and customer records.", 
    example: "A shopkeeper can scan a handwritten stock register and convert product entries into digital records.", 
  }, 
  { 
    icon: Truck, 
    title: "Courier & Delivery", 
    use: "Recognize handwritten delivery details and addresses.", 
    example: "A courier company can scan a handwritten parcel address and convert it into digital delivery information.", 
  }, 
  { 
    icon: Landmark, 
    title: "Government Forms", 
    use: "Digitize handwritten government documents and forms.", 
    example: "A government office can scan handwritten application forms and store the information in a digital database.", 
  }, 
]; 
 
const advancedFeatures = [ 
  { 
    icon: Camera, 
    title: "Camera Recognition", 
    text: "Recognize handwriting directly from a camera image.", 
    action: "camera", 
  }, 
  { 
    icon: Languages, 
    title: "Marathi + Hindi + English", 
    text: "Recognize handwritten content in Marathi, Hindi and English.", 
    action: "multilingual", 
  }, 
  { 
    icon: Volume2, 
    title: "Handwriting to Speech", 
    text: "Convert recognized handwriting into spoken output.", 
    action: "speech", 
  }, 
  { 
    icon: FileSearch, 
    title: "Notebook Digitization", 
    text: "Convert handwritten notebooks and notes into searchable digital content.", 
    action: "notebook", 
  }, 
  { 
    icon: Cloud, 
    title: "Cloud Processing", 
    text: "Process larger handwriting documents using cloud-based AI.", 
    action: "cloud", 
  }, 
  { 
    icon: Bot, 
    title: "AI Document Assistant", 
    text: "Understand recognized information and provide useful assistance.", 
    action: "assistant", 
  }, 
  { 
    icon: FileSearch, 
    title: "Search Handwritten Documents", 
    text: "Search for information inside digitized handwritten documents.", 
    action: "search-documents", 
  }, 
  { 
    icon: ShieldCheck, 
    title: "Privacy-Preserving AI", 
    text: "Process sensitive handwriting with privacy-focused AI.", 
    action: "privacy-ai", 
  }, 
]; 
 
const futureScope = [ 
  { 
    icon: WandSparkles, 
    title: "Real-time Smart Writing Assistant", 
    text: "AI can recognize handwriting while the user is writing.", 
  }, 
  { 
    icon: Brain, 
    title: "Personalized Handwriting AI", 
    text: "The system can learn different handwriting styles.", 
  }, 
  { 
    icon: ScanText, 
    title: "Automatic Handwritten Form Filling", 
    text: "Recognized information can be used to fill digital forms.", 
  }, 
  { 
    icon: FileText, 
    title: "Historical Document AI", 
    text: "Old handwritten documents can be digitized and preserved.", 
  }, 
  { 
    icon: Sparkles, 
    title: "Multimodal Document Understanding", 
    text: "AI can understand handwriting, printed text, tables and diagrams together.", 
  }, 
  { 
    icon: ShieldCheck, 
    title: "Privacy-Preserving AI", 
    text: "Future models can process sensitive handwriting locally.", 
  }, 
]; 
 
function FeatureCard({ item, onOpen }) { 
  const Icon = item.icon; 
 
  return ( 
    <button 
      type="button" 
      className={`recognition-card ${item.color}`} 
      onClick={() => onOpen(item.id)} 
    > 
      <div className="recognition-card-top"> 
        <div className="feature-icon"> 
          <Icon size={21} /> 
        </div> 
 
        <span className="feature-status"> 
          {item.status} 
        </span> 
      </div> 
 
      <h3>{item.title}</h3> 
 
      <p>{item.description}</p> 
 
      <span className="card-action"> 
        Open Recognition 
        <ArrowRight size={15} /> 
      </span> 
    </button> 
  ); 
} 
 
function InfoCard({ item, onOpen }) { 
  const Icon = item.icon; 
 
  const content = ( 
    <> 
      <div className="info-feature-icon"> 
        <Icon size={19} /> 
      </div> 
 
      <div> 
        <h3>{item.title}</h3> 
 
        {item.use ? ( 
          <> 
            <p> 
              <strong>Use:</strong> {item.use} 
            </p> 
            <p> 
              <strong>Example:</strong> {item.example} 
            </p> 
          </> 
        ) : ( 
          <p>{item.text}</p> 
        )} 
      </div> 
    </> 
  ); 
 
  if (onOpen) { 
    return ( 
      <button 
        type="button" 
        className="info-feature-card" 
        onClick={() => onOpen(item.action)} 
      > 
        {content} 
      </button> 
    ); 
  } 
 
  return ( 
    <div className="info-feature-card"> 
      {content} 
    </div> 
  ); 
} 
 
export default function Home({ 
  setActivePage, 
  file, 
  result, 
}) { 
  const totalPredictions = Number( 
    localStorage.getItem("ai-handwriting-history") 
      ? JSON.parse( 
          localStorage.getItem( 
            "ai-handwriting-history" 
          ) 
        ).length 
      : 0 
  ); 
 
  const openRecognition = (page) => { 
    setActivePage(page); 
  }; 
 
  return ( 
    <div className="home-page"> 

      {/* ONLY COLOR FIX FOR ADVANCED FEATURE NAMES */}
      <style>
        {`
          .info-feature-card h3 {
            color: #f8fafc !important;
          }
        `}
      </style>

      {/* HERO */} 
      <section className="hero-section"> 
        <div className="hero-content"> 
          <span className="eyebrow"> 
            AI HANDWRITING RECOGNITION 
          </span> 
 
          <h1> 
            Turn Handwriting 
            <br /> 
            Into <span>Intelligent Data.</span> 
          </h1> 
 
          <p> 
            An AI-powered platform designed to recognize 
            handwritten digits, characters, words and 
            complete text — and transform them into 
            useful digital information. 
          </p> 
 
          <div className="hero-actions"> 
            <button 
              type="button" 
              className="btn primary" 
              onClick={() => setActivePage("digit")} 
            > 
              <Brain size={17} /> 
              Start Recognition 
            </button> 
 
            <button 
              type="button" 
              className="btn" 
              onClick={() => setActivePage("history")} 
            > 
              <Activity size={17} /> 
              View History 
            </button> 
          </div> 
 
          <div className="hero-points"> 
            <span> 
              <CheckCircle2 size={15} /> 
              React Frontend 
            </span> 
 
            <span> 
              <CheckCircle2 size={15} /> 
              Python + Flask Backend 
            </span> 
 
            <span> 
              <CheckCircle2 size={15} /> 
              AI / ML Recognition 
            </span> 
          </div> 
        </div> 
 
        <div className="hero-visual"> 
          <div className="ai-orb"> 
            <Brain size={62} /> 
          </div> 
 
          <div className="floating-card floating-one"> 
            <Hash size={17} /> 
            <div> 
              <b>Digit</b> 
              <small>0 — 9</small> 
            </div> 
          </div> 
 
          <div className="floating-card floating-two"> 
            <Type size={17} /> 
            <div> 
              <b>Character</b> 
              <small>A — Z</small> 
            </div> 
          </div> 
 
          <div className="floating-card floating-three"> 
            <FileText size={17} /> 
            <div> 
              <b>Text</b> 
              <small>AI Reading</small> 
            </div> 
          </div> 
        </div> 
      </section> 
 
      {/* RECOGNITION */} 
      <section className="dashboard-section"> 
        <div className="section-title-row"> 
          <div> 
            <span className="eyebrow"> 
              RECOGNITION MODES 
            </span> 
 
            <h2> 
              What can the AI recognize? 
            </h2> 
 
            <p> 
              Choose a recognition mode to start working 
              with handwritten information. 
            </p> 
          </div> 
        </div> 
 
        <div className="recognition-cards"> 
          {recognitionCards.map((item) => ( 
            <FeatureCard 
              key={item.id} 
              item={item} 
              onOpen={openRecognition} 
            /> 
          ))} 
        </div> 
      </section> 
 
      {/* QUICK STATS */} 
      <section className="dashboard-section"> 
        <div className="mini-dashboard-grid"> 
          <div className="dashboard-card statistics-card"> 
            <div className="dashboard-card-heading"> 
              <div> 
                <span className="eyebrow"> 
                  STATISTICS 
                </span> 
                <h3>Statistics Overview</h3> 
              </div> 
 
              <Activity size={20} /> 
            </div> 
 
            <div className="stats-number"> 
              {totalPredictions} 
            </div> 
 
            <p>Total predictions recorded</p> 
 
            <div className="stats-row"> 
              <div> 
                <b>0–9</b> 
                <span>Digits</span> 
              </div> 
 
              <div> 
                <b>A–Z</b> 
                <span>Characters</span> 
              </div> 
 
              <div> 
                <b>AI</b> 
                <span>Engine</span> 
              </div> 
            </div> 
          </div> 
 
          <div className="dashboard-card trend-card"> 
            <div className="dashboard-card-heading"> 
              <div> 
                <span className="eyebrow"> 
                  THIS WEEK 
                </span> 
                <h3>Prediction Trend</h3> 
              </div> 
 
              <span className="trend-label"> 
                Mon — Sun 
              </span> 
            </div> 
 
            <div className="trend-chart"> 
              {[28, 48, 35, 65, 52, 76, 58].map( 
                (height, index) => ( 
                  <div 
                    className="trend-column" 
                    key={index} 
                  > 
                    <div className="trend-bar-area"> 
                      <div 
                        className="trend-bar" 
                        style={{ 
                          height: `${height}%`, 
                        }} 
                      /> 
                    </div> 
 
                    <span> 
                      { 
                        [ 
                          "Mon", 
                          "Tue", 
                          "Wed", 
                          "Thu", 
                          "Fri", 
                          "Sat", 
                          "Sun", 
                        ][index] 
                      } 
                    </span> 
                  </div> 
                ) 
              )} 
            </div> 
          </div> 
 
          <div className="dashboard-card activity-card"> 
            <div className="dashboard-card-heading"> 
              <div> 
                <span className="eyebrow"> 
                  ACTIVITY 
                </span> 
                <h3>Recent Activity</h3> 
              </div> 
 
              <button 
                type="button" 
                className="text-button" 
                onClick={() => 
                  setActivePage("history") 
                } 
              > 
                View all 
              </button> 
            </div> 
 
            {result ? ( 
              <div className="activity-item"> 
                <div className="activity-icon"> 
                  <Hash size={17} /> 
                </div> 
 
                <div> 
                  <b> 
                    Prediction: {result.prediction} 
                  </b> 
 
                  <span> 
                    Confidence:{" "} 
                    {Number( 
                      result.confidence || 0 
                    ).toFixed(1)} 
                    % 
                  </span> 
                </div> 
              </div> 
            ) : ( 
              <> 
                <div className="activity-item"> 
                  <div className="activity-icon"> 
                    <Brain size={17} /> 
                  </div> 
 
                  <div> 
                    <b>AI Studio Ready</b> 
                    <span> 
                      Waiting for first prediction 
                    </span> 
                  </div> 
                </div> 
 
                <div className="activity-item"> 
                  <div className="activity-icon blue"> 
                    <FileText size={17} /> 
                  </div> 
 
                  <div> 
                    <b>Frontend Connected</b> 
                    <span> 
                      Dashboard is ready 
                    </span> 
                  </div> 
                </div> 
              </> 
            )} 
          </div> 
        </div> 
      </section> 
 
      {/* PROJECT INFORMATION */} 
      <section className="dashboard-section project-status-section"> 
        <div className="section-title-row"> 
          <div> 
            <span className="eyebrow"> 
              PROJECT INFORMATION 
            </span> 
 
            <h2> 
              What works and what does not? 
            </h2> 
 
            <p> 
              The frontend and AI backend are separate 
              parts of this project. 
            </p> 
          </div> 
        </div> 
 
        <div className="project-status-grid"> 
          <div className="project-status-card working"> 
            <div className="project-status-icon"> 
              <CheckCircle2 size={21} /> 
            </div> 
 
            <h3>Working Now — Frontend</h3> 
 
            <ul> 
              <li>Dashboard and navigation</li> 
              <li>Draw handwriting canvas</li> 
              <li>Image upload and clear</li> 
              <li>Prediction result interface</li> 
              <li>Confidence score display</li> 
              <li>Recognition history</li> 
              <li>History search and clear</li> 
              <li>Profile and analytics pages</li> 
              <li>Real-life applications information</li> 
              <li>Future scope information</li> 
            </ul> 
          </div> 
 
          <div className="project-status-card backend"> 
            <div className="project-status-icon"> 
              <Server size={21} /> 
            </div> 
 
            <h3> 
              Needs Python / Flask AI Backend 
            </h3> 
 
            <ul> 
              <li>Actual digit prediction</li> 
              <li>A-Z character recognition</li> 
              <li>Word recognition</li> 
              <li>Complete handwritten text recognition</li> 
              <li>Camera-based recognition</li> 
              <li>Marathi, Hindi and English recognition</li> 
              <li>Speech conversion</li> 
              <li>Document understanding</li> 
              <li>Cloud processing</li> 
              <li>AI document assistant</li> 
            </ul> 
          </div> 
 
          <div className="project-status-card limitation"> 
            <div className="project-status-icon"> 
              <Activity size={21} /> 
            </div> 
 
            <h3>Important Limitation</h3> 
 
            <p> 
              The React frontend cannot recognize 
              handwriting by itself. It prepares the 
              drawing or uploaded image and sends it to 
              the Python / Flask AI backend. 
            </p> 
 
            <p> 
              If the backend is not running, the project 
              should show a clear backend connection error 
              instead of displaying a fake AI prediction. 
            </p> 
          </div> 
        </div> 
      </section> 
 
      {/* ADVANCED CAPABILITIES */} 
      <section className="dashboard-section"> 
        <div className="section-title-row"> 
          <div> 
            <span className="eyebrow"> 
              ADVANCED CAPABILITIES 
            </span> 
 
            <h2> 
              Beyond basic digit recognition 
            </h2> 
 
            <p> 
              These features extend the project from a 
              digit recognizer into an intelligent 
              handwriting platform. 
            </p> 
          </div> 
        </div> 
 
        <div className="info-feature-grid"> 
          {advancedFeatures.map((item) => ( 
            <InfoCard 
              key={item.title} 
              item={item} 
              onOpen={ 
                item.action 
                  ? (page) => setActivePage(page) 
                  : undefined 
              } 
            /> 
          ))} 
        </div> 
      </section> 
 
      {/* REAL LIFE APPLICATIONS */} 
      <section className="dashboard-section"> 
        <div className="section-title-row"> 
          <div> 
            <span className="eyebrow"> 
              REAL-LIFE APPLICATIONS 
            </span> 
 
            <h2> 
              Where can this technology be used? 
            </h2> 
 
            <p> 
              Handwriting recognition can help convert 
              physical handwritten information into 
              searchable digital data. 
            </p> 
          </div> 
        </div> 
 
        <div className="info-feature-grid applications-grid"> 
          {applications.map((item) => ( 
            <InfoCard 
              key={item.title} 
              item={item} 
            /> 
          ))} 
        </div> 
      </section> 
 
      {/* FUTURE SCOPE */} 
      <section className="dashboard-section future-section"> 
        <div className="future-header"> 
          <div> 
            <span className="eyebrow"> 
              FUTURE SCOPE 
            </span> 
 
            <h2> 
              From handwriting recognition 
              to intelligent understanding 
            </h2> 
 
            <p> 
              The long-term vision is not only to read 
              handwriting, but to understand the information 
              and act on it. 
            </p> 
          </div> 
 
          <div className="future-badge"> 
            <Sparkles size={17} /> 
            AI Vision 
          </div> 
        </div> 
 
        <div className="future-grid"> 
          {futureScope.map((item) => ( 
            <InfoCard 
              key={item.title} 
              item={item} 
            /> 
          ))} 
        </div> 
 
        <div className="future-flow"> 
          <span>Digits</span> 
          <ArrowRight size={17} /> 
          <span>Characters</span> 
          <ArrowRight size={17} /> 
          <span>Words</span> 
          <ArrowRight size={17} /> 
          <span>Text</span> 
          <ArrowRight size={17} /> 
          <span>Documents</span> 
          <ArrowRight size={17} /> 
          <span>Intelligent AI</span> 
        </div> 
 
        <div className="future-statement"> 
          <Brain size={25} /> 
 
          <div> 
            <b> 
              AI doesn't just read handwriting. 
            </b> 
 
            <span> 
              It can understand handwriting and act on 
              the information. 
            </span> 
          </div> 
        </div> 
      </section> 
 
      {/* ROADMAP */} 
      <section className="dashboard-section roadmap-section"> 
        <div className="section-title-row"> 
          <div> 
            <span className="eyebrow"> 
              PROJECT ROADMAP 
            </span> 
 
            <h2> 
              Development journey 
            </h2> 
          </div> 
        </div> 
 
        <div className="roadmap"> 
          <div className="roadmap-step completed"> 
            <span>01</span> 
            <div> 
              <b>Frontend Foundation</b> 
              <small> 
                Dashboard, canvas, upload and navigation 
              </small> 
            </div> 
          </div> 
 
          <div className="roadmap-line" /> 
 
          <div className="roadmap-step active"> 
            <span>02</span> 
            <div> 
              <b>AI Backend Integration</b> 
              <small> 
                Flask API and trained recognition model 
              </small> 
            </div> 
          </div> 
 
          <div className="roadmap-line" /> 
 
          <div className="roadmap-step"> 
            <span>03</span> 
            <div> 
              <b>Multimodal Recognition</b> 
              <small> 
                Characters, words, text and documents 
              </small> 
            </div> 
          </div> 
 
          <div className="roadmap-line" /> 
 
          <div className="roadmap-step"> 
            <span>04</span> 
            <div> 
              <b>Intelligent Document AI</b> 
              <small> 
                Understanding, extraction and automation 
              </small> 
            </div> 
          </div> 
        </div> 
      </section> 
    </div> 
  ); 
}