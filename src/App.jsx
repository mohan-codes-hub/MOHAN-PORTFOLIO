
import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate
} from "react-router-dom";
import axios from "axios";
import "./App.css";

const API = import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? "http://localhost:8081/api" : "/api");

async function compressProfilePhoto(file) {
  if (!file || !file.type.startsWith("image/")) {
    throw new Error("Please choose an image file.");
  }

  const imageUrl = URL.createObjectURL(file);

  try {
    const image = await new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Unable to read this image."));
      img.src = imageUrl;
    });

    const maxDimension = 700;
    const scale = Math.min(
      1,
      maxDimension / Math.max(image.width, image.height)
    );

    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(image.width * scale));
    canvas.height = Math.max(1, Math.round(image.height * scale));

    const context = canvas.getContext("2d");
    context.drawImage(image, 0, 0, canvas.width, canvas.height);

    return canvas.toDataURL("image/jpeg", 0.72);
  } finally {
    URL.revokeObjectURL(imageUrl);
  }
}

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        MOHAN<span>.</span>
      </Link>

      <div className="nav-links">
        <a href="/#home">Home</a>
        <a href="/#about">About</a>
        <a href="/#skills">Skills</a>
        <a href="/#education">Education</a>
        <a href="/#projects">Projects</a>
        <a href="/#contact">Contact</a>
      </div>
    </nav>
  );
}

