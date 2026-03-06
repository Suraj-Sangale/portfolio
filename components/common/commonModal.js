import React, { useEffect } from "react";

export default function CommonModal({
  modalOpen,
  setModalOpen,
  modalTitle = "",
  children,
  backDrop = false,
  handleBackButtonClick,
  showBackButton,
  modalSize = "w-11/12 md:w-[32%]",
}) {
  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const handleBackdropClick = (e) => {
    if (e.target.id === "backdrop" && !backDrop) {
      toggleModal();
    }
  };

  // 🔒 Lock scroll when modal is open
  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    // 🧹 Cleanup on unmount
    return () => {
      document.body.style.overflow = "";
    };
  }, [modalOpen]);

  return (
    <>
      {modalOpen && (
        <div
          id="backdrop"
          className="fixed inset-0 z-[101] flex items-center justify-center backdrop-blur-sm bg-gray-900/30 p-5"
          onClick={handleBackdropClick}
        >
          <div
            className={`bg-white rounded-lg shadow-lg ${modalSize} mx-auto`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            {modalTitle && (
              <div className="flex justify-between items-center p-4 border-b text-black border-gray-200">
                <div className="text-lg font-semibold">{modalTitle}</div>
                {showBackButton && handleBackButtonClick && (
                  <button
                    onClick={handleBackButtonClick}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    &#8592; {/* Back Arrow */}
                  </button>
                )}
                {!backDrop && (
                  <button
                    onClick={toggleModal}
                    className="text-gray-600 hover:text-gray-900 cursor-pointer"
                  >
                    &#10005; {/* Close Icon */}
                  </button>
                )}
              </div>
            )}

            {/* Modal Body */}
            <div className="flex-1 overflow-auto">
              {React.cloneElement(children, { toggleModal })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
