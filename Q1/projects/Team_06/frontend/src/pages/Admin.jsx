import { useEffect, useState } from "react";
import axios from "axios";
// const availableCourses = [
//   "Mathematics",
//   "Physics",
//   "Chemistry",
//   "Biology",
//   "Computer Science",
//   "English",
// ];

export default function SignUp() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Student");
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);


  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/courses");
        setAvailableCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    fetchCourses();
  })
  const handleSubmit = async (e) => {
    e.preventDefault();
     const selectedCourseIds = selectedCourses.map((c) => c._id);
    const response = await axios({
      method: "POST",
      url: "http://localhost:3000/auth/users",
      data: {
        fname: firstName,
        lname: lastName,
        email: email,
        password: password,
        role: role.toLowerCase(),
        courseIds: selectedCourseIds,
      },
    });
    console.log(response.data);
    console.log({
      firstName,
      lastName,
      email,
      password,
      role,
      selectedCourses,
    });
  };

  const handleCourseSelect = (courseId) => {
    const course = availableCourses.find((c) => c._id === courseId);
    if (course && !selectedCourses.some((c) => c._id === courseId)) {
      setSelectedCourses([...selectedCourses, course]);
    }

  };

  const removeCourse = (course) => {
    setSelectedCourses(selectedCourses.filter((c) => c._id !== course));
  };

  const remainingCourses = availableCourses.filter(
    (course) => !selectedCourses.includes(course)
  );

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <img
            alt="Your Company"
            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
            className="mx-auto h-12 w-auto"
          />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Create a new account
          </h2>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white p-8 rounded-2xl shadow-lg"
        >
          {/* First & Last Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-900 mb-1"
              >
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-900 mb-1"
              >
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-900 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-900 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
            />
          </div>

          {/* Role */}
          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-900 mb-1"
            >
              Role
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
            >
              <option>Student</option>
              <option>Instructor</option>
            </select>
          </div>

          {/* Courses */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Courses
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {selectedCourses.map((course) => (
                <span
                  key={course._id}
                  className="flex items-center bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-sm"
                >
                  {course.name}
                  <button
                    type="button"
                    onClick={() => removeCourse(course._id)}
                    className="ml-1 font-bold text-indigo-600 hover:text-indigo-900"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <select
              value=""
              onChange={(e) => handleCourseSelect(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
            >
              <option value="" disabled>
                Select a course
              </option>
              {availableCourses
                .filter((course) => !selectedCourses.some((c) => c._id === course._id))
                .map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.name}
                  </option>
                ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center bg-indigo-600 text-white font-semibold py-2 rounded-md shadow hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}