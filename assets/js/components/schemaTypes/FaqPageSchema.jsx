// /components/schemaTypes/FaqPageSchema.jsx

import { useState, useEffect } from "react";

/**
 * FAQPage Schema Editor
 * Dynamic FAQ list with add/edit/delete
 */
export default function FaqPageSchema({ value = [], onChange }) {
  const [faqs, setFaqs] = useState(value);
  const [editingIndex, setEditingIndex] = useState(null);
  const [currentFAQ, setCurrentFAQ] = useState({ question: "", answer: "" });

  useEffect(() => {
    if (onChange) onChange(faqs);
  }, [faqs]);

  const handleChange = (field, val) => {
    setCurrentFAQ((prev) => ({ ...prev, [field]: val }));
  };

  const addOrUpdateFAQ = () => {
    if (!currentFAQ.question.trim() || !currentFAQ.answer.trim()) return;

    if (editingIndex !== null) {
      // update existing
      const updated = [...faqs];
      updated[editingIndex] = currentFAQ;
      setFaqs(updated);
      setEditingIndex(null);
    } else {
      // add new
      setFaqs((prev) => [...prev, currentFAQ]);
    }
    setCurrentFAQ({ question: "", answer: "" });
  };

  const editFAQ = (index) => {
    setCurrentFAQ(faqs[index]);
    setEditingIndex(index);
  };

  const deleteFAQ = (index) => {
    setFaqs((prev) => prev.filter((_, i) => i !== index));
    if (editingIndex === index) {
      setEditingIndex(null);
      setCurrentFAQ({ question: "", answer: "" });
    }
  };

  return (
    <div className="schema-form schema-faqpage">
      <div className="faq-inputs">
        <label>
          Question *
          <input
            type="text"
            value={currentFAQ.question}
            onChange={(e) => handleChange("question", e.target.value)}
          />
        </label>

        <label>
          Answer *
          <textarea
            value={currentFAQ.answer}
            onChange={(e) => handleChange("answer", e.target.value)}
          />
        </label>

        <button type="button" onClick={addOrUpdateFAQ}>
          {editingIndex !== null ? "Update FAQ" : "Add FAQ"}
        </button>
      </div>

      {faqs.length > 0 && (
        <div className="faq-list">
          {faqs.map((faq, i) => (
            <div key={i} className="faq-item">
              <strong>Q:</strong> {faq.question} <br />
              <strong>A:</strong> {faq.answer} <br />
              <button type="button" onClick={() => editFAQ(i)}>
                Edit
              </button>
              <button type="button" onClick={() => deleteFAQ(i)}>
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * JSON-LD builder for FAQPage
 */
export function buildFaqPageJson(faqs) {
  if (!Array.isArray(faqs) || faqs.length === 0) return null;

  const mainEntity = faqs
    .filter((f) => f.question && f.answer)
    .map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    }));

  if (mainEntity.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity,
  };
}
