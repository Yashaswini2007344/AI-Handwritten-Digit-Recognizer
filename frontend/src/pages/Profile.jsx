
import {
  UserRound,
  GraduationCap,
  Code2,
  Brain,
  Target,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";

export default function Profile({ setActivePage }) {
  return (
    <div className="page-section profile-page">

      {/* BACK TO DASHBOARD */}
      <button
        type="button"
        className="btn ghost"
        onClick={() => setActivePage("dashboard")}
      >
        <ArrowLeft size={18} />
        Back to Dashboard
      </button>

      {/* PROFILE PAGE LOGO */}
      <div
        style={{
          width: "58px",
          height: "58px",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          marginTop: "28px",
          marginBottom: "13px",
          color: "#e2e8f0",
        }}
      >
        <UserRound
          size={46}
          strokeWidth={1.7}
        />
      </div>

      <div className="profile-hero">

        <div className="profile-avatar">
          A
        </div>

        <div className="profile-main-info">
          <span className="eyebrow">
            STUDENT PROFILE
          </span>

          <h1>Ankita Ghadage</h1>

          <p>
            B.Sc. Artificial Intelligence • 3rd Year
          </p>

          <div className="profile-tags">
            <span>
              <CheckCircle2 size={14} />
              Frontend Member
            </span>

            <span>
              <Brain size={14} />
              AI Project
            </span>
          </div>
        </div>

      </div>


      <div className="profile-grid">

        <div className="profile-info-card">
          <div className="profile-card-icon">
            <UserRound size={20} />
          </div>

          <div>
            <b>Role</b>

            <span>
              Frontend / Project Member
            </span>
          </div>
        </div>


        <div className="profile-info-card">
          <div className="profile-card-icon">
            <GraduationCap size={20} />
          </div>

          <div>
            <b>Education</b>

            <span>
              B.Sc. Artificial Intelligence
              <br />
              3rd Year
            </span>
          </div>
        </div>


        <div className="profile-info-card">
          <div className="profile-card-icon">
            <Brain size={20} />
          </div>

          <div>
            <b>Project</b>

            <span>
              AI Handwritten Digit Recognizer
            </span>
          </div>
        </div>


        <div className="profile-info-card">
          <div className="profile-card-icon">
            <Code2 size={20} />
          </div>

          <div>
            <b>Technology</b>

            <span>
              React, Vite, Python, Flask,
              AI / ML
            </span>
          </div>
        </div>

      </div>


      <div className="profile-about">

        <div className="profile-about-heading">

          <Target size={21} />

          <div>
            <span className="eyebrow">
              PROJECT GOAL
            </span>

            <h2>
              Making handwritten information useful
            </h2>
          </div>

        </div>

        <p>
          The goal of this project is to convert
          handwritten information into digital data
          using Artificial Intelligence and Machine
          Learning. The system is designed to start
          with handwritten digits and gradually expand
          toward characters, words, complete text and
          intelligent document understanding.
        </p>

      </div>

    </div>
  );
}

