import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

type Course = {
  _id: string;
  title: string;
  description: string;
  duration?: string;
  level?: string;
  topics?: string[];
  categoryId?: string;
  students?: number;
  rating?: number;
};

const CourseDetailsPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchCourse = async () => {
      if (!courseId) return;
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get<Course>(`/api/courses/${courseId}`);
        if (isMounted) {
          setCourse(res.data);
        }
      } catch (err: any) {
        if (isMounted) {
          const message = err?.response?.data?.message || "Failed to load course.";
          setError(message);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCourse();
    return () => {
      isMounted = false;
    };
  }, [courseId]);

  const handleSelect = useCallback(
    (type: "choose" | "text" | "voice" | "video") => {
      if (!courseId) return;
      navigate(`/interview/session?course=${courseId}&type=${type}`);
    },
    [navigate, courseId]
  );

  if (loading) {
    return (
      <main className="page-container">
        <div className="loading">Loading...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="page-container">
        <div className="error-message">{error}</div>
      </main>
    );
  }

  if (!course) {
    return (
      <main className="page-container">
        <div className="empty-state">Course not found.</div>
      </main>
    );
  }

  return (
    <main className="page-container">
      <div className="container">
        <h1 className="page-title">{course.title}</h1>
        {course.description && (
          <p className="page-subtitle">{course.description}</p>
        )}

        <section className="card">
          <h2 className="section-title">Select Interview Type</h2>
          <div className="options-grid">
            <button
              type="button"
              className="button primary-button"
              onClick={() => handleSelect("choose")}
            >
              Choose
            </button>
            <button
              type="button"
              className="button primary-button"
              onClick={() => handleSelect("text")}
            >
              Text Based
            </button>
            <button
              type="button"
              className="button primary-button"
              onClick={() => handleSelect("voice")}
            >
              Voice Based
            </button>
            <button
              type="button"
              className="button primary-button"
              onClick={() => handleSelect("video")}
            >
              Video Based
            </button>
          </div>
        </section>
      </div>
    </main>
  );
};

export default CourseDetailsPage;
