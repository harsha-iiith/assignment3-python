import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { theme } from "../../styles/theme";
import {
  Button,
  Input,
  Label,
  Card,
  ErrorText,
  LoadingSpinner,
} from "../../styles/GlobalStyles";
import { getCourses, createCourse } from "../../services/courseService";
import { validateCourse } from "../../utils/validators";

const SelectorContainer = styled.div`
  display: grid;
  gap: ${theme.spacing[6]};

  @media (min-width: ${theme.breakpoints.lg}) {
    grid-template-columns: 2fr 1fr;
  }
`;

const CourseList = styled.div`
  display: grid;
  gap: ${theme.spacing[4]};
`;

const CourseCard = styled(Card)`
  cursor: pointer;
  transition: all ${theme.transitions.fast};

  &:hover {
    border: 2px solid ${theme.colors.primary};
    transform: translateY(-2px);
  }

  ${(props) =>
    props.selected &&
    `
    border: 2px solid ${theme.colors.primary};
    background: ${theme.colors.primary}10;
  `}
`;

const CourseInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${theme.spacing[3]};
`;

const CourseTitle = styled.h3`
  margin: 0 0 ${theme.spacing[1]} 0;
  color: ${theme.colors.text};
`;

const CourseCode = styled.span`
  background: ${theme.colors.primary};
  color: white;
  padding: ${theme.spacing[1]} ${theme.spacing[2]};
  border-radius: ${theme.borderRadius.sm};
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.medium};
`;

const CourseDetails = styled.div`
  color: ${theme.colors.muted};
  font-size: ${theme.fontSizes.sm};
  line-height: ${theme.lineHeights.relaxed};
`;

const CreateCourseForm = styled(Card)`
  height: fit-content;
`;

const FormTitle = styled.h3`
  margin-bottom: ${theme.spacing[4]};
  color: ${theme.colors.text};
`;

const FormGroup = styled.div`
  margin-bottom: ${theme.spacing[4]};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${theme.spacing[8]};
  color: ${theme.colors.muted};

  h3 {
    margin-bottom: ${theme.spacing[4]};
  }
`;

const CourseSelector = ({ selectedCourse, onCourseSelect }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    code: "",
    instructor: "",
    description: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [creating, setCreating] = useState(false);

  // Load courses on component mount
  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getCourses();
      if (response.success) {
        setCourses(response.data);
      } else {
        setError(response.message || "Failed to load courses");
      }
    } catch (err) {
      setError("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear specific field error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();

    // Validate form
    const validation = validateCourse(formData);
    if (!validation.isValid) {
      const errors = {};
      validation.errors.forEach((error) => {
        if (error.includes("title")) errors.title = error;
        if (error.includes("code")) errors.code = error;
        if (error.includes("instructor")) errors.instructor = error;
        if (error.includes("description")) errors.description = error;
      });
      setFormErrors(errors);
      return;
    }

    setCreating(true);
    setFormErrors({});

    try {
      const response = await createCourse(formData);
      if (response.success) {
        // Add new course to list
        setCourses((prev) => [response.data, ...prev]);

        // Reset form
        setFormData({
          title: "",
          code: "",
          instructor: "",
          description: "",
        });
        setShowCreateForm(false);

        // Auto-select the new course
        onCourseSelect(response.data);
      } else {
        setFormErrors({
          general: response.message || "Failed to create course",
        });
      }
    } catch (err) {
      setFormErrors({ general: "Failed to connect to server" });
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading courses..." />;
  }

  return (
    <SelectorContainer>
      <div>
        <h2>Select a Course</h2>
        {error && <ErrorText>{error}</ErrorText>}

        <CourseList>
          {courses.length === 0 ? (
            <EmptyState>
              <h3>No courses found</h3>
              <p>Create your first course to get started with VidyaVichara.</p>
            </EmptyState>
          ) : (
            courses.map((course) => (
              <CourseCard
                key={course._id}
                selected={selectedCourse?._id === course._id}
                onClick={() => onCourseSelect(course)}
              >
                <CourseInfo>
                  <div>
                    <CourseTitle>{course.title}</CourseTitle>
                    <CourseDetails>
                      Instructor: {course.instructor}
                    </CourseDetails>
                  </div>
                  <CourseCode>{course.code}</CourseCode>
                </CourseInfo>

                {course.description && (
                  <CourseDetails>{course.description}</CourseDetails>
                )}
              </CourseCard>
            ))
          )}
        </CourseList>
      </div>

      <div>
        {!showCreateForm ? (
          <Card>
            <h3>Create New Course</h3>
            <p>
              Don't see your course? Create a new one to start a Q&A session.
            </p>
            <Button
              variant="primary"
              fullWidth
              onClick={() => setShowCreateForm(true)}
            >
              Create Course
            </Button>
          </Card>
        ) : (
          <CreateCourseForm>
            <FormTitle>Create New Course</FormTitle>

            <form onSubmit={handleCreateCourse}>
              {formErrors.general && (
                <ErrorText style={{ marginBottom: theme.spacing[4] }}>
                  {formErrors.general}
                </ErrorText>
              )}

              <FormGroup>
                <Label htmlFor="title">Course Title *</Label>
                <Input
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Software System Development"
                  error={!!formErrors.title}
                />
                {formErrors.title && <ErrorText>{formErrors.title}</ErrorText>}
              </FormGroup>

              <FormGroup>
                <Label htmlFor="code">Course Code *</Label>
                <Input
                  id="code"
                  name="code"
                  type="text"
                  value={formData.code}
                  onChange={handleInputChange}
                  placeholder="e.g., CS301"
                  error={!!formErrors.code}
                />
                {formErrors.code && <ErrorText>{formErrors.code}</ErrorText>}
              </FormGroup>

              <FormGroup>
                <Label htmlFor="instructor">Instructor Name *</Label>
                <Input
                  id="instructor"
                  name="instructor"
                  type="text"
                  value={formData.instructor}
                  onChange={handleInputChange}
                  placeholder="e.g., Dr. Smith"
                  error={!!formErrors.instructor}
                />
                {formErrors.instructor && (
                  <ErrorText>{formErrors.instructor}</ErrorText>
                )}
              </FormGroup>

              <FormGroup>
                <Label htmlFor="description">Description (Optional)</Label>
                <Input
                  id="description"
                  name="description"
                  type="text"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Brief course description"
                  error={!!formErrors.description}
                />
                {formErrors.description && (
                  <ErrorText>{formErrors.description}</ErrorText>
                )}
              </FormGroup>

              <div style={{ display: "flex", gap: theme.spacing[3] }}>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowCreateForm(false);
                    setFormErrors({});
                    setFormData({
                      title: "",
                      code: "",
                      instructor: "",
                      description: "",
                    });
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={creating}
                  style={{ flex: 1 }}
                >
                  {creating ? "Creating..." : "Create Course"}
                </Button>
              </div>
            </form>
          </CreateCourseForm>
        )}
      </div>
    </SelectorContainer>
  );
};

export default CourseSelector;
