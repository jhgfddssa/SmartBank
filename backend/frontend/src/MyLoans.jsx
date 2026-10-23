import { useEffect, useState } from "react";
import axios from "axios";

function MyLoans() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadLoans = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          "http://localhost:5000/api/loans/my-loans",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("My Loans:", response.data);

        if (!cancelled) {
          setLoans(response.data);
        }
      } catch (error) {
        console.error(error);

        if (!cancelled) {
          if (error.response) {
            setError(
              error.response.data.message ||
                "Failed to load loans"
            );
          } else {
            setError("Cannot connect to server");
          }
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadLoans();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="my-loans">

      <h2>🏦 My Loans</h2>

      {loading && (
        <p>Loading loans...</p>
      )}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {!loading &&
        !error &&
        loans.length === 0 && (
          <p>No loan applications yet.</p>
        )}

      {!loading &&
        loans.map((loan) => (
          <div
            className="loan-item"
            key={loan._id}
          >
            <div>
              <strong>
                ${Number(loan.amount).toLocaleString()}
              </strong>

              <p>
                Purpose: {loan.purpose}
              </p>

              <p>
                Duration: {loan.duration} Months
              </p>

              <p>
                Status: {loan.status || "Pending"}
              </p>
            </div>
          </div>
        ))}
    </div>
  );
}

export default MyLoans;