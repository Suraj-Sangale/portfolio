const ResumeModal = ({ show, onClose, resumeLink }) => {
  if (!show) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-lg overflow-hidden max-w-4xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <iframe
          src={process.env.NEXT_PUBLIC_BASE_URL + resumeLink}
          title="Resume"
          className="w-full h-[80vh]"
          frameBorder="0"
        ></iframe>
      </div>
    </div>
  );
};

export default ResumeModal;
