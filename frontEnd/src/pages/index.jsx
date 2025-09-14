import { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Banner01 from "../assets/banner01.jpg";
import Banner02 from "../assets/banner02.jpg";
import { IoIosSend } from "react-icons/io";
import { FaTooth } from "react-icons/fa";
import { FaCalendarDays } from "react-icons/fa6";

const IndexPage = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [showModalAppointment, setShowModalAppointment] = useState(false);

  const handleCloseModalAppointment = () => {
    setShowModalAppointment(false);
    setFormData({
      name: "",
      phone: "",
      date: "",
      time: "",
      service: "",
    });
  };
  const handleShowModalAppointment = () => setShowModalAppointment(true);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    date: "",
    time: "",
    service: "",
  });

  // ฟังก์ชันคำนวณเวลาเปิดให้จอง
  const getAvailableTimes = () => {
    if (!formData.date) return [];

    const day = new Date(formData.date).getDay(); // 0=Sun, 1=Mon ... 6=Sat
    let startHour, endHour, endMinute;

    if (day >= 1 && day <= 5) {
      // จันทร์-ศุกร์
      startHour = 13;
      endHour = 17;
      endMinute = 40;
    } else {
      // เสาร์-อาทิตย์
      startHour = 10;
      endHour = 17;
      endMinute = 40;
    }

    const times = [];
    let hour = startHour;
    let minute = 0;

    while (hour < endHour || (hour === endHour && minute <= endMinute)) {
      // format เช่น 13:00, 13:20, 13:40
      const formatted = `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`;
      times.push(formatted);

      // บวกทีละ 20 นาที
      minute += 20;
      if (minute >= 60) {
        minute = 0;
        hour++;
      }
    }

    return times;
  };

  const services = ["ขูดหินปูน", "อุดฟัน", "ถอนฟัน"];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${API_BASE_URL}/appointments`, formData);

      Swal.fire({
        icon: "success",
        title: "ส่งข้อมูลเรียบร้อย",
        confirmButtonText: "OK",
      }).then(() => {
        setShowModalAppointment(false);
        window.location.reload();
      });
    } catch (error) {
      console.error(error);

      const errorMessage =
        error.response?.data?.message || "ไม่สามารถส่งข้อมูลได้";

      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: errorMessage,
      });
    }
  };

  return (
    <div className="container">
      <div className="col-12">
        <div className="appointment-btn-container">
          <Button variant="primary" onClick={handleShowModalAppointment}>
            <FaTooth /> นัดหมายทันตกรรม คลิ๊ก!
          </Button>
        </div>

        <Modal
          show={showModalAppointment}
          onHide={handleCloseModalAppointment}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <FaCalendarDays /> นัดหมายทันตกรรม
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={handleSubmit}>
              <div className="form-group mb-3">
                <label className="form-label">ชื่อ-นามสกุล</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group mb-3">
                <label className="form-label">เบอร์โทรศัพท์</label>
                <input
                  type="text"
                  className="form-control"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group mb-3">
                <label className="form-label">วันที่นัดหมาย</label>
                <input
                  type="date"
                  className="form-control"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group mb-3">
                <label className="form-label">เวลานัดหมาย</label>
                <select
                  className="form-control"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  disabled={!formData.date}
                >
                  <option value="">เลือกเวลา</option>
                  {getAvailableTimes().map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group mb-3">
                <label className="form-label">ชนิดบริการ</label>
                <select
                  className="form-control"
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                >
                  <option value="">เลือกบริการ</option>
                  {services.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="btn-submit-app-container">
                <button type="submit" className="btn btn-primary">
                  <IoIosSend /> ส่งข้อมูล
                </button>
              </div>
            </form>
          </Modal.Body>
        </Modal>
      </div>
      <div className="row">
        <h2 className="header-banner">Our Promotion</h2>
        <div className="col-md-6 col-12">
          <div className="banner">
            <img src={Banner01} alt="banner" />
          </div>
        </div>
        <div className="col-md-6 col-12">
          <div className="banner">
            <img src={Banner02} alt="banner" />
          </div>
        </div>
        <div className="col-12">
          <h2 className="header-location">Our Location</h2>
          <div className="show-map">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3776.80117416251!2d98.95460167560839!3d18.807012060361068!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30da3b9225a6af11%3A0x32c45a2c024a18a!2zVG9vdGggU21pbGUgUGx1cyBEZW50YWwgY2xpbmljIOC4hOC4peC4tOC4meC4tOC4geC4l-C4seC4meC4leC4geC4o-C4o-C4oeC4l-C4ueC4mOC4quC5hOC4oeC4peC5jOC4nuC4peC4seC4qiDguJfguLPguJ_guLHguJkg4LiI4Lix4LiU4Lif4Lix4LiZIOC4q-C4meC5ieC4suC4oeC4ii4g4Lif4Lit4LiB4Liq4Li14Lif4Lix4LiZ4LiC4Liy4LinIOC4o-C4suC4geC5gOC4l-C4teC4ouC4oQ!5e0!3m2!1sth!2sth!4v1755962649374!5m2!1sth!2sth"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndexPage;
