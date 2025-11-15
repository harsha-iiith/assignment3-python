import { useNavigate } from "react-router-dom";

function GoBackButton() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <button
      onClick={handleGoBack}
      className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
    >
      Go Back
    </button>
  );
}

export default GoBackButton;
