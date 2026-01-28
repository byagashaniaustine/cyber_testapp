import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Card, Alert } from "react-bootstrap";

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    username: "", email: "", password: "", location: "", phone: "", DOB: ""
  });
  
  const [profilePic, setProfilePic] = useState(null);
  const [documentFile, setDocumentFile] = useState(null); // For PDF/Docs
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profile_pic") {
      const file = files[0];
      setProfilePic(file);
      setPreview(URL.createObjectURL(file)); // Create instant preview
    } else if (name === "document") {
      setDocumentFile(files[0]);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    
    if (profilePic) data.append("profile_pic", profilePic);
    if (documentFile) data.append("document", documentFile);

    try {
      const response = await fetch("http://192.168.136.135:8000/backend/FormApi.php", {
        method: "POST",
        body: data,
      });
      const result = await response.json();
      alert(result.message);
    } catch (error) {
      alert("Upload failed. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Card className="shadow-lg border-0">
        <Card.Body className="p-4">
          <h2 className="text-center mb-4 font-weight-bold">Agent Registration</h2>
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Form.Group as={Col} md={6}>
                <Form.Label>Username</Form.Label>
                <Form.Control name="username" onChange={handleChange} required />
              </Form.Group>
              <Form.Group as={Col} md={6}>
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" name="email" onChange={handleChange} required />
              </Form.Group>
            </Row>

            {/* File Upload Section */}
            <Row className="bg-light p-3 rounded mb-3 mx-1">
              <Col md={6}>
                <Form.Group>
                  <Form.Label><b>Profile Picture (Image)</b></Form.Label>
                  <Form.Control type="file" name="profile_pic" accept="image/*" onChange={handleChange} />
                  {preview && <img src={preview} alt="Preview" className="mt-2 rounded" style={{width: '80px', height: '80px', objectFit: 'cover'}} />}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label><b>Identification (PDF/Doc)</b></Form.Label>
                  <Form.Control type="file" name="document" accept=".pdf,.doc,.docx" onChange={handleChange} />
                  {documentFile && <small className="text-success">Selected: {documentFile.name}</small>}
                </Form.Group>
              </Col>
            </Row>

            <Button variant="primary" type="submit" className="w-100 py-2" disabled={loading}>
              {loading ? "Processing..." : "Submit Application"}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default SignUpForm;