import React, { useState } from "react";
import { 
  TextField, 
  Button, 
  Box, 
  Typography, 
  Paper, 
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Alert
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    
    // Address Information
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    
    // Church Information
    baptismStatus: "",
    baptismDate: "",
    previousChurch: "",
    ministryInterests: "",
    emergencyContact: "",
    emergencyPhone: "",
    
    // Additional Information
    occupation: "",
    maritalStatus: "",
    spouseName: "",
    children: "",
    howDidYouHear: ""
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields validation
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    if (!formData.country.trim()) newErrors.country = "Country is required";

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (formData.password && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Phone validation (basic)
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setSuccess("");
    setErrors({});

    try {
      console.log('Starting registration process...');
      
      // First, register the user account
      const userData = {
        email: formData.email,
        password: formData.password,
        role: "member"
      };

      console.log('Registering user account...');
      await axios.post(`${API_URL}/auth/register`, userData);
      console.log('User account registered successfully');

      // Then, create the member profile
      const memberData = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        // Add additional fields to your member model as needed
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country,
        baptismStatus: formData.baptismStatus,
        baptismDate: formData.baptismDate,
        previousChurch: formData.previousChurch,
        ministryInterests: formData.ministryInterests,
        emergencyContact: formData.emergencyContact,
        emergencyPhone: formData.emergencyPhone,
        occupation: formData.occupation,
        maritalStatus: formData.maritalStatus,
        spouseName: formData.spouseName,
        children: formData.children,
        howDidYouHear: formData.howDidYouHear
      };

      console.log('Creating member profile...');
      await axios.post(`${API_URL}/members`, memberData);
      console.log('Member profile created successfully');

      setSuccess("Registration successful! Redirecting to login page...");
      
      // Clear form data
      setFormData({
        firstName: "", lastName: "", email: "", password: "", confirmPassword: "",
        phone: "", dateOfBirth: "", gender: "", address: "", city: "", state: "",
        zipCode: "", country: "", baptismStatus: "", baptismDate: "", previousChurch: "",
        ministryInterests: "", emergencyContact: "", emergencyPhone: "", occupation: "",
        maritalStatus: "", spouseName: "", children: "", howDidYouHear: ""
      });

      // Redirect to login page after 2 seconds
      setTimeout(() => {
        navigate("/");
      }, 2000);

    } catch (err) {
      console.error('Registration error:', err.response?.data || err.message);
      if (err.response?.data?.error) {
        setErrors({ submit: err.response.data.error });
      } else {
        setErrors({ submit: "Registration failed. Please try again." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#f5f5f5"
      py={4}
    >
      <Paper elevation={3} sx={{ padding: 4, maxWidth: 800, width: "100%", mx: 2 }}>
        <Typography variant="h4" mb={3} align="center" color="primary">
          Church Member Registration
        </Typography>
        
        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        {errors.submit && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {errors.submit}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Personal Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Personal Information
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                name="firstName"
                label="First Name *"
                fullWidth
                value={formData.firstName}
                onChange={handleChange}
                error={!!errors.firstName}
                helperText={errors.firstName}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                name="lastName"
                label="Last Name *"
                fullWidth
                value={formData.lastName}
                onChange={handleChange}
                error={!!errors.lastName}
                helperText={errors.lastName}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                name="email"
                label="Email Address *"
                type="email"
                fullWidth
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                name="phone"
                label="Phone Number *"
                fullWidth
                value={formData.phone}
                onChange={handleChange}
                error={!!errors.phone}
                helperText={errors.phone}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                name="dateOfBirth"
                label="Date of Birth *"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={formData.dateOfBirth}
                onChange={handleChange}
                error={!!errors.dateOfBirth}
                helperText={errors.dateOfBirth}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.gender}>
                <InputLabel>Gender *</InputLabel>
                <Select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  label="Gender *"
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
                {errors.gender && <FormHelperText>{errors.gender}</FormHelperText>}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                name="password"
                label="Password *"
                type="password"
                fullWidth
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                name="confirmPassword"
                label="Confirm Password *"
                type="password"
                fullWidth
                value={formData.confirmPassword}
                onChange={handleChange}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
              />
            </Grid>

            {/* Address Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Address Information
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                name="address"
                label="Street Address *"
                fullWidth
                value={formData.address}
                onChange={handleChange}
                error={!!errors.address}
                helperText={errors.address}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                name="city"
                label="City *"
                fullWidth
                value={formData.city}
                onChange={handleChange}
                error={!!errors.city}
                helperText={errors.city}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                name="state"
                label="State/Province *"
                fullWidth
                value={formData.state}
                onChange={handleChange}
                error={!!errors.state}
                helperText={errors.state}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                name="zipCode"
                label="ZIP/Postal Code"
                fullWidth
                value={formData.zipCode}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                name="country"
                label="Country *"
                fullWidth
                value={formData.country}
                onChange={handleChange}
                error={!!errors.country}
                helperText={errors.country}
              />
            </Grid>

            {/* Church Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Church Information
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Baptism Status</InputLabel>
                <Select
                  name="baptismStatus"
                  value={formData.baptismStatus}
                  onChange={handleChange}
                  label="Baptism Status"
                >
                  <MenuItem value="baptized">Baptized</MenuItem>
                  <MenuItem value="not_baptized">Not Baptized</MenuItem>
                  <MenuItem value="planning">Planning to be Baptized</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                name="baptismDate"
                label="Baptism Date"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={formData.baptismDate}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                name="previousChurch"
                label="Previous Church (if any)"
                fullWidth
                value={formData.previousChurch}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                name="ministryInterests"
                label="Ministry Interests"
                fullWidth
                multiline
                rows={3}
                value={formData.ministryInterests}
                onChange={handleChange}
                placeholder="e.g., Children's ministry, Music, Outreach, etc."
              />
            </Grid>

            {/* Additional Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Additional Information
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                name="occupation"
                label="Occupation"
                fullWidth
                value={formData.occupation}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Marital Status</InputLabel>
                <Select
                  name="maritalStatus"
                  value={formData.maritalStatus}
                  onChange={handleChange}
                  label="Marital Status"
                >
                  <MenuItem value="single">Single</MenuItem>
                  <MenuItem value="married">Married</MenuItem>
                  <MenuItem value="divorced">Divorced</MenuItem>
                  <MenuItem value="widowed">Widowed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                name="spouseName"
                label="Spouse Name (if married)"
                fullWidth
                value={formData.spouseName}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                name="children"
                label="Number of Children"
                fullWidth
                value={formData.children}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                name="emergencyContact"
                label="Emergency Contact Name"
                fullWidth
                value={formData.emergencyContact}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                name="emergencyPhone"
                label="Emergency Contact Phone"
                fullWidth
                value={formData.emergencyPhone}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                name="howDidYouHear"
                label="How did you hear about our church?"
                fullWidth
                value={formData.howDidYouHear}
                onChange={handleChange}
                placeholder="e.g., Friend, Social media, Website, etc."
              />
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                disabled={loading}
                sx={{ mt: 2 }}
              >
                {loading ? "Registering..." : "Register as Church Member"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
}

export default Register; 