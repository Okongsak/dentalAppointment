import { useState, useEffect, useCallback } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import Swal from "sweetalert2";
import { Modal, Form } from "react-bootstrap";
import Button from "@mui/material/Button";
import moment from "moment";
import { FaTrashAlt } from "react-icons/fa";
import { RiEdit2Fill } from "react-icons/ri";

const PatientList = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    allergies: "",
    phone: "",
    chronic_disease: "",
    dental_history: [],
  });

  // Fetch patients
  const fetchPatients = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/getpatients`);
      const data = res.data.map((p) => ({
        ...p,
        dental_history: p.dental_history ? JSON.parse(p.dental_history) : [],
      }));
      setPatients(data);
    } catch (err) {
      console.error("Failed to fetch patients", err);
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL]);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const openAddModal = () => {
    setEditingPatient(null);
    setFormData({
      name: "",
      age: "",
      gender: "",
      allergies: "",
      address: "",
      dental_history: [],
    });
    setShowModal(true);
  };

  const openEditModal = (patient) => {
    setEditingPatient(patient);
    setFormData({
      ...patient,
      dental_history: patient.dental_history || [],
      age: patient.age || "",
      gender: patient.gender || "",
    });
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDentalHistoryChange = (index, value) => {
    setFormData((prev) => {
      const history = [...prev.dental_history];
      history[index] = value;
      return { ...prev, dental_history: history };
    });
  };

  const addDentalHistoryItem = () => {
    setFormData((prev) => ({
      ...prev,
      dental_history: [...prev.dental_history, { date: "", CC: "", note: "" }],
    }));
  };

  const removeDentalHistoryItem = (index) => {
    setFormData((prev) => {
      const history = [...prev.dental_history];
      history.splice(index, 1);
      return { ...prev, dental_history: history };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      age: formData.age ? formData.age.toString() : "",
      gender: formData.gender.toLowerCase(),
      dental_history: JSON.stringify(
        formData.dental_history.filter((item) => item.date && item.CC)
      ),
    };

    try {
      if (editingPatient) {
        await axios.post(
          `${API_BASE_URL}/editpatients/${editingPatient.id}`,
          payload
        );
        Swal.fire("Success", "Patient updated successfully", "success");
      } else {
        await axios.post(`${API_BASE_URL}/addpatients`, payload);
        Swal.fire("Success", "Patient added successfully", "success");
      }

      fetchPatients();
      closeModal();
    } catch (err) {
      console.error(err.response?.data || err);
      Swal.fire("Error", "Failed to save patient", "error");
    }
  };

  // Delete
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This patient record will be deleted",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`${API_BASE_URL}/deletepatients/${id}`);
        Swal.fire("Deleted!", "Patient deleted successfully", "success");
        fetchPatients();
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Failed to delete patient", "error");
      }
    }
  };

  const columns = [
    { name: "ID", selector: (row) => row.id, sortable: true, width: "70px" },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
      wrap: true,
      sortFunction: (a, b) => a.name.localeCompare(b.name, "th"),
    },
    { name: "Age", selector: (row) => row.age, sortable: true },
    { name: "Gender", selector: (row) => row.gender },
    { name: "Allergies", selector: (row) => row.allergies, wrap: true },
    {
      name: "Chronic Disease",
      selector: (row) => row.chronic_disease,
      wrap: true,
    },
    { name: "Phone", selector: (row) => row.phone, wrap: true },
    {
      name: "Dental History",
      selector: (row) => row.dental_history,
      cell: (row) => (
        <div className="dental-history-container">
          {(row.dental_history || [])
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map((item, idx) => (
              <Button
                key={idx}
                variant="outlined"
                size="small"
                onClick={() =>
                  Swal.fire({
                    title: `${moment(item.date).format("DD-MM-YYYY")} - ${
                      item.CC
                    }`,
                    text: item.note || "-",
                    icon: "info",
                  })
                }
                style={{ margin: "2px" }}
              >
                {moment(item.date).format("DD-MM-YYYY")}: {item.CC}
              </Button>
            ))}
        </div>
      ),
      wrap: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="btn-patient-group">
          <Button
            variant="contained"
            size="small"
            className="mb-2"
            onClick={() => openEditModal(row)}
          >
            <RiEdit2Fill />
          </Button>
          <Button
            variant="outlined"
            size="small"
            color="error"
            className="btn btn-sm btn-danger"
            onClick={() => handleDelete(row.id)}
          >
            <FaTrashAlt />
          </Button>
        </div>
      ),
    },
  ];

  const [searchText, setSearchText] = useState("");

  // Filtered data
  const filteredPatients = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(searchText.toLowerCase()) ||
      (p.phone && p.phone.includes(searchText))
  );

  return (
    <div className="table-container">
      <div className="mb-3 d-flex align-items-center">
        <Form.Control
          type="text"
          placeholder="Search by Name or Phone"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ maxWidth: "300px", marginRight: "10px" }}
        />
        <Button variant="contained" size="medium" onClick={openAddModal}>
          Add Patient
        </Button>
      </div>

      <DataTable
        title="Patients"
        columns={columns.map((col) =>
          col.name === "ID" ? { ...col, cell: (row, index) => index + 1 } : col
        )}
        data={filteredPatients}
        progressPending={loading}
        pagination
        responsive
        persistTableHead
        fixedHeader
        fixedHeaderScrollHeight="580px"
      />

      {/* Modal */}
      <Modal show={showModal} onHide={closeModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingPatient ? "Edit Patient" : "Add Patient"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className="form-patient" onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Age</Form.Label>
              <Form.Control
                name="age"
                type="text"
                value={formData.age}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Gender</Form.Label>
              <Form.Select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Allergies</Form.Label>
              <Form.Control
                name="allergies"
                value={formData.allergies}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Chronic Disease</Form.Label>
              <Form.Control
                name="chronic_disease"
                value={formData.chronic_disease}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </Form.Group>

            <div className="form-dental-history">
              <Button
                variant="outlined"
                size="small"
                type="button"
                onClick={addDentalHistoryItem}
                className="btn-add-history mb-3"
              >
                Add Dental History
              </Button>
              {formData.dental_history.map((item, idx) => (
                <div key={idx} className="input-add-dental-history">
                  <input
                    type="date"
                    value={item.date}
                    onChange={(e) =>
                      handleDentalHistoryChange(idx, {
                        ...item,
                        date: e.target.value,
                      })
                    }
                    required
                  />
                  <input
                    type="text"
                    placeholder="CC"
                    value={item.CC}
                    onChange={(e) =>
                      handleDentalHistoryChange(idx, {
                        ...item,
                        CC: e.target.value,
                      })
                    }
                    required
                  />
                  <input
                    type="text"
                    placeholder="Note"
                    value={item.note}
                    onChange={(e) =>
                      handleDentalHistoryChange(idx, {
                        ...item,
                        note: e.target.value,
                      })
                    }
                  />
                  <Button
                    variant="contained"
                    size="small"
                    color="error"
                    type="button"
                    onClick={() => removeDentalHistoryItem(idx)}
                  >
                    <FaTrashAlt />
                  </Button>
                </div>
              ))}
            </div>

            <div className="d-flex align-items-center justify-content-end mt-4">
              <Button variant="contained" size="medium" type="submit">
                {editingPatient ? "Update" : "Confirm"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default PatientList;
