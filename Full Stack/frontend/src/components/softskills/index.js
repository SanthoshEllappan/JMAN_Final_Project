
import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap
import { useNavigate } from 'react-router-dom';

const SoftSkillsForm = () => {
  const navigate = useNavigate();
  const [softSkills, setSoftSkills] = useState({
    communication: '',
    teamwork: '',
    problemSolving: '',
    adaptability: '',
    timeManagement: '',
    criticalThinking: '',
    creativity: '',
    leadership: '',
    interpersonalSkills: '',
    emotionalIntelligence: '',
  });

  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // For loading indication
  const [submissionMessage, setSubmissionMessage] = useState(''); // For success/failure messages

  const categories = [
    'Not at all proficient',
    'Slightly proficient',
    'Moderately proficient',
    'Very proficient',
    'Extremely proficient',
    'Expert',
    'Master',
    'Leader',
    'Innovator',
    'Visionary',
  ];

  const numericSkills = ['communication', 'problemSolving', 'timeManagement'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSoftSkills((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsConfirmVisible(true); // Show confirmation dialog
  };

  const confirmSubmission = async () => {
    setIsLoading(true); // Show loading spinner
    setIsConfirmVisible(false); // Hide the confirmation card

    try {
      const { data, status } = await axios.put('http://127.0.0.1:8080/api/softskills', {
        data: softSkills,
        token: localStorage.getItem('userConfig'),
      });

      if (status === 201 || status === 200) {
        setSubmissionMessage(
          status === 201 ? 'Successfully submitted the soft skill form!' : 'Successfully updated the soft skill form!'
        );
        setIsSubmitted(true); // Trigger the success message view
        setIsLoading(false); // Stop loading

        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 3000); // Redirect after 3 seconds
      } else {
        setSubmissionMessage('Error occurred during form submission.');
        setIsLoading(false); // Stop loading on failure
      }
    } catch (error) {
      console.error('API submission error:', error);
      setSubmissionMessage('Error occurred during form submission.');
      setIsLoading(false); // Stop loading on failure
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Soft Skills Form</h2>

      {!isSubmitted ? (
        <form onSubmit={handleSubmit}>
          <div className="row">
            {Object.entries(softSkills).map(([skill, value]) => (
              <div className="col-md-6 mb-3" key={skill}>
                <label htmlFor={skill} className="form-label">
                  {skill.charAt(0).toUpperCase() + skill.slice(1).replace(/([A-Z])/g, ' $1')}
                </label>
                {numericSkills.includes(skill) ? (
                  <select
                    id={skill}
                    name={skill}
                    value={value}
                    onChange={handleChange}
                    required
                    className="form-select"
                  >
                    <option value="" disabled>
                      Select proficiency level (1-10)
                    </option>
                    {[...Array(10).keys()].map((num) => (
                      <option key={num + 1} value={num + 1}>
                        {num + 1}
                      </option>
                    ))}
                  </select>
                ) : (
                  <select
                    id={skill}
                    name={skill}
                    value={value}
                    onChange={handleChange}
                    required
                    className="form-select"
                  >
                    <option value="" disabled>
                      Select proficiency level
                    </option>
                    {categories.map((category, index) => (
                      <option key={index} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            ))}
          </div>

          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
      ) : (
        <div className="alert alert-success mt-4">{submissionMessage}</div>
      )}

      {isLoading && <div className="loading">Submitting...</div>}

      {isConfirmVisible && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: '#fff',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
              textAlign: 'center',
              width: '400px',
            }}
          >
            <h5>Are you sure you want to submit?</h5>
            <button className="btn btn-secondary me-3" onClick={confirmSubmission}>
              Yes
            </button>
            <button className="btn btn-danger" onClick={() => setIsConfirmVisible(false)}>
              No
            </button>
          </div>
        </div>
      )}
    </div>
  );
};


export default SoftSkillsForm;