function Home() {
  const [profile, setProfile] = useState({});
  const [skills, setSkills] = useState([]);
  const [education, setEducation] = useState([]);
  const [projects, setProjects] = useState([]);

  const [contact, setContact] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const [status, setStatus] = useState("");

  useEffect(() => {
    Promise.all([
      axios.get(`${API}/profile`),
      axios.get(`${API}/skills`),
      axios.get(`${API}/education`),
      axios.get(`${API}/projects`)
    ])
      .then(([p, s, e, pr]) => {
        setProfile(
          p.data && typeof p.data === "object" && !Array.isArray(p.data)
            ? p.data
            : {}
        );

        setSkills(Array.isArray(s.data) ? s.data : []);
        setEducation(Array.isArray(e.data) ? e.data : []);
        setProjects(Array.isArray(pr.data) ? pr.data : []);
      })
      .catch((error) => {
        console.error("Portfolio loading error:", error);
      });
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();
    setStatus("");

    try {
      await axios.post(`${API}/contact`, contact);

      setStatus("Message sent successfully!");

      setContact({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
      });
    } catch (error) {
      console.error("Contact form error:", error);
      setStatus("Unable to send message. Please try again.");
    }
  };

  return (
    <>
      <Navbar />

      <section className="hero" id="home">
        <div className="hero-content">
          <p className="eyebrow">WELCOME TO MY PORTFOLIO</p>

          <h1>
            Hi, I'm <span>{profile.name || "Mohan"}</span>
          </h1>

          <h2>{profile.role || "Full Stack Developer"}</h2>

          <p>
            {profile.about || "Welcome to my personal portfolio website."}
          </p>

          <div className="hero-buttons">
            <a href="#projects" className="btn primary-btn">
              View Projects
            </a>

            <a href="#contact" className="btn outline-btn">
              Contact Me
            </a>
          </div>
        </div>

        {profile.photo && (
          <div className="profile-photo">
            <img
              src={profile.photo}
              alt={profile.name || "Profile"}
            />
          </div>
        )}
      </section>

      <section className="section about-section" id="about">
        <p className="eyebrow">GET TO KNOW ME</p>

        <h2 className="section-title">
          About Me<span>.</span>
        </h2>

        <p className="section-description">
          {profile.about || "About information will be added soon."}
        </p>

        <div className="about-details">
          {profile.email && (
            <p><strong>Email:</strong> {profile.email}</p>
          )}

          {profile.phone && (
            <p><strong>Phone:</strong> {profile.phone}</p>
          )}

          {profile.location && (
            <p><strong>Location:</strong> {profile.location}</p>
          )}
        </div>
      </section>

      <section className="section" id="skills">
        <p className="eyebrow">WHAT I KNOW</p>

        <h2 className="section-title">
          My Skills<span>.</span>
        </h2>

        <div className="card-grid">
          {skills.map((skill) => (
            <div className="info-card" key={skill._id}>
              <h3>{skill.name}</h3>
              {skill.category && <p>{skill.category}</p>}
            </div>
          ))}
        </div>

        {skills.length === 0 && (
          <p className="empty-text">Skills will be added soon.</p>
        )}
      </section>

      <section className="section education-section" id="education">
        <p className="eyebrow">MY QUALIFICATION</p>

        <h2 className="section-title">
          Education<span>.</span>
        </h2>

        <div className="card-grid">
          {education.map((item) => (
            <div className="info-card" key={item._id}>
              <h3>{item.degree}</h3>
              <p>{item.college}</p>
              <p>{item.year}</p>
              <p>{item.description}</p>
            </div>
          ))}
        </div>

        {education.length === 0 && (
          <p className="empty-text">
            Education details will be added soon.
          </p>
        )}
      </section>

      <section className="section" id="projects">
        <p className="eyebrow">MY RECENT WORK</p>

        <h2 className="section-title">
          My Projects<span>.</span>
        </h2>

        <div className="card-grid">
          {projects.map((project) => (
            <div className="project-card" key={project._id}>
              {project.image && (
                <img src={project.image} alt={project.title} />
              )}

              <div className="project-content">
                <h3>{project.title}</h3>
                <p>{project.description}</p>

                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View Project ↗
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {projects.length === 0 && (
          <p className="empty-text">Projects will be added soon.</p>
        )}
      </section>

      <section className="section contact-section" id="contact">
        <p className="eyebrow">LET'S CONNECT</p>

        <h2 className="section-title">
          Contact Me<span>.</span>
        </h2>

        <form className="contact-form" onSubmit={sendMessage}>
          <input
            type="text"
            placeholder="Your Name"
            value={contact.name}
            onChange={(e) =>
              setContact({ ...contact, name: e.target.value })
            }
            required
          />

          <input
            type="email"
            placeholder="Your Email"
            value={contact.email}
            onChange={(e) =>
              setContact({ ...contact, email: e.target.value })
            }
            required
          />

          <input
            type="tel"
            placeholder="Your Phone"
            value={contact.phone}
            onChange={(e) =>
              setContact({ ...contact, phone: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="Subject"
            value={contact.subject}
            onChange={(e) =>
              setContact({ ...contact, subject: e.target.value })
            }
          />

          <textarea
            placeholder="Your Message"
            rows="5"
            value={contact.message}
            onChange={(e) =>
              setContact({ ...contact, message: e.target.value })
            }
            required
          />

          <button className="btn primary-btn" type="submit">
            Send Message
          </button>

          {status && <p className="form-status">{status}</p>}
        </form>
      </section>

      <footer className="footer">
        <p>
          © {new Date().getFullYear()} {profile.name || "Mohan"}.
          All Rights Reserved.
        </p>

        <Link to="/admin" className="admin-link">
          Admin Login
        </Link>
      </footer>
    </>
  );
}

function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await axios.post(`${API}/auth/login`, {
        username: username.trim(),
        password
      });

      localStorage.setItem("adminToken", response.data.token);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);

      if (error.response) {
        setError(
          error.response.data?.message ||
          "Login failed. Check your username and password."
        );
      } else {
        setError(
          "Cannot reach the backend. Make sure the backend is running on port 8081."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={login}>
        <Link to="/" className="back-link">
          ← Back to Website
        </Link>

        <h1>
          Admin Login<span>.</span>
        </h1>

        <p>Sign in to manage your portfolio.</p>

        <label>Username</label>

        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username"
          required
        />

        <label>Password</label>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          required
        />

        {error && <p className="error-text">{error}</p>}

        <button
          className="btn primary-btn"
          type="submit"
          disabled={loading}
        >
          {loading ? "Please wait..." : "Login"}
        </button>
      </form>
    </div>
  );
}

function Dashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("adminToken");

  const [tab, setTab] = useState("profile");

  const [profile, setProfile] = useState({
    name: "",
    role: "",
    about: "",
    photo: "",
    email: "",
    phone: "",
    location: ""
  });

  const [skills, setSkills] = useState([]);
  const [education, setEducation] = useState([]);
  const [projects, setProjects] = useState([]);
  const [messages, setMessages] = useState([]);

  const [notice, setNotice] = useState("");

  const [skillForm, setSkillForm] = useState({
    name: "",
    category: ""
  });

  const [educationForm, setEducationForm] = useState({
    degree: "",
    college: "",
    year: "",
    description: ""
  });

  const [projectForm, setProjectForm] = useState({
    title: "",
    description: "",
    image: "",
    link: ""
  });

  const [editingSkill, setEditingSkill] = useState("");
  const [editingEducation, setEditingEducation] = useState("");
  const [editingProject, setEditingProject] = useState("");

  const headers = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin");
  };

  const loadDashboard = async () => {
    try {
      const [p, s, e, pr, m] = await Promise.all([
        axios.get(`${API}/admin/profile`, headers),
        axios.get(`${API}/admin/skills`, headers),
        axios.get(`${API}/admin/education`, headers),
        axios.get(`${API}/admin/projects`, headers),
        axios.get(`${API}/admin/messages`, headers)
      ]);

      setProfile({
        name: "",
        role: "",
        about: "",
        photo: "",
        email: "",
        phone: "",
        location: "",
        ...(p.data && typeof p.data === "object" && !Array.isArray(p.data)
          ? p.data
          : {})
      });

      setSkills(Array.isArray(s.data) ? s.data : []);
      setEducation(Array.isArray(e.data) ? e.data : []);
      setProjects(Array.isArray(pr.data) ? pr.data : []);
      setMessages(Array.isArray(m.data) ? m.data : []);
    } catch (error) {
      console.error("Dashboard loading error:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("adminToken");
        navigate("/admin");
      } else {
        setNotice(
          error.response?.data?.message ||
          "Unable to load dashboard data. Check the backend API."
        );
      }
    }
  };

  useEffect(() => {
    if (token) {
      loadDashboard();
    }
  }, []);

  const saveProfile = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`${API}/admin/profile`, profile, {
        ...headers,
        headers: {
          ...headers.headers,
          "Content-Type": "application/json"
        }
      });

      setNotice("Profile updated successfully.");
    } catch (error) {
      console.error("Profile update error:", error);
      setNotice(
        error.response?.data?.message ||
        "Profile update failed. Please check the backend."
      );
    }
  };

  const saveSkill = async (e) => {
    e.preventDefault();

    try {
      if (editingSkill) {
        await axios.put(
          `${API}/admin/skills/${editingSkill}`,
          skillForm,
          headers
        );
      } else {
        await axios.post(`${API}/admin/skills`, skillForm, headers);
      }

      setSkillForm({ name: "", category: "" });
      setEditingSkill("");

      await loadDashboard();
      setNotice("Skill saved successfully.");
    } catch (error) {
      console.error(error);
      setNotice("Unable to save skill.");
    }
  };

  const saveEducation = async (e) => {
    e.preventDefault();

    try {
      if (editingEducation) {
        await axios.put(
          `${API}/admin/education/${editingEducation}`,
          educationForm,
          headers
        );
      } else {
        await axios.post(
          `${API}/admin/education`,
          educationForm,
          headers
        );
      }

      setEducationForm({
        degree: "",
        college: "",
        year: "",
        description: ""
      });

      setEditingEducation("");

      await loadDashboard();
      setNotice("Education saved successfully.");
    } catch (error) {
      console.error(error);
      setNotice("Unable to save education.");
    }
  };

  const saveProject = async (e) => {
    e.preventDefault();

    try {
      if (editingProject) {
        await axios.put(
          `${API}/admin/projects/${editingProject}`,
          projectForm,
          headers
        );
      } else {
        await axios.post(
          `${API}/admin/projects`,
          projectForm,
          headers
        );
      }

      setProjectForm({
        title: "",
        description: "",
        image: "",
        link: ""
      });

      setEditingProject("");

      await loadDashboard();
      setNotice("Project saved successfully.");
    } catch (error) {
      console.error(error);
      setNotice("Unable to save project.");
    }
  };

  const deleteItem = async (type, id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) {
      return;
    }

    try {
      await axios.delete(`${API}/admin/${type}/${id}`, headers);

      await loadDashboard();
      setNotice("Deleted successfully.");
    } catch (error) {
      console.error(error);
      setNotice("Delete failed.");
    }
  };

  if (!token) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="dashboard">
      <aside className="dashboard-sidebar">
        <Link to="/" className="logo">
          MOHAN<span>.</span>
        </Link>

        <p className="sidebar-label">ADMIN PANEL</p>

        {[
          ["profile", "Profile"],
          ["skills", "Skills"],
          ["education", "Education"],
          ["projects", "Projects"],
          ["messages", "Messages"]
        ].map(([value, label]) => (
          <button
            key={value}
            className={
              tab === value ? "side-button active" : "side-button"
            }
            onClick={() => {
              setTab(value);
              setNotice("");
            }}
          >
            {label}
          </button>
        ))}

        <button
          className="side-button logout-button"
          onClick={logout}
        >
          Logout
        </button>
      </aside>

      <main className="dashboard-main">
        <div className="dashboard-top">
          <div>
            <p className="eyebrow">PORTFOLIO MANAGEMENT</p>
            <h1>
              Admin Dashboard<span>.</span>
            </h1>
          </div>

          <Link to="/" className="view-site">
            View Website ↗
          </Link>
        </div>

        {notice && <p className="notice">{notice}</p>}

        {tab === "profile" && (
          <section className="admin-panel">
            <h2>Edit Profile</h2>

            <form className="admin-form" onSubmit={saveProfile}>
              <label>Name</label>
              <input
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
              />

              <label>Role</label>
              <input
                value={profile.role}
                onChange={(e) =>
                  setProfile({ ...profile, role: e.target.value })
                }
              />

              <label>About</label>
              <textarea
                rows="5"
                value={profile.about}
                onChange={(e) =>
                  setProfile({ ...profile, about: e.target.value })
                }
              />

              <label>Upload Profile Photo</label>

              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  try {
                    const photoData = await compressProfilePhoto(file);

                    setProfile((current) => ({
                      ...current,
                      photo: photoData
                    }));

                    setNotice(
                      "Photo selected. Click Save Profile to publish it."
                    );
                  } catch (error) {
                    setNotice(
                      error.message ||
                      "Unable to load the selected photo."
                    );
                  } finally {
                    e.target.value = "";
                  }
                }}
              />

              {profile.photo && (
                <div className="profile-upload-preview">
                  <p>Profile photo preview</p>

                  <img
                    src={profile.photo}
                    alt="Profile preview"
                    style={{
                      width: "150px",
                      height: "150px",
                      objectFit: "cover",
                      borderRadius: "50%",
                      border: "none",
                      outline: "none",
                      boxShadow: "none",
                      display: "block",
                      marginBottom: "12px"
                    }}
                  />

                  <button
                    type="button"
                    className="btn outline-btn"
                    onClick={() =>
                      setProfile((current) => ({
                        ...current,
                        photo: ""
                      }))
                    }
                  >
                    Remove Photo
                  </button>
                </div>
              )}

              <label>Email</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) =>
                  setProfile({ ...profile, email: e.target.value })
                }
              />

              <label>Phone</label>
              <input
                value={profile.phone}
                onChange={(e) =>
                  setProfile({ ...profile, phone: e.target.value })
                }
              />

              <label>Location</label>
              <input
                value={profile.location}
                onChange={(e) =>
                  setProfile({ ...profile, location: e.target.value })
                }
              />

              <button className="btn primary-btn" type="submit">
                Save Profile
              </button>
            </form>
          </section>
        )}

        {tab === "skills" && (
          <section className="admin-panel">
            <h2>{editingSkill ? "Edit Skill" : "Add Skill"}</h2>

            <form className="admin-form" onSubmit={saveSkill}>
              <label>Skill Name</label>
              <input
                required
                value={skillForm.name}
                onChange={(e) =>
                  setSkillForm({
                    ...skillForm,
                    name: e.target.value
                  })
                }
              />

              <label>Category</label>
              <input
                value={skillForm.category}
                onChange={(e) =>
                  setSkillForm({
                    ...skillForm,
                    category: e.target.value
                  })
                }
              />

              <button className="btn primary-btn">
                {editingSkill ? "Update Skill" : "Add Skill"}
              </button>

              {editingSkill && (
                <button
                  type="button"
                  className="btn outline-btn"
                  onClick={() => {
                    setEditingSkill("");
                    setSkillForm({ name: "", category: "" });
                  }}
                >
                  Cancel
                </button>
              )}
            </form>

            <h2>Skills List</h2>

            {skills.map((item) => (
              <div className="manage-row" key={item._id}>
                <div>
                  <strong>{item.name}</strong>
                  <p>{item.category}</p>
                </div>

                <div className="row-actions">
                  <button
                    onClick={() => {
                      setEditingSkill(item._id);
                      setSkillForm({
                        name: item.name,
                        category: item.category || ""
                      });
                    }}
                  >
                    Edit
                  </button>

                  <button onClick={() => deleteItem("skills", item._id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </section>
        )}

        {tab === "education" && (
          <section className="admin-panel">
            <h2>
              {editingEducation ? "Edit Education" : "Add Education"}
            </h2>

            <form className="admin-form" onSubmit={saveEducation}>
              <label>Degree</label>
              <input
                required
                value={educationForm.degree}
                onChange={(e) =>
                  setEducationForm({
                    ...educationForm,
                    degree: e.target.value
                  })
                }
              />

              <label>College</label>
              <input
                value={educationForm.college}
                onChange={(e) =>
                  setEducationForm({
                    ...educationForm,
                    college: e.target.value
                  })
                }
              />

              <label>Year</label>
              <input
                value={educationForm.year}
                onChange={(e) =>
                  setEducationForm({
                    ...educationForm,
                    year: e.target.value
                  })
                }
              />

              <label>Description</label>
              <textarea
                rows="3"
                value={educationForm.description}
                onChange={(e) =>
                  setEducationForm({
                    ...educationForm,
                    description: e.target.value
                  })
                }
              />

              <button className="btn primary-btn">
                {editingEducation ? "Update Education" : "Add Education"}
              </button>

              {editingEducation && (
                <button
                  type="button"
                  className="btn outline-btn"
                  onClick={() => {
                    setEditingEducation("");
                    setEducationForm({
                      degree: "",
                      college: "",
                      year: "",
                      description: ""
                    });
                  }}
                >
                  Cancel
                </button>
              )}
            </form>

            <h2>Education List</h2>

            {education.map((item) => (
              <div className="manage-row" key={item._id}>
                <div>
                  <strong>{item.degree}</strong>
                  <p>{item.college} {item.year}</p>
                </div>

                <div className="row-actions">
                  <button
                    onClick={() => {
                      setEditingEducation(item._id);
                      setEducationForm({
                        degree: item.degree,
                        college: item.college || "",
                        year: item.year || "",
                        description: item.description || ""
                      });
                    }}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteItem("education", item._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </section>
        )}

        {tab === "projects" && (
          <section className="admin-panel">
            <h2>
              {editingProject ? "Edit Project" : "Add Project"}
            </h2>

            <form className="admin-form" onSubmit={saveProject}>
              <label>Project Title</label>
              <input
                required
                value={projectForm.title}
                onChange={(e) =>
                  setProjectForm({
                    ...projectForm,
                    title: e.target.value
                  })
                }
              />

              <label>Description</label>
              <textarea
                rows="3"
                value={projectForm.description}
                onChange={(e) =>
                  setProjectForm({
                    ...projectForm,
                    description: e.target.value
                  })
                }
              />

              <label>Upload Project Screenshot</label>
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  try {
                    const imageData = await compressProfilePhoto(file);

                    setProjectForm((current) => ({
                      ...current,
                      image: imageData
                    }));

                    setNotice(
                      "Project screenshot selected. Click Save Project to publish it."
                    );
                  } catch (error) {
                    setNotice(
                      error.message ||
                      "Unable to load the selected screenshot."
                    );
                  } finally {
                    e.target.value = "";
                  }
                }}
              />

              <label>Or Project Image URL (optional)</label>
              <input
                value={
                  projectForm.image.startsWith("data:image/")
                    ? ""
                    : projectForm.image
                }
                placeholder="Paste an image URL if you do not upload a file"
                onChange={(e) =>
                  setProjectForm({
                    ...projectForm,
                    image: e.target.value
                  })
                }
              />

              {projectForm.image && (
                <div className="project-upload-preview">
                  <p>Project image preview</p>

                  <img
                    src={projectForm.image}
                    alt="Project preview"
                  />

                  <button
                    type="button"
                    className="btn outline-btn"
                    onClick={() =>
                      setProjectForm({
                        ...projectForm,
                        image: ""
                      })
                    }
                  >
                    Remove Image
                  </button>
                </div>
              )}

              <label>Project Website URL</label>
              <input
                type="url"
                placeholder="https://your-project-website.com"
                value={projectForm.link}
                onChange={(e) =>
                  setProjectForm({
                    ...projectForm,
                    link: e.target.value
                  })
                }
              />

              <button className="btn primary-btn">
                {editingProject ? "Update Project" : "Add Project"}
              </button>

              {editingProject && (
                <button
                  type="button"
                  className="btn outline-btn"
                  onClick={() => {
                    setEditingProject("");
                    setProjectForm({
                      title: "",
                      description: "",
                      image: "",
                      link: ""
                    });
                  }}
                >
                  Cancel
                </button>
              )}
            </form>

            <h2>Projects List</h2>

            {projects.map((item) => (
              <div className="manage-row" key={item._id}>
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.description}</p>
                </div>

                <div className="row-actions">
                  <button
                    onClick={() => {
                      setEditingProject(item._id);
                      setProjectForm({
                        title: item.title,
                        description: item.description || "",
                        image: item.image || "",
                        link: item.link || ""
                      });
                    }}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteItem("projects", item._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </section>
        )}

        {tab === "messages" && (
          <section className="admin-panel">
            <h2>Contact Messages ({messages.length})</h2>

            {messages.map((message) => (
              <div className="message-card" key={message._id}>
                <h3>{message.name}</h3>

                <p>
                  <strong>Email:</strong> {message.email}
                </p>

                {message.phone && (
                  <p>
                    <strong>Phone:</strong> {message.phone}
                  </p>
                )}

                {message.subject && (
                  <p>
                    <strong>Subject:</strong> {message.subject}
                  </p>
                )}

                <p>{message.message}</p>

                <button
                  onClick={() => deleteItem("messages", message._id)}
                >
                  Delete Message
                </button>
              </div>
            ))}

            {messages.length === 0 && (
              <p>No messages received yet.</p>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
