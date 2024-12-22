import React from "react";

const ResumeModal = ({ show, onClose, resumeLink }) => {
  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <iframe
          src={resumeLink}
          title="Resume"
          className="modal-iframe"
          frameBorder="0"
        ></iframe>
        {/* <button className="modal-close" onClick={onClose}>
          Close
        </button> */}
      </div>
    </div>
  );
};

export default ResumeModal;
