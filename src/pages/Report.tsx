import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Report = () => {
  const navigate = useNavigate();

  // Report page no longer uses sessionStorage for sensitive data.
  // All diagnosis data is now saved to DB and accessed via /diagnosis/:id
  useEffect(() => {
    navigate("/area-selection", { replace: true });
  }, [navigate]);

  return null;
};

export default Report;